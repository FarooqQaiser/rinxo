import express from "express";
import { uploadNIC } from "../middlewares/upload.middleware.js";
import {
  activateUser,
  addBankDeposit,
  deleteUser,
  exportUserReport,
  fetchUserDeposits,
  showAllPayments,
  showAllUsers,
  showloggedInAdminData,
  showSingleUser,
  showUserAndHisAllTransactions,
  updateAdminPassword,
  updateAdminProfile,
  updateBankDepositStatus,
  uploadNICImages,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middlerware.js";
import { uploadSingleImage } from "../middlewares/uploadDepositProof.middleware.js";

const router = express.Router();

// USER ROUTES
router.post("/upload-nic", protect, uploadNIC, uploadNICImages);

// ADMIN ROUTES
router.get("/admin/users", protect, showAllUsers);
router.delete("/admin/users/:idToDeleteUser", protect, deleteUser);
router.patch("/admin/users/:idToActivateUser", protect, activateUser);
router.get("/admin", protect, showloggedInAdminData);
// router.patch("/admin", protect, updateLoggedInAdminData);
router.patch("/admin/update-profile/:id", protect, updateAdminProfile);
router.patch("/admin/update-password/:id", protect, updateAdminPassword);
router.get("/admin/payments/:userId", protect, showAllPayments);
router.get(
  "/admin/user-transactions/:userId",
  protect,
  showUserAndHisAllTransactions
);
router.get("/admin/export-user-report/:userId", protect, exportUserReport);

// user
router.get("/userData/:userId", protect, showSingleUser);
router.post(
  "/deposit",
  protect,
  uploadSingleImage("proofImage"),
  addBankDeposit
);
router.get("/deposits/:userId", protect, fetchUserDeposits);
router.patch("/deposits/:userId/:depositId", protect, updateBankDepositStatus);

export default router;
