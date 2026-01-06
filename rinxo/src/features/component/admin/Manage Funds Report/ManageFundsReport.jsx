// import { useEffect, useState } from "react";
// import Button from "../../../../components/common/Button/Button";
// import { ArrowLeft } from "lucide-react";
// import WithdrawalTable from "./WithdrawalTable";
// import DepositTable from "./DepositTable";
// import PaymentsTable from "./PaymentsTable";
// import TransactionTable from "./TransactionTable";
// import { getUserWithdrawals } from "../../../../utils/withdrawal.utils";

// const ManageFundsReport = ({ setShowReport, userId }) => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const [withdrawals, setWithdrawals] = useState([]);
//   const [deposits, setDeposits] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [transactions, setTransactions] = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const sidebarItems = ["Withdrawal", "Deposit", "Payments", "Transaction"];

//   useEffect(() => {
//     // Fetch Withdrawals
//     const fetchWithdrawals = async () => {
//       try {
//         const data = await getUserWithdrawals({ userId });

//         console.log("data: ", data);
//         setWithdrawals(data);
//       } catch (err) {
//         console.error("Error Fetching Withdrawals:", err);
//       }
//     };

//     // Fetch Deposits and Transactions
//     const fetchDepositsAndTransactions = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/user/admin/user-transactions/${userId}`,
//           { credentials: "include" }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP ERROR! Status: ${response.status}`);
//         }

//         const result = await response.json();

//         setDeposits(
//           result.transactions.filter(
//             (t) => t.status !== "pending" && t.type === "deposit"
//           )
//         );

//         setTransactions(result.transactions);
//       } catch (err) {
//         console.error("Error Fetching Deposits:", err);
//       }
//     };

//     // Fetch Payments
//     const fetchPayments = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/user/admin/payments/${userId}`,
//           { credentials: "include" }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP ERROR! Status: ${response.status}`);
//         }

//         const result = await response.json();
//         setPayments(result.payments);
//       } catch (err) {
//         console.error("Error Fetching Payments:", err);
//       }
//     };

//     fetchWithdrawals();
//     fetchDepositsAndTransactions();
//     fetchPayments();
//   }, [userId, isLoading]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab]);

//   const getActiveData = () => {
//     switch (activeTab) {
//       case 0:
//         return withdrawals;
//       case 1:
//         return deposits;
//       case 2:
//         return payments;
//       case 3:
//         return transactions;
//       default:
//         return [];
//     }
//   };

//   const activeData = getActiveData();
//   const totalPages = Math.ceil(activeData.length / itemsPerPage);

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedData = activeData.slice(startIndex, startIndex + itemsPerPage);

//   const handleNext = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   };

//   const handlePrev = () => {
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   };

//   return (
//     <div className="flex flex-col max-h-[88vh] overflow-hidden">
//       <Button
//         btnName="Back"
//         onClick={() => setShowReport(false)}
//         extraCss="fixed top-[70px] mb-4 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
//         bgColour="bg-gray-100"
//         textColour="text-gray-700"
//         hoverBgColour="hover:bg-gray-200"
//       >
//         <ArrowLeft size={18} />
//       </Button>

//       <div className="flex flex-1 overflow-hidden mt-6">
//         <div className="w-56 shrink-0 p-4">
//           <div className="space-y-2">
//             {sidebarItems.map((item, index) => (
//               <button
//                 key={item}
//                 onClick={() => setActiveTab(index)}
//                 className={`w-full text-left px-4 py-3 transition-all
//                   ${
//                     activeTab === index
//                       ? "bg-yellow-400 text-gray-900 font-semibold"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="w-px bg-gray-200" />

//         <div className="flex-1 flex flex-col p-6 overflow-hidden">
//           <div className="flex-1 overflow-auto">
//             {activeTab === 0 && (
//               <WithdrawalTable
//                 withdrawals={paginatedData}
//                 setIsLoading={setIsLoading}
//                 isLoading={isLoading}
//               />
//             )}

//             {activeTab === 1 && <DepositTable deposits={paginatedData} />}

//             {activeTab === 2 && <PaymentsTable payments={paginatedData} />}

//             {activeTab === 3 && (
//               <TransactionTable transactions={paginatedData} />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4 shrink-0">
//         <button
//           onClick={handlePrev}
//           disabled={currentPage === 1}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             currentPage === 1
//               ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//               : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
//           }`}
//         >
//           Previous
//         </button>

//         <span className="text-gray-700 font-medium">
//           Page {currentPage} of {totalPages || 1}
//         </span>

//         <button
//           onClick={handleNext}
//           disabled={currentPage === totalPages || totalPages === 0}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             currentPage === totalPages || totalPages === 0
//               ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//               : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
//           }`}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ManageFundsReport;

 import { useEffect, useState } from "react";
import { ArrowLeft, Download, RefreshCw, Filter, Search } from "lucide-react";
import DepositTable from "./DepositTable";
import WithdrawalTable from "./WithdrawalTable";
import PaymentsTable from "./PaymentsTable";
import TransactionTable from "./TransactionTable";
import { getUserWithdrawals } from "../../../../utils/withdrawal.utils";

const ManageFundsReport = ({ setShowReport, userId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sidebarItems = [
    { name: "Withdrawals", count: withdrawals.length },
    { name: "Deposits", count: deposits.length },
    { name: "Payments", count: payments.length },
    { name: "Transactions", count: transactions.length }
  ];
 console.log(userId)
  useEffect(() => {
    // Fetch Withdrawals
    const fetchWithdrawals = async () => {
      try {
        const response = await getUserWithdrawals({userId})
 
        console.log(response)
        setWithdrawals(response || []);
      } catch (err) {
        console.error("Error Fetching Withdrawals:", err);
      }
    };

    // Fetch Deposits and Transactions
    const fetchDepositsAndTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/admin/user-transactions/${userId}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error(`HTTP ERROR! Status: ${response.status}`);
        }

        const result = await response.json();

        setDeposits(
          result.transactions.filter(
            (t) => t.status !== "pending" && t.type === "deposit"
          )
        );

        setTransactions(result.transactions);
      } catch (err) {
        console.error("Error Fetching Deposits:", err);
      }
    };

    // Fetch Payments
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/admin/payments/${userId}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error(`HTTP ERROR! Status: ${response.status}`);
        }

        const result = await response.json();
        setPayments(result.payments || []);
      } catch (err) {
        console.error("Error Fetching Payments:", err);
      }
    };

    fetchWithdrawals();
    fetchDepositsAndTransactions();
    fetchPayments();
  }, [userId, isLoading]);

  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
  }, [activeTab]);

  const getActiveData = () => {
    switch (activeTab) {
      case 0: return withdrawals;
      case 1: return deposits;
      case 2: return payments;
      case 3: return transactions;
      default: return [];
    }
  };

  const activeData = getActiveData();
  const totalPages = Math.ceil(activeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = activeData.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const formatAmount = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return Number(value).toFixed(2);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      completed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      failed: "bg-red-100 text-red-700 border-red-200"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowReport(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-sm text-gray-500">Manage user transactions and withdrawals</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw size={20} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(index)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                  activeTab === index
                    ? "bg-yellow-400 text-gray-900 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeTab === index
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {activeTab === 0 && <WithdrawalTable data={paginatedData} formatAmount={formatAmount} StatusBadge={StatusBadge} />}
              {activeTab === 1 && <DepositTable data={paginatedData} formatAmount={formatAmount} />}
              {activeTab === 2 && <PaymentsTable data={paginatedData} formatAmount={formatAmount} StatusBadge={StatusBadge} />}
              {activeTab === 3 && <TransactionTable data={paginatedData} formatAmount={formatAmount} StatusBadge={StatusBadge} />}
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, activeData.length)}</span> of{" "}
                <span className="font-medium">{activeData.length}</span> results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 font-medium">
                  {currentPage} / {totalPages || 1}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const WithdrawalTable = ({ data, formatAmount, StatusBadge }) => {
//   const [dirtyRows, setDirtyRows] = useState(new Set());
//   const [status, setStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const updateWithdrawalStatus = async (status, withdrawId) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/withdrawal/${withdrawId}`,
//         {
//           method: "PATCH",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP ERROR! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("result: ", result);
//       window.location.reload();
//     } catch (err) {
//       console.error(`Server Error! ${err}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleWithdrawStatusChange = (e, rowIndex) => {
//     const value = e.target.value;

//     if (value === "") {
//       setDirtyRows((prev) => {
//         const updated = new Set(prev);
//         updated.delete(rowIndex);
//         return updated;
//       });
//       return;
//     }

//     setDirtyRows((prev) => {
//       const updated = new Set(prev);
//       updated.add(rowIndex);
//       return updated;
//     });
//     setStatus(value);
//   };

//   const handleSave = (rowIndex, id) => {
//     setDirtyRows((prev) => {
//       const updated = new Set(prev);
//       updated.delete(rowIndex);
//       return updated;
//     });

//     updateWithdrawalStatus(status, id);
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead className="bg-gray-50 border-b border-gray-200">
//           <tr>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">ID</th>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Account Details</th>
//             <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Bank Info</th>
//             <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
//             <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Fee</th>
//             <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Net Amount</th>
//             <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
//             <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {data?.map((w, i) => (
//             <tr key={i} className="hover:bg-gray-50 transition-colors">
//               <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
//               <td className="py-4 px-4">
//                 <div className="text-sm font-medium text-gray-900">{w.details.accountName}</div>
//                 <div className="text-xs text-gray-500">{w.details.accountNumber}</div>
//               </td>
//               <td className="py-4 px-4">
//                 <div className="text-sm text-gray-900">{w.details.bankName}</div>
//                 <div className="text-xs text-gray-500">SWIFT: {w.details.swiftCode}</div>
//               </td>
//               <td className="py-4 px-4 text-right text-sm font-medium text-gray-900">
//                 {w.currency} {formatAmount(w.amount)}
//               </td>
//               <td className="py-4 px-4 text-right text-sm text-gray-600">
//                 {formatAmount(w.processing_fee)}
//               </td>
//               <td className="py-4 px-4 text-right text-sm font-semibold text-green-600">
//                 {formatAmount(w.net_amount)}
//               </td>
//               <td className="py-4 px-4 text-center">
//                 <StatusBadge status={w.status} />
//               </td>
//               <td className="py-4 px-4 text-center">
//                 {w.status === "pending" && (
//                   <div className="flex gap-2 justify-center items-center">
//                     <select 
//                       onChange={(e) => handleWithdrawStatusChange(e, i)}
//                       className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                     >
//                       <option value="">Action</option>
//                       <option value="completed">Approve</option>
//                       <option value="cancelled">Reject</option>
//                     </select>
//                     {dirtyRows.has(i) && (
//                       <button
//                         onClick={() => handleSave(i, w._id)}
//                         disabled={isLoading}
//                         className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
//                       >
//                         Save
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const DepositTable = ({ data, formatAmount }) => (
//   <div className="overflow-x-auto">
//     <table className="w-full">
//       <thead className="bg-gray-50 border-b border-gray-200">
//         <tr>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">ID</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Payment ID</th>
//           <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Balance Change</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Description</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-gray-100">
//         {data?.map((d, i) => (
//           <tr key={i} className="hover:bg-gray-50 transition-colors">
//             <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
//             <td className="py-4 px-4 text-sm font-mono text-gray-600">{d.payment_id}</td>
//             <td className="py-4 px-4 text-right text-sm font-semibold text-green-600">
//               +{d.currency.toUpperCase()} {formatAmount(d.amount)}
//             </td>
//             <td className="py-4 px-4 text-sm text-gray-600">
//               {formatAmount(d.balance_before)} → {formatAmount(d.balance_after)}
//             </td>
//             <td className="py-4 px-4 text-sm text-gray-900">{d.description}</td>
//             <td className="py-4 px-4 text-sm text-gray-600">{d.created_at.split("T")[0]}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const PaymentsTable = ({ data, formatAmount, StatusBadge }) => (
//   <div className="overflow-x-auto">
//     <table className="w-full">
//       <thead className="bg-gray-50 border-b border-gray-200">
//         <tr>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">ID</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Payment ID</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
//           <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Currency</th>
//           <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-gray-100">
//         {data?.map((p, i) => (
//           <tr key={i} className="hover:bg-gray-50 transition-colors">
//             <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
//             <td className="py-4 px-4 text-sm font-mono text-gray-600">{p.payment_id}</td>
//             <td className="py-4 px-4 text-sm font-mono text-gray-600">{p.order_id}</td>
//             <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
//               {formatAmount(p.price_amount)}
//             </td>
//             <td className="py-4 px-4 text-sm text-gray-600">{p.pay_currency}</td>
//             <td className="py-4 px-4 text-center">
//               <StatusBadge status={p.payment_status} />
//             </td>
//             <td className="py-4 px-4 text-sm text-gray-600">{p.created_at.split("T")[0]}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const TransactionTable = ({ data, formatAmount, StatusBadge }) => (
//   <div className="overflow-x-auto">
//     <table className="w-full">
//       <thead className="bg-gray-50 border-b border-gray-200">
//         <tr>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">ID</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Payment ID</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
//           <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Balance Change</th>
//           <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
//           <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-gray-100">
//         {data?.map((t, i) => (
//           <tr key={i} className="hover:bg-gray-50 transition-colors">
//             <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
//             <td className="py-4 px-4 text-sm font-mono text-gray-600">{t.payment_id}</td>
//             <td className="py-4 px-4">
//               <span className={`px-2 py-1 rounded text-xs font-medium ${
//                 t.type === "deposit" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
//               }`}>
//                 {t.type.toUpperCase()}
//               </span>
//             </td>
//             <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
//               {t.currency.toUpperCase()} {formatAmount(t.amount)}
//             </td>
//             <td className="py-4 px-4 text-sm text-gray-600">
//               {t.status === "completed" 
//                 ? `${formatAmount(t.balance_before)} → ${formatAmount(t.balance_after)}`
//                 : "N/A"
//               }
//             </td>
//             <td className="py-4 px-4 text-center">
//               <StatusBadge status={t.status} />
//             </td>
//             <td className="py-4 px-4 text-sm text-gray-600">{t.created_at.split("T")[0]}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

export default ManageFundsReport;