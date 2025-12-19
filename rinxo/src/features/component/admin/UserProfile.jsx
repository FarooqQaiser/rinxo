import { Edit, Eye, Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";

export default function UserProfile({ users, setUsers }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    balance: "",
    status: "Active",
    accountType: "Standard",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

 

  const userList = users ;

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        balance: "",
        status: "Active",
        accountType: "Standard",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      balance: "",
      status: "Active",
      accountType: "Standard",
    });
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.balance
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (modalType === "add") {
      const newUser = {
        id: userList.length + 1,
        ...formData,
        balance: parseFloat(formData.balance),
      };
      if (setUsers) {
        setUsers([...userList, newUser]);
      }
    } else if (modalType === "edit") {
      const updatedUsers = userList.map((u) =>
        u.id === selectedUser.id
          ? { ...u, ...formData, balance: parseFloat(formData.balance) }
          : u
      );
      if (setUsers) {
        setUsers(updatedUsers);
      }
    }
    closeModal();
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      if (setUsers) {
        setUsers(userList.filter((u) => u.id !== userId));
      }
    }
  };

  // Filtered & paginated users
  const filteredUsers = userList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
        {/* Top Controls */}
        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            User Management
          </h2>

          {/* Search Bar - Full Width on Mobile */}
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={usersPerPage}
              onChange={handleUsersPerPageChange}
              className="flex-1 sm:flex-none sm:w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={userList.length}>All</option>
            </select>

            <button
              onClick={() => openModal("add")}
              className="flex-1 sm:flex-none bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Plus size={18} /> Add User
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {currentUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 break-all">{user.email}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="font-medium text-gray-900 break-all">{user.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Balance:</span>
                  <p className="font-bold text-gray-900">
                    ${user.balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium text-gray-900">{user.accountType}</p>
                </div>
                <div>
                  <span className="text-gray-500">ID:</span>
                  <p className="font-medium text-gray-900">{user.id}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => openModal("view", user)}
                  className="flex-1 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => openModal("edit", user)}
                  className="flex-1 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex-1 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                  Balance
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-800 text-sm">
                    {user.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800 text-sm">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {user.phone}
                  </td>
                  <td className="py-3 px-4 text-gray-800 font-semibold text-sm">
                    ${user.balance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {user.accountType}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal("view", user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal("edit", user)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {modalType === "add" && "Add New User"}
                {modalType === "edit" && "Edit User"}
                {modalType === "view" && "User Details"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              {modalType === "view" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Name
                    </label>
                    <p className="text-base font-semibold text-gray-800 break-words">
                      {selectedUser?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Email
                    </label>
                    <p className="text-base font-semibold text-gray-800 break-all">
                      {selectedUser?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Phone
                    </label>
                    <p className="text-base font-semibold text-gray-800 break-all">
                      {selectedUser?.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Balance
                    </label>
                    <p className="text-base font-semibold text-gray-800">
                      ${selectedUser?.balance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Status
                    </label>
                    <p className="text-base font-semibold text-gray-800">
                      {selectedUser?.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Account Type
                    </label>
                    <p className="text-base font-semibold text-gray-800">
                      {selectedUser?.accountType}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 234 567 890"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Balance
                    </label>
                    <input
                      type="number"
                      value={formData.balance}
                      onChange={(e) =>
                        setFormData({ ...formData, balance: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      value={formData.accountType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountType: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    >
                      <option>Standard</option>
                      <option>Premium</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition text-sm"
                    >
                      {modalType === "add" ? "Add User" : "Update User"}
                    </button>
                    <button
                      onClick={closeModal}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}