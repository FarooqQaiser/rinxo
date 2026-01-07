import React, { useEffect, useState } from "react";
import { Edit, Save, X, Lock, Eye, EyeOff } from "lucide-react";
import { adminUpdatePassword, adminUpdateProfile, specificData } from "../../../utils/user.utils";
import { toast } from "react-toastify";

export default function Settings({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [countryCode, setCountryCode] = useState("+92");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await specificData(user._id); 
        setUserData(data.data);
        setFormData({
          fullName: data.data.fullName || "",
          phoneNumber: data.data.phoneNumber || "",
        });
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?._id) {
      fetchUser();
    }
  }, [user._id]);
 
  useEffect(() => {
  if (userData?.phoneNumber) {
    // Extract country code and number
    if (userData.phoneNumber.startsWith("+92")) {
      setCountryCode("+92");
      const numberWithoutCode = userData.phoneNumber.replace("+92", "").trim();
      setFormData(prev => ({
        ...prev,
        phoneNumber: numberWithoutCode,
      }));
    } else if (userData.phoneNumber.startsWith("+1")) {
      setCountryCode("+1");
      const numberWithoutCode = userData.phoneNumber.replace("+1", "").trim();
      setFormData(prev => ({
        ...prev,
        phoneNumber: numberWithoutCode,
      }));
    } else if (userData.phoneNumber.startsWith("+44")) {
      setCountryCode("+44");
      const numberWithoutCode = userData.phoneNumber.replace("+44", "").trim();
      setFormData(prev => ({
        ...prev,
        phoneNumber: numberWithoutCode,
      }));
    } else {
      // Default case if no country code detected
      setFormData(prev => ({
        ...prev,
        phoneNumber: userData.phoneNumber,
      }));
    }
  }
}, [userData]);


  const normalizePhoneNumber = (countryCode, phone) => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }

    return `${countryCode}${cleaned}`;
  };


 const handleEdit = () => {
  let phoneOnly = userData.phoneNumber || "";
  let detectedCode = "+92";

  if (userData.phoneNumber) {
    if (userData.phoneNumber.startsWith("+92")) {
      detectedCode = "+92";
      phoneOnly = userData.phoneNumber.replace("+92", "").trim();
    } else if (userData.phoneNumber.startsWith("+1")) {
      detectedCode = "+1";
      phoneOnly = userData.phoneNumber.replace("+1", "").trim();
    } else if (userData.phoneNumber.startsWith("+44")) {
      detectedCode = "+44";
      phoneOnly = userData.phoneNumber.replace("+44", "").trim();
    }
  }
  setCountryCode(detectedCode);
  setFormData({
    fullName: userData.fullName || "",
    phoneNumber: phoneOnly,
  });
  setIsEditing(true);
  setError(null);
};

const handleCancel = () => {
  let phoneOnly = userData.phoneNumber || "";
  let detectedCode = "+92";

  if (userData.phoneNumber) {
    if (userData.phoneNumber.startsWith("+92")) {
      detectedCode = "+92";
      phoneOnly = userData.phoneNumber.replace("+92", "").trim();
    } else if (userData.phoneNumber.startsWith("+1")) {
      detectedCode = "+1";
      phoneOnly = userData.phoneNumber.replace("+1", "").trim();
    } else if (userData.phoneNumber.startsWith("+44")) {
      detectedCode = "+44";
      phoneOnly = userData.phoneNumber.replace("+44", "").trim();
    }
  }

  setCountryCode(detectedCode);
  setFormData({
    fullName: userData.fullName || "",
    phoneNumber: phoneOnly,
  });
  setIsEditing(false);
  setError(null);
};


  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
    setPasswordError(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const updatePayload = {};
      
      if (formData.fullName && formData.fullName !== userData.fullName) {
        updatePayload.fullName = formData.fullName;
      }
     if (formData.phoneNumber) {
        const normalizedPhone = normalizePhoneNumber(
          countryCode,
          formData.phoneNumber
        );

        if (normalizedPhone !== userData.phoneNumber) {
          updatePayload.phoneNumber = normalizedPhone;
        }
      }


      if (Object.keys(updatePayload).length === 0) {
        setError("No changes to save");
        setSaving(false); 
        return;
      } 
      const response = await adminUpdateProfile(user._id, updatePayload)
      
      if (response.success === true) {
        toast.success(response.message)
        setUserData({
          ...userData,
          ...updatePayload,
        });
        
        setIsEditing(false); 
      }else{
         toast.error(response.message)
         setIsEditing(false); 
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
     
      setIsEditing(false); 
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setPasswordError(null);

      // Validation
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError("All password fields are required");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("New password and confirm password do not match");
        return;
      }

      setSaving(true); 
      const response = await adminUpdatePassword(user._id, 
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
      )
      if (response.success === true) {
        toast.success(response.message)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false); 
      }else
      {
        toast.error(response.message)
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
      toast.error("Failed to update password")
      console.error("Password update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="p-6 mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6 mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <p className="text-center text-red-600">Failed to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto max-w-1xl">
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Profile Settings</h2>

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
              disabled={saving}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            ) : (
              <p className="font-semibold text-gray-800">{userData.fullName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
  <label className="text-sm text-gray-600 block mb-1">
    Phone Number
  </label>

  {isEditing ? (
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
      >
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
        <option value="+92">🇵🇰 +92</option>
      </select>

      <input
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) =>
          setFormData({
            ...formData,
            phoneNumber: e.target.value.replace(/\D/g, ""),
          })
        }
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        placeholder="3012345678"
      />
    </div>
  ) : (
    <p className="font-semibold text-gray-800">
      {userData.phoneNumber}
    </p>
  )}
</div>

          {/* <div>
            <label className="text-sm text-gray-600 block mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            ) : (
              <p className="font-semibold text-gray-800">
                {userData.phoneNumber}
              </p>
            )}
          </div> */}

          {/* Save Button for Profile */}
          {isEditing && (
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          )}

          {/* Password Section */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-600 block">Password</label>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  <Lock size={14} /> Change Password
                </button>
              )}
            </div>
            
            {!isChangingPassword ? (
              <p className="font-semibold text-gray-800">••••••••</p>
            ) : (
              <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{passwordError}</p>
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Password Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handlePasswordChange}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>Updating...</>
                    ) : (
                      <>
                        <Lock size={16} /> Update Password
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelPassword}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Info (Read Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Email</label>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                {userData.email}
              </span>
            </div>

            {/* <div>
              <label className="text-sm text-gray-600 block mb-1">
                Balance
              </label>
              <p className="font-bold text-gray-900">${userData.funds}</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}