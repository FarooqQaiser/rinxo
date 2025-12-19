import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoginLogo from "../../src/assets/images/user/icons/prelogin_logo.png";
import "../../src/assets/styles/Login.css";
import TopSlideLoading from "../components/common/Loading/TopSlideLoading";

export default function Login() {
  const [formData, setFormData] = useState({
    uEmail: "",
    uPhone: "",
    uPassword: "",
  });

  const [loginType, setLoginType] = useState("email");
  const [countryCode, setCountryCode] = useState("+1");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({}); // Validation errors

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const getValue = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hide loading when page fully loads
    useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 800); // small delay for UX

    return () => clearTimeout(timer);
    }, []);


  // Validation function
    const validate = () => {
        let tempErrors = {};
        if (loginType === "email") {
        if (!formData.uEmail) tempErrors.uEmail = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.uEmail))
            tempErrors.uEmail = "Invalid email format";
        } else {
        if (!formData.uPhone) tempErrors.uPhone = "Phone number is required";
        else if (!/^\d{7,15}$/.test(formData.uPhone))
            tempErrors.uPhone = "Invalid phone number";
        }

        if (!formData.uPassword) tempErrors.uPassword = "Password is required";
        else if (formData.uPassword.length < 6)
        tempErrors.uPassword = "Password must be at least 6 characters";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);

            if (loginType === "email") {
            console.log("Email:", formData.uEmail);
            } else {
            console.log("Phone:", countryCode + formData.uPhone);
            }
        }, 2000);
    };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      <TopSlideLoading show={loading} />

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="mx-auto text-center mb-1">
          <img
            src={LoginLogo}
            className="w-auto lg:max-w-[170px] mx-auto"
            alt="Logo"
          />
        </div>

        {/* Login Type Dropdown */}
        <div className="mb-2 loginDropdown">
          <select
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
            className="text-sm focus:outline-none"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {loginType === "email" ? (
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Email</label>
              <input
                type="email"
                name="uEmail"
                placeholder="Email *"
                value={formData.uEmail}
                onChange={getValue}
                className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.uEmail
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                }`}
              />
              {errors.uEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.uEmail}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className={`border rounded-md p-2 text-sm focus:outline-none focus:ring-2 ${
                    errors.uPhone
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-yellow-400"
                  }`}
                >
                  {[
                    { code: "+1", name: "USA" },
                    { code: "+44", name: "UK" },
                    { code: "+92", name: "Pakistan" },
                  ].map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} {c.name}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  name="uPhone"
                  placeholder="Phone Number"
                  value={formData.uPhone}
                  onChange={getValue}
                  className={`flex-1 border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.uPhone
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-yellow-400"
                  }`}
                />
              </div>
              {errors.uPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.uPhone}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="uPassword"
                placeholder="Password *"
                value={formData.uPassword}
                onChange={getValue}
                className={`w-full border rounded-md p-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                  errors.uPassword
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                }`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-4 text-gray-400"
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.uPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.uPassword}</p>
            )}
          </div>

          <div className="text-right">
            <a href="#" className="text-yellow-400 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-full transition 
                    ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500 text-white"
                    }
                `}
                >
                {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-500 text-sm">Do not have an account?</p>
          <a
            href="/register"
            className="block text-yellow-400 font-semibold hover:underline text-sm"
          >
            Individual Account Registration
          </a>
          <a
            href="#"
            className="block text-yellow-400 font-semibold hover:underline text-sm"
          >
            Register as an IB
          </a>
        </div>
      </div>
    </div>
  );
}
