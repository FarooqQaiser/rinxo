import { useEffect, useState } from "react";
import { ArrowLeft, Download, Search, Menu } from "lucide-react";
import WithdrawalTable from "./WithdrawalTable";
import PaymentsTable from "./PaymentsTable";
import TransactionTable from "./TransactionTable";
import { getUserWithdrawals } from "../../../../utils/withdrawal.utils";
import BankDepositsTable from "./BankDepositsTable";
import CryptoDepositTable from "./CryptoDepositTable";

const ManageFundsReport = ({ setShowReport, userId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bankDeposits, setBankDeposits] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sidebarItems = [
    { name: "Withdrawals", count: withdrawals.length },
    { name: "Crypto Deposits", count: deposits.length },
    { name: "Payments", count: payments.length },
    { name: "Transactions", count: transactions.length },
    { name: "Bank Deposits", count: bankDeposits.length },
  ];

  useEffect(() => {
    // Fetch Withdrawals
    const fetchWithdrawals = async () => {
      try {
        const response = await getUserWithdrawals({ userId });
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
            (t) => t.status == "completed" && t.type === "deposit"
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

    // Fetch Bank Deposits
    const fetchBankDeposits = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/deposits/${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ERROR! Status: ${response.status}`);
        }

        const result = await response.json();
        // console.log("result: ", result);
        setBankDeposits(result.deposits);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWithdrawals();
    fetchDepositsAndTransactions();
    fetchPayments();
    fetchBankDeposits();
  }, [userId, isLoading]);

  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
  }, [activeTab]);

  const withdrawalsStatusCounts = withdrawals.reduce(
    (acc, w) => {
      acc.all += 1;
      if (w.status === "completed") acc.completed += 1;
      if (w.status === "pending") acc.pending += 1;
      if (w.status === "cancelled") acc.cancelled += 1;
      if (w.status === "failed") acc.failed += 1;

      return acc;
    },
    { all: 0, completed: 0, pending: 0, cancelled: 0, failed: 0 }
  );

  const getActiveData = () => {
    switch (activeTab) {
      case 0:
        return withdrawals.filter((w) =>
          statusFilter === "All" ? true : w.status === statusFilter
        );

      case 1:
        return deposits.filter((d) =>
          d.payment_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 2:
        return payments.filter((p) =>
          p.payment_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 3:
        return transactions.filter((t) =>
          t.payment_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 4:
        return bankDeposits;
      // .filter((bd) =>
      //   bd.payment_id.toLowerCase().includes(searchTerm.toLowerCase())
      // );
      default:
        return [];
    }
  };

  const activeData = getActiveData();
  const totalPages = Math.ceil(activeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = activeData.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return Number(value).toFixed(2);
  };

  const handleExportButton = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/admin/export-user-report/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "user-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Error exporting user report: ", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* {sidebarOpen && ( */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="cursor-pointer"
            >
              <Menu />
            </button>
            {/* )} */}

            <button
              onClick={() => setShowReport(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Financial Reports
              </h1>
              <p className="text-sm text-gray-500">
                Manage user transactions and withdrawals
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw size={20} />
            </button> */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium cursor-pointer"
              onClick={handleExportButton}
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className={"flex flex-1 overflow-hidden "}>
        {/* Sidebar */}
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden
          ${sidebarOpen ? "w-60 p-4" : "w-0 p-0"}`}
        >
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(index)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group cursor-pointer ${
                  activeTab === index
                    ? "bg-yellow-400 text-gray-900 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === index
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className={"flex-1 flex flex-col overflow-hidden"}>
          {/* Search & Filter Bar */}
          <div className={"bg-white border-b border-gray-200 px-6 py-4"}>
            {activeTab !== 0 ? (
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search Payment ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 sm:flex-none sm:w-40 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none cursor-pointer"
                >
                  <option value="All">
                    All ({withdrawalsStatusCounts.all})
                  </option>
                  <option value="completed">
                    Completed ({withdrawalsStatusCounts.completed})
                  </option>
                  <option value="pending">
                    Pending ({withdrawalsStatusCounts.pending})
                  </option>
                  <option value="cancelled">
                    Cancelled ({withdrawalsStatusCounts.cancelled})
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Table Content */}
          <div className={"flex-1 overflow-auto p-6"}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {activeTab === 0 && (
                <WithdrawalTable
                  data={paginatedData}
                  formatAmount={formatAmount}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}
              {activeTab === 1 && (
                <CryptoDepositTable
                  data={paginatedData}
                  formatAmount={formatAmount}
                />
              )}
              {activeTab === 2 && (
                <PaymentsTable
                  data={paginatedData}
                  formatAmount={formatAmount}
                />
              )}
              {activeTab === 3 && (
                <TransactionTable
                  data={paginatedData}
                  formatAmount={formatAmount}
                />
              )}
              {activeTab === 4 && (
                <BankDepositsTable
                  data={paginatedData}
                  userId={userId}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, activeData.length)}
                </span>{" "}
                of <span className="font-medium">{activeData.length}</span>{" "}
                results
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

export default ManageFundsReport;
