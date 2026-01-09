import { FileText, Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usersData } from "../../../utils/user.utils";
import ManageFundsReport from "./Manage Funds Report/ManageFundsReport";
import { getUserWithdrawals } from "../../../utils/withdrawal.utils";

export default function ManageFunds() {
  const [users, setUsers] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [userId, setUserId] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(3);
  const [filterStatus, setFilterStatus] = useState("All");
  const [depositStatus, setDepositStatus] = useState("All");

  const getPendingUserIds = (withdrawals) =>
    [...new Set(
      withdrawals
        .flat()
        .filter((w) => w.status === "pending")
        .map((w) => w.user_id.toString())
    )];

    const getDepositsPending = (user) =>
    {
      const hasPending = user.bankDeposits
      .flat()
      .some((d) => d.status === "pending");
      return hasPending ? user._id.toString() : null; 
    }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data = [] } = await usersData();
        setUsers(data);
    
        const withdrawals = await Promise.all(
          data.map((u) => getUserWithdrawals({ userId: u._id }))
        ); 
        const depositsPending = await Promise.all(
          data.map((u) => getDepositsPending(u))
        ) 
        setPendingWithdrawals(getPendingUserIds(withdrawals));
        setPendingDeposits(depositsPending);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [showReport]);

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // const filteredUsers =
  //   filterStatus === "All"
  //     ? users
  //     : users.filter((u) => pendingWithdrawals.includes(u._id));
const filteredUsers = users.filter((u) => {
  const hasWithdrawal = pendingWithdrawals.includes(u._id.toString());
  const hasDeposit = pendingDeposits.includes(u._id.toString());

  if (filterStatus === "pending" && !hasWithdrawal) return false;
  if (depositStatus === "pending" && !hasDeposit) return false;

  return true;
});

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const hasPendingWithdrawal = (userId) => pendingWithdrawals.includes(userId);
  const hasPendingDeposit = (userId) => pendingDeposits.includes(userId);
  return (
    <div className="min-h-screen">
      {showReport ? (
        <ManageFundsReport userId={userId} setShowReport={setShowReport} />
      ) : (
        <div className="p-3 sm:p-6">
          {/* Filters - Responsive Layout */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-gray-700 font-medium text-sm sm:text-base">
                Withdrawals Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-gray-700 font-medium text-sm sm:text-base">
                Deposit Status
              </label>
              <select
                value={depositStatus}
                onChange={(e) => setDepositStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-gray-700 font-medium text-sm sm:text-base">
                Users per page:
              </label>
              <select
                value={usersPerPage}
                onChange={handleUsersPerPageChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={users.length}>All</option>
              </select>
            </div>
          </div>

          {/* Desktop Table View - Hidden on Mobile */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="w-full text-left">
              <thead className="border-b-2 border-gray-200 bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Id</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Name</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Email</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Balance</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold">Report</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr
                      key={user._id}
                      className={`border-b border-gray-100 hover:bg-gray-50
                        ${
                          hasPendingWithdrawal(user._id) && hasPendingDeposit(user._id)
                            ? "bg-yellow-200 border-l-4 border-purple-500"
                            : hasPendingWithdrawal(user._id)
                            ? "bg-yellow-50 border-l-4 border-yellow-400"
                            : hasPendingDeposit(user._id)
                            ? "bg-blue-50 border-l-4 border-blue-400"
                            : ""
                        }
                      `}
                    >

                    <td className="py-4 px-4 font-medium text-gray-800">
                      {indexOfFirstUser + index + 1}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">
                      {user.fullName}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "inActive"
                            ? "bg-gray-100 text-gray-700"
                            : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-800 font-semibold">
                      ${user.funds.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        className="text-orange-500 hover:text-orange-800 transition-colors"
                        onClick={() => {
                          setUserId(user._id);
                          setShowReport(true);
                        }}
                      >
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Hidden on Desktop */}
          <div className="md:hidden space-y-3">
            {currentUsers.map((user, index) => (
              <div
                key={user._id}
                className={`bg-white rounded-xl shadow-sm p-4 ${
                  hasPendingWithdrawal(user._id)
                    ? "bg-yellow-50 border-l-4 border-yellow-400"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      #{indexOfFirstUser + index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {user.fullName}
                    </h3>
                    <p className="text-sm text-gray-600 break-all">
                      {user.email}
                    </p>
                  </div>
                  <button
                    className="text-orange-500 hover:text-orange-800 transition-colors ml-2 flex-shrink-0"
                    onClick={() => {
                      setUserId(user._id);
                      setShowReport(true);
                    }}
                  >
                    <FileText size={20} />
                  </button>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : user.status === "inActive"
                          ? "bg-gray-100 text-gray-700"
                          : user.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Balance</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${user.funds.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-700 font-medium text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}