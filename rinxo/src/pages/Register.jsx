import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import LoginLogo from "../../src/assets/images/user/icons/prelogin_logo.png";
import TopSlideLoading from "../components/common/Loading/TopSlideLoading";
import { registerUser, resendEmailVerificationAPI } from "../utils/auth.utils";
import { toast } from "react-toastify";

export default function Register() {
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [countryCode, setCountryCode] = useState("+92");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const getValue = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const normalizePhoneNumber = (countryCode, phone) => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }
    return `${countryCode}${cleaned}`;
  };

  const validate = () => {
    let temp = {};

    if (!formData.fullName.trim()) temp.fullName = "Full name is required";

    if (!formData.email) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      temp.email = "Invalid email address";

    if (!formData.phone) {
      temp.phone = "Phone number is required";
    } else {
      const cleaned = formData.phone.replace(/\D/g, "");
      if (cleaned.length < 7 || cleaned.length > 12) {
        temp.phone = "Invalid phone number";
      }
    }

    if (!formData.password) temp.password = "Password is required";
    else if (formData.password.length < 6)
      temp.password = "Minimum 6 characters";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setActionLoading(true);
    let message = "";
    try {
      const phoneNumber = normalizePhoneNumber(countryCode, formData.phone);

      const result = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber,
      });
      
      message = result.message;
      setToken(result.token);
      setShowVerificationScreen(true);
      toast.success(message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const resendEmailVerification = async () => {
    if (!token) {
      toast.error("Please register first before resending verification");
      return;
    }
    
    setResendLoading(true);
    try {
      const response = await resendEmailVerificationAPI(token);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error("Failed to resend email verification!" + (err.message ? ` - ${err.message}` : ""));
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setShowVerificationScreen(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
    });
    setToken("");
    setErrors({});
  };

  // Verification Screen
  if (showVerificationScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 px-4 py-8">
        <TopSlideLoading show={pageLoading} />
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-3">
            Verify Your Email
          </h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            We've sent a verification link to
          </p>

          {/* Email Display */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 mb-8">
            <p className="text-center text-gray-800 font-semibold text-lg break-all">
              {formData.email}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-blue-500">📧</span>
              Next Steps:
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-500 mt-0.5">1.</span>
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-500 mt-0.5">2.</span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-500 mt-0.5">3.</span>
                <span>You'll be redirected to login automatically</span>
              </li>
            </ol>
          </div>

          {/* Resend Section */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Didn't receive the email?
            </p>
            <button
              onClick={resendEmailVerification}
              disabled={resendLoading}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mx-auto"
            >
              {resendLoading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={handleBackToRegister}
            className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Registration
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already verified?{" "}
              <a
                href="/login"
                className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 px-4 py-8">
      <TopSlideLoading show={pageLoading} />
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-4xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-16 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              <img src={LoginLogo} alt="Logo" />
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Individual Account Registration
        </p>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              name="fullName"
              autoComplete="new-fullName"
              value={formData.fullName}
              onChange={getValue}
              placeholder="Enter your full name"
              className={`w-full border rounded-lg p-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-400 focus:ring-red-300 bg-red-50"
                  : "border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              name="email"
              type="email"
              autoComplete="new-email"
              value={formData.email}
              onChange={getValue}
              placeholder="example@email.com"
              className={`w-full border rounded-lg p-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-300 bg-red-50"
                  : "border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 border border-gray-300 rounded-lg p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white"
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+92">🇵🇰 +92</option>
              </select>

              <input
                name="phone"
                autoComplete="new-phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, phone: value });
                }}
                placeholder="3012345678"
                className={`flex-1 border rounded-lg p-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={getValue}
                placeholder="Minimum 6 characters"
                className={`w-full border rounded-lg p-3.5 pr-12 text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-yellow-400 focus:border-yellow-400"
                }`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>
        </div>

        {/* Register Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={actionLoading}
            className="w-full md:w-auto px-16 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {actionLoading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {actionLoading ? "Creating Account..." : "Register"}
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}