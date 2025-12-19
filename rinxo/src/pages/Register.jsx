import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoginLogo from "../../src/assets/images/user/icons/prelogin_logo.png";
import "../../src/assets/styles/Login.css";
import TopSlideLoading from "../components/common/Loading/TopSlideLoading";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [countryCode, setCountryCode] = useState("+1");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const getValue = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    let tempErrors = {};

    if (!formData.fullName.trim())
      tempErrors.fullName = "Full name is required";

    if (!formData.email)
      tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Invalid email format";

    if (!formData.phone)
      tempErrors.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(formData.phone))
      tempErrors.phone = "Invalid phone number";

    if (!formData.password)
      tempErrors.password = "Password is required";
    else if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      console.log({
        fullName: formData.fullName,
        email: formData.email,
        phone: countryCode + formData.phone,
        password: formData.password,
      });
    }, 2000);
  };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
        <TopSlideLoading show={loading} />

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-5xl relative z-10">
        {/* Logo */}
        <div className="mx-auto text-center mb-4">
            <img
            src={LoginLogo}
            className="w-auto max-w-[150px] mx-auto"
            alt="Logo"
            />
        </div>

        <h2 className="text-center text-xl font-semibold mb-6">
            Individual Account Registration
        </h2>

        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            {/* Full Name */}
            <div>
            <label className="block text-gray-700 mb-1 text-sm">
                Full Name
            </label>
            <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={getValue}
                className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                errors.fullName
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                }`}
            />
            {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                {errors.fullName}
                </p>
            )}
            </div>

            {/* Email */}
            <div>
            <label className="block text-gray-700 mb-1 text-sm">Email</label>
            <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={getValue}
                className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                }`}
            />
            {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
            </div>

            {/* Phone */}
            <div>
            <label className="block text-gray-700 mb-1 text-sm">
                Phone Number
            </label>
            <div className="flex gap-2">
                <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-yellow-400"
                >
                <option value="+1">+1 USA</option>
                <option value="+44">+44 UK</option>
                <option value="+92">+92 Pakistan</option>
                </select>

                <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={getValue}
                className={`flex-1 border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
                    errors.phone
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                }`}
                />
            </div>
            {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
            </div>

            {/* Password */}
            <div>
            <label className="block text-gray-700 mb-1 text-sm">
                Password
            </label>
            <div className="relative">
                <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={getValue}
                className={`w-full border rounded-md p-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                    errors.password
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
            {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                {errors.password}
                </p>
            )}
            </div>

            {/* Submit Button – Full Width */} 
            <div className="col-span-full flex justify-center mt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`md:px-25 px-20 py-3 rounded-full font-semibold transition ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500 text-white"
                    }`}
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>
            </div>

        </form>

        <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
            Already have an account?
            </p>
            <a
            href="/login"
            className="text-yellow-400 font-semibold hover:underline text-sm"
            >
            Sign In
            </a>
        </div>
        </div>
    </div>
    );

}
