import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Withdrawal, {
  Payment,
  Transaction,
  UserBalance,
} from "../models/payment.models.js";
import PDFDocument from "pdfkit";

export const uploadNICImages = async (req, res) => {
  try {
    const userData = req.user;

    if (!req.files?.frontImage || !req.files?.backImage) {
      return res.status(400).json({
        success: false,
        message: "Both front and back NIC images are required!",
      });
    }

    // ✅ Convert backslashes to forward slashes
    const frontImagePath = req.files.frontImage[0].path.replace(/\\/g, "/");
    const backImagePath = req.files.backImage[0].path.replace(/\\/g, "/");

    // ✅ Extract relative path WITHOUT leading slash
    const frontImageRelative = frontImagePath.includes("uploads/")
      ? frontImagePath.split("uploads/")[1]
      : frontImagePath;

    const backImageRelative = backImagePath.includes("uploads/")
      ? backImagePath.split("uploads/")[1]
      : backImagePath;

    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }

    if (["active", "pending"].includes(user.status)) {
      return res.status(400).json({
        success: false,
        message: `NIC already uploaded! Status: ${user.status}`,
      });
    }

    user.nic = {
      frontImage: frontImageRelative, // ✅ Store as "nic/filename.png" (no leading slash)
      backImage: backImageRelative,
    };
    user.status = "pending";

    await user.save();

    return res.status(201).json({
      success: true,
      message: "NIC uploaded successfully!",
      nicStatus: user.status,
      nic: user.nic,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

export const showAllUsers = async (req, res) => {
  try {
    const userData = req.user;

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User data not sent!",
      });
    }

    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with email: ${userData.email} does not exists!`,
      });
    }

    const users = await User.find({ role: "user" });

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "Users do not exists!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users recieved successfully!",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

export const showSingleUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    // Ensure requester exists (admin check can be middleware)
    const user = await User.findOne({
      _id: userId,
    });

    // const user = await User.findOne({
    //   _id: userId,
    //   role: "user",
    // }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully!",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const idToDeleteUser = req.params.idToDeleteUser;
    console.log("idToDeleteUser: ", idToDeleteUser);

    const deleteUser = await User.deleteOne({ _id: idToDeleteUser });

    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: `User id: not found!`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `User deleted successfully!`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

export const activateUser = async (req, res) => {
  try {
    const id = req.params.idToActivateUser;
    const status = req.body.status;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id not sent",
      });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found!`,
      });
    }

    await User.updateOne({ _id: user._id }, { $set: { status: status } });

    return res.status(200).json({
      success: true,
      message: `User updated successfully!`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

export const showloggedInAdminData = async (req, res) => {
  try {
    const id = req.user._id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required!",
      });
    }

    const user = await User.findById({ _id: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id: ${id} is not found!`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found successfully!",
      user: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { fullName, phoneNumber } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "  ID is required",
      });
    }

    const admin = await User.findOne({ _id: id });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    const phoneExists = await User.exists({
      phoneNumber,
      _id: { $ne: admin._id },
    });

    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Change Your Number",
      });
    }

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes provided",
      });
    }

    await User.updateOne({ _id: id }, { $set: updateData });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAdminPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    const admin = await User.findOne({ _id: id });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const showAllPayments = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return req.status(401).json({
        success: false,
        message: "User ID is required!",
      });
    }

    const payments = await Payment.find({ user_id: userId });

    if (!payments) {
      return res.status(404).json({
        success: false,
        message: "Payments/Funds not found!",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID: ${userId} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payments/Funds retrieved successfully!",
      payments,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

export const showUserAndHisAllTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Send userId in the params!",
      });
    }

    const userTransactions = await Transaction.find({ user_id: userId });

    if (!userTransactions) {
      return res.status(404).json({
        success: false,
        message: `Transactions not found with userId: ${userId}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User transaction found",
      transactions: userTransactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`,
    });
  }
};

const formatAmount = (value) => {
  const num = Number(value);
  if (value === null || value === undefined || Number.isNaN(num)) {
    return "-";
  }
  return num.toFixed(2);
};

const drawTableHeader = (doc, headers, colX, colW, startY) => {
  doc.font("Helvetica-Bold").fontSize(8);

  const headerHeight = 14; // fixed header height
  const textY = startY;

  headers.forEach((h) => {
    doc.text(h.label, colX[h.key], textY, {
      width: colW[h.key] + 15,
      align: "left",
      lineBreak: false, // 🔴 PREVENT wrapping
      ellipsis: true, // optional: trims overflow safely
    });
  });

  // Draw underline BELOW header text (not overlapping)
  const lineY = textY + headerHeight;

  doc
    .moveTo(40, lineY)
    .lineTo(doc.page.width - 40, lineY)
    .stroke();

  doc.font("Helvetica");

  // Return Y position for rows to start
  return lineY + 6;
};

const getRowHeight = (doc, cells) => {
  return Math.max(
    ...cells.map((c) =>
      doc.heightOfString(c.text || "-", {
        width: c.width,
        lineGap: 2,
      })
    )
  );
};

export const exportUserReport = async (req, res) => {
  let doc;

  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const withdrawals = await Withdrawal.find({ user_id: userId });
    const transactions = await Transaction.find({ user_id: userId });
    const payments = await Payment.find({ user_id: userId });
    const deposits = transactions.filter(
      (t) => t.type === "deposit" && t.status !== "pending"
    );
    const bankDeposits = user.bankDeposits;

    if (
      !withdrawals.length &&
      !transactions.length &&
      !payments.length &&
      bankDeposits.length
    ) {
      return res
        .status(404)
        .json({ success: false, message: "No report data" });
    }

    doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=user-report.pdf"
    );
    doc.pipe(res);

    /* -------------------- TITLE -------------------- */

    doc.fontSize(18).text("User Financial Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("User Details");
    doc
      .fontSize(10)
      .text(
        `Name: ${user.fullName} | Email: ${user.email} | Phone: ${user.phoneNumber}`
      );
    doc.moveDown(1.5);

    /* ==================== WITHDRAWALS ==================== */

    doc.fontSize(14).text("Withdrawals");
    doc.moveDown(0.5);

    const wHeaders = [
      { key: "id", label: "ID" },
      { key: "account", label: "ACCOUNT DETAILS" },
      { key: "bank", label: "BANK INFO" },
      { key: "amount", label: "AMOUNT" },
      { key: "fee", label: "FEE" },
      { key: "net", label: "NET AMOUNT" },
      { key: "status", label: "STATUS" },
    ];

    const wColX = {
      id: 40,
      account: 60,
      bank: 180,
      amount: 300,
      fee: 350,
      net: 400,
      status: 470,
    };
    const wColW = {
      id: 20,
      account: 110,
      bank: 110,
      amount: 40,
      fee: 40,
      net: 60,
      status: 70,
    };

    let y = doc.y;
    drawTableHeader(doc, wHeaders, wColX, wColW, y);
    y += 20;

    withdrawals.forEach((w, i) => {
      const cells = [
        { text: String(i + 1), width: wColW.id },

        {
          text:
            w.method === "crypto"
              ? `Currency: ${w.details.currency}\n${w.details.walletAddress}`
              : `${w.details.accountName}\n Acc: ${w.details.accountNumber}`,
          width: wColW.account,
        },

        {
          text:
            w.method === "crypto"
              ? `Network: ${w.details.network}`
              : `${w.details.bankName}\n SWIFT: ${w.details.swiftCode}\n Routing: ${w.details.routingNumber}`,
          width: wColW.bank,
        },

        { text: formatAmount(w.amount), width: wColW.amount },
        { text: formatAmount(w.processing_fee), width: wColW.fee },
        { text: formatAmount(w.net_amount), width: wColW.net },
        { text: w.status, width: wColW.status },
      ];

      const rowHeight = getRowHeight(doc, cells) + 6;
      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50;
        drawTableHeader(doc, wHeaders, wColX, wColW, y);
        y += 20;
      }

      cells.forEach((cell, idx) => {
        doc.text(cell.text, wColX[wHeaders[idx].key], y, {
          width: cell.width,
          lineGap: 2,
        });
      });

      y += rowHeight;
    });

    doc.addPage();

    /* ==================== DEPOSITS ==================== */

    doc.fontSize(14).text("Deposits");
    doc.moveDown(0.5);

    const dHeaders = [
      { key: "id", label: "ID" },
      { key: "pid", label: "PAYMENT ID" },
      { key: "amount", label: "AMOUNT" },
      { key: "balance", label: "BALANCE CHANGE" },
      { key: "desc", label: "DESCRIPTION" },
      { key: "date", label: "DATE" },
    ];

    const dColX = {
      id: 40,
      pid: 60,
      amount: 140,
      balance: 190,
      desc: 280,
      date: 430,
    };
    const dColW = {
      id: 20,
      pid: 70,
      amount: 40,
      balance: 80,
      desc: 140,
      date: 100,
    };

    y = doc.y;
    drawTableHeader(doc, dHeaders, dColX, dColW, y);
    y += 20;

    deposits.forEach((d, i) => {
      const cells = [
        { text: String(i + 1), width: dColW.id },
        { text: d.payment_id, width: dColW.pid },
        { text: formatAmount(d.amount), width: dColW.amount },
        {
          text: `${formatAmount(d.balance_before)} → ${formatAmount(
            d.balance_after
          )}`,
          width: dColW.balance,
        },
        { text: d.description || "-", width: dColW.desc },
        { text: new Date(d.created_at).toLocaleString(), width: dColW.date },
      ];

      const rowHeight = getRowHeight(doc, cells) + 6;
      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50;
        drawTableHeader(doc, dHeaders, dColX, dColW, y);
        y += 20;
      }

      cells.forEach((cell, idx) => {
        doc.text(cell.text, dColX[dHeaders[idx].key], y, {
          width: cell.width,
          lineGap: 2,
        });
      });

      y += rowHeight;
    });

    doc.addPage();

    /* ==================== BANK DEPOSITS ==================== */

    doc.fontSize(14).text("Bank Deposits");
    doc.moveDown(0.5);

    const bDHeaders = [
      { key: "id", label: "ID" },
      { key: "accountN", label: "ACCOUNT NUMBER" },
      { key: "bankN", label: "BANK NAME" },
      { key: "amount", label: "AMOUNT" },
      { key: "status", label: "STATUS" },
      { key: "date", label: "DATE" },
    ];

    // X positions (continuous)
    const bDColX = {
      id: 40,
      accountN: 70,
      bankN: 170,
      amount: 300,
      status: 360,
      date: 450,
    };

    // Widths (match content)
    const bDColW = {
      id: 30,
      accountN: 90,
      bankN: 120,
      amount: 60,
      status: 80,
      date: 110,
    };

    y = doc.y;
    drawTableHeader(doc, bDHeaders, bDColX, bDColW, y);
    y += 22;

    bankDeposits.forEach((bD, i) => {
      const cells = [
        { text: String(i + 1), width: bDColW.id },
        { text: bD.accountNumber, width: bDColW.accountN },
        { text: bD.bankName, width: bDColW.bankN },
        { text: bD.amount, width: bDColW.amount },
        { text: bD.status, width: bDColW.status },
        { text: new Date(bD.depositedAt).toLocaleString(), width: bDColW.date },
      ];

      const rowHeight = getRowHeight(doc, cells) + 6;
      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50;
        drawTableHeader(doc, bDHeaders, bDColX, bDColW, y);
        y += 20;
      }

      cells.forEach((cell, idx) => {
        doc.text(cell.text, bDColX[bDHeaders[idx].key], y, {
          width: cell.width,
          lineGap: 2,
        });
      });

      y += rowHeight;
    });

    doc.addPage();

    /* ==================== PAYMENTS ==================== */

    doc.fontSize(14).text("Payments");
    doc.moveDown(0.5);

    const pHeaders = [
      { key: "id", label: "ID" },
      { key: "pid", label: "PAYMENT ID" },
      { key: "oid", label: "ORDER ID" },
      { key: "amount", label: "AMOUNT" },
      { key: "currency", label: "CURRENCY" },
      { key: "status", label: "STATUS" },
      { key: "date", label: "DATE" },
    ];

    const pColX = {
      id: 40,
      pid: 60,
      oid: 150,
      amount: 260,
      currency: 310,
      status: 360,
      date: 430,
    };
    const pColW = {
      id: 20,
      pid: 80,
      oid: 100,
      amount: 40,
      currency: 40,
      status: 60,
      date: 100,
    };

    y = doc.y;
    drawTableHeader(doc, pHeaders, pColX, pColW, y);
    y += 20;

    payments.forEach((p, i) => {
      const cells = [
        { text: String(i + 1), width: pColW.id },
        { text: p.payment_id, width: pColW.pid },
        { text: p.order_id, width: pColW.oid },
        { text: formatAmount(p.price_amount), width: pColW.amount },
        { text: p.pay_currency?.toUpperCase(), width: pColW.currency },
        { text: p.payment_status, width: pColW.status },
        { text: new Date(p.created_at).toLocaleString(), width: pColW.date },
      ];

      const rowHeight = getRowHeight(doc, cells) + 6;
      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50;
        drawTableHeader(doc, pHeaders, pColX, pColW, y);
        y += 20;
      }

      cells.forEach((cell, idx) => {
        doc.text(cell.text, pColX[pHeaders[idx].key], y, {
          width: cell.width,
          lineGap: 2,
        });
      });

      y += rowHeight;
    });

    /* ==================== TRANSACTIONS (✅ FIXED & ADDED) ==================== */
    doc.addPage();
    doc.fontSize(14).text("Transactions");
    doc.moveDown(0.5);

    const tHeaders = [
      { key: "id", label: "ID" },
      { key: "pid", label: "PAYMENT ID" },
      { key: "type", label: "TYPE" },
      { key: "amount", label: "AMOUNT" },
      { key: "balance", label: "BALANCE CHANGE" },
      { key: "status", label: "STATUS" },
      { key: "date", label: "DATE" },
    ];

    const tColX = {
      id: 40,
      pid: 60,
      type: 150,
      amount: 210,
      balance: 270,
      status: 390,
      date: 450,
    };
    const tColW = {
      id: 20,
      pid: 80,
      type: 50,
      amount: 60,
      balance: 110,
      status: 60,
      date: 95,
    };

    y = doc.y;
    drawTableHeader(doc, tHeaders, tColX, tColW, y);
    y += 20;

    transactions.forEach((t, i) => {
      const cells = [
        { text: String(i + 1), width: tColW.id },
        { text: t.payment_id || "-", width: tColW.pid },
        { text: t.type || "-", width: tColW.type },
        {
          text: `${formatAmount(t.amount)} ${t.currency?.toUpperCase() || ""}`,
          width: tColW.amount,
        },
        {
          text:
            t.balance_before != null && t.balance_after != null
              ? `${formatAmount(t.balance_before)} => ${formatAmount(
                  t.balance_after
                )}`
              : "-",
          width: tColW.balance,
        },
        { text: t.status || "-", width: tColW.status },
        { text: new Date(t.created_at).toLocaleString(), width: tColW.date },
      ];

      const rowHeight = getRowHeight(doc, cells) + 6;

      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        y = 50;
        drawTableHeader(doc, tHeaders, tColX, tColW, y);
        y += 20;
      }

      cells.forEach((cell, idx) => {
        doc.text(cell.text, tColX[tHeaders[idx].key], y, {
          width: cell.width,
          lineGap: 2,
        });
      });

      y += rowHeight;
    });

    doc.end();
  } catch (err) {
    console.error("PDF Export Error:", err);
    if (doc) doc.destroy();
  }
};

// export const addBankDeposit = async (req, res) => {
//   try {
//     const userData = req.user;
//     const { amount, bankName, accountNumber } = req.body;

//     const user = await User.findById(userData._id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: `User with id: ${userData._id}, not found!`,
//       });
//     }

//     if (!amount || !bankName || !accountNumber) {
//       return res.status(400).json({
//         success: false,
//         message: "Amount, bank name and account number are required!",
//       });
//     }

//     const uniquePaymentId = `TXN-${Date.now()}-${Math.floor(
//       Math.random() * 10000
//     )}`;
//     const order_id = `DEP-${req.userId}-${Date.now()}`;

//     const payment = new Payment({
//       payment_id: uniquePaymentId,
//       order_id,
//       user_id: user._id,
//       price_amount: amount,
//       price_currency: "usd",
//       bank_name: bankName,
//       account_number: accountNumber,
//       payment_status: "pending",
//     });

//     const transaction = new Transaction({
//       user_id: user._id,
//       payment_id: uniquePaymentId,
//       type: "deposit",
//       amount: amount,
//       currency: "usd",
//       status: "pending",
//       description: "Bank deposit",
//     });

//     const proofImage = req.files.path.replace(/\\/g, "/"); 
// console.log("Proof Image Path:", proofImage);
//     // ✅ Extract relative path WITHOUT leading slash
//     const imagePath = proofImage.includes("uploads/")
//       ? proofImage.split("uploads/")[1]
//       : proofImage;


//     const deposit = {
//       amount,
//       payment_id: uniquePaymentId,
//       bankName,
//       accountNumber,
//       proofImage: imagePath,
//       status: "pending",
//     };

//     await payment.save();
//     await transaction.save();
//     user.bankDeposits.push(deposit);
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "User's fundes deposited successfully!",
//       deposit,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: `Server Error: ${err}`,
//     });
//   }
// };

export const addBankDeposit = async (req, res) => {
  try {
    const userData = req.user;
    const { amount, bankName, accountNumber } = req.body;

    const user = await User.findById(userData._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id: ${userData._id}, not found!`,
      });
    }

    if (!amount || !bankName || !accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Amount, bank name and account number are required!",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Proof image is required!",
      });
    }

    const uniquePaymentId = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;
    const order_id = `DEP-${req.userId}-${Date.now()}`;

    const payment = new Payment({
      payment_id: uniquePaymentId,
      order_id,
      user_id: user._id,
      price_amount: amount,
      price_currency: "usd",
      bank_name: bankName,
      account_number: accountNumber,
      payment_status: "pending",
    });

    const transaction = new Transaction({
      user_id: user._id,
      payment_id: uniquePaymentId,
      type: "deposit",
      amount,
      currency: "usd",
      status: "pending",
      description: "Bank deposit",
    });


    const proofImage = req.file.path.replace(/\\/g, "/");

    const imagePath = proofImage.includes("uploads/")
      ? proofImage.split("uploads/")[1]
      : proofImage;

    const deposit = {
      amount,
      payment_id: uniquePaymentId,
      bankName,
      accountNumber,
      proofImage: imagePath,
      status: "pending",
    };

    await payment.save();
    await transaction.save();
    user.bankDeposits.push(deposit);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User's funds deposited successfully!",
      deposit,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err}`,
    });
  }
};


export const fetchUserDeposits = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: `Send user id in params!`,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id: ${userId}, not found!`,
      });
    }

    const deposits = user.bankDeposits.map((deposit) => ({
      _id: deposit._id,
      amount: deposit.amount,
      bankName: deposit.bankName,
      accountNumber: deposit.accountNumber,
      status: deposit.status,
      depositedAt: deposit.depositedAt,
      proofImage: deposit.proofImage,
      payment_id: deposit.payment_id,
    }));

    return res.status(200).json({
      success: true,
      message: "Successfully fetched deposits!",
      totalDeposits: deposits.length,
      deposits: deposits,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err}`,
    });
  }
};

export const updateBankDepositStatus = async (req, res) => {
  try {
    const { userId, depositId } = req.params;
    const { status } = req.body;

    if (!userId || !depositId || !status) {
      return res.status(400).json({
        success: false,
        message: "userId, depositId and status are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const deposit = user.bankDeposits.find(
      (d) => d._id.toString() === depositId
    );

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Bank deposit not found",
      });
    }

    if (deposit.status === "verified" || deposit.status === "verified") {
      return res.status(400).json({
        success: false,
        message: "Deposit already completed",
      });
    }
    deposit.status = status;

    const payment = await Payment.findOne({ payment_id: deposit.payment_id });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    payment.payment_status = status;

    const transaction = await Transaction.findOne({
      payment_id: deposit.payment_id,
    });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    transaction.status = status;

    if (status === "verified") {
      let userBalance = await UserBalance.findOne({ user_id: user._id });

      if (!userBalance) {
        userBalance = new UserBalance({
          user_id: user._id,
          balance: deposit.amount,
        });

        transaction.balance_before = 0;
        transaction.balance_after = deposit.amount;
      } else {
        transaction.balance_before = userBalance.balance;
        userBalance.balance += deposit.amount;
        transaction.balance_after = userBalance.balance;
      }

      user.funds += deposit.amount;
      await userBalance.save();
    }

    await user.save();
    await payment.save();
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Bank deposit status updated successfully",
      deposit,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
