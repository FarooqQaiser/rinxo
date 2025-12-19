import React, { useState } from "react";
import { Edit, Save, X } from "lucide-react";

export default function UserSettings() {
  const [isEditing, setIsEditing] = useState(false);

  // Static user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+1 234 567 890",
    balance: 2500,
    status: "Active",
    accountType: "Standard",
  });

  const [formData, setFormData] = useState(userData);

  const handleEdit = () => {
    setFormData(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setUserData(formData); // static update
    setIsEditing(false);
  };

  return (
    <div className="p-6 mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Profile Settings
          </h2>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              <Edit size={16} /> Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            ) : (
              <p className="font-semibold text-gray-800">
                {userData.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            ) : (
              <p className="font-semibold text-gray-800 break-all">
                {userData.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            ) : (
              <p className="font-semibold text-gray-800">
                {userData.phone}
              </p>
            )}
          </div>

          {/* Account Info (Read Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Account Type
              </label>
              <p className="font-semibold text-gray-800">
                {userData.accountType}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Status
              </label>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                {userData.status}
              </span>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Balance
              </label>
              <p className="font-bold text-gray-900">
                ${userData.balance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="pt-6">
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition text-sm"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
