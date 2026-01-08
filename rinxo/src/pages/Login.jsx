import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import TopSlideLoading from "../components/common/Loading/TopSlideLoading";
import LoginLogo from "../../src/assets/images/user/icons/prelogin_logo.png";
import { loginUser } from "../utils/auth.utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("email"); // email or phone
  const [countryCode, setCountryCode] = useState("+1");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [webLoading, setWebLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const togglePassword = () => setPasswordVisible(!passwordVisible);

    useEffect(() => {
      const timer = setTimeout(() => setWebLoading(false), 800);
      return () => clearTimeout(timer);
    }, []);

  const getValue = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const normalizePhoneNumber = (countryCode, phone) => {
    let cleaned = phone.replace(/\D/g, ""); // remove non-numeric

    // Remove leading 0 (Pakistan, UK, etc.)
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }

    return `${countryCode}${cleaned}`;
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    let tempErrors = {};

    if (loginType === "email") {
      if (!formData.email) tempErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        tempErrors.email = "Invalid email format";
    } else {
      if (!formData.phone) {
        tempErrors.phone = "Phone number is required";
      } else {
        const cleaned = formData.phone.replace(/\D/g, "");

        if (cleaned.length < 7 || cleaned.length > 12) {
          tempErrors.phone = "Invalid phone number";
        }
      }
    }

    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const phoneNumber = normalizePhoneNumber(countryCode, formData.phone);
      const payload =
        loginType === "email"
          ? { email: formData.email, password: formData.password }
          : { phoneNumber: `${phoneNumber}`, password: formData.password };

      const res = await loginUser(payload); // API call

      if (res.success) {
        toast.success(res.message);
        navigate("/dashboard"); // redirect user
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 px-4 relative">
      <TopSlideLoading show={webLoading} />

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative z-10">
        <div className="mx-auto text-center mb-4">
          <img src={LoginLogo} alt="Logo" className="w-auto lg:max-w-[170px]" />
        </div>

        {/* Login Type */}
        <div className="mb-4">
          <select
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
            className="w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {loginType === "email" ? (
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="new-email"
                value={formData.email}
                onChange={getValue}
                placeholder="Email *"
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
          ) : (
            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                Phone Number
              </label>
              <div className="flex gap-2">
                 
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="border rounded-md p-3 text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-yellow-400"
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+92">+92</option>
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
          )}

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                autoComplete="new-password"

                value={formData.password}
                onChange={getValue}
                placeholder="Password *"
                className={`w-full border rounded-md p-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-yellow-400"
                }`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-3 text-gray-400"
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* <div className="text-right">
            <a href="#" className="text-yellow-400 text-sm hover:underline">
              Forgot Password?
            </a>
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold transition mt-3 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 text-white"
            }`}
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
        </div>
      </div>
    </div>
  );
}
