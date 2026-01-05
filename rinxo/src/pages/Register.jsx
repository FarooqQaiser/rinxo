// import React, { useState, useEffect } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import LoginLogo from "../../src/assets/images/user/icons/prelogin_logo.png";
// import TopSlideLoading from "../components/common/Loading/TopSlideLoading";
// import { registerUser, resendEmailVerificationAPI } from "../utils/auth.utils";
// import { toast } from "react-toastify";

// export default function Register() {
//   /* ================= STATES ================= */
//   const [pageLoading, setPageLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const [countryCode, setCountryCode] = useState("+1");
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [token, setToken] = useState("");

//   /* ================= PAGE LOADER ================= */
//   useEffect(() => {
//     const timer = setTimeout(() => setPageLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, []);

//   /* ================= HANDLERS ================= */
//   const togglePassword = () => setPasswordVisible(!passwordVisible);

//   const getValue = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const normalizePhoneNumber = (countryCode, phone) => {
//     let cleaned = phone.replace(/\D/g, ""); // remove non-numeric

//     // Remove leading 0 (Pakistan, UK, etc.)
//     if (cleaned.startsWith("0")) {
//       cleaned = cleaned.slice(1);
//     }

//     return `${countryCode}${cleaned}`;
//   };

//   /* ================= VALIDATION ================= */
//   const validate = () => {
//     let temp = {};

//     if (!formData.fullName.trim()) temp.fullName = "Full name is required";

//     if (!formData.email) temp.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       temp.email = "Invalid email address";

//     if (!formData.phone) {
//       temp.phone = "Phone number is required";
//     } else {
//       const cleaned = formData.phone.replace(/\D/g, "");

//       if (cleaned.length < 7 || cleaned.length > 12) {
//         temp.phone = "Invalid phone number";
//       }
//     }

//     if (!formData.password) temp.password = "Password is required";
//     else if (formData.password.length < 6)
//       temp.password = "Minimum 6 characters";

//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   /* ================= REGISTER ================= */
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     setActionLoading(true);

//     try {
//       const phoneNumber = normalizePhoneNumber(countryCode, formData.phone);

//       const result = await registerUser({
//         fullName: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         phoneNumber, // ✅ CLEAN & CORRECT
//       });
//       setToken(result.token);
//       toast.success("Registered successfully! Please verify your email.");
//     } catch (err) {
//       toast.error(err.message || "Registration failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const resendEmailVerification = async () => {
//     try {
//       const response = await resendEmailVerificationAPI(token);
//       // if (!response.ok) {
//       //   throw new Error(`HTTP Error! Status: ${response.status}`);
//       // }
//       const result = response;
//       console.log("result: ", result);
//     } catch (err) {
//       console.error("Error resending verification email", err.message);
//       toast.error("Failed to resend email verification!");
//     }
//   };

 

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
//       <TopSlideLoading show={pageLoading} />

//       <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-5xl relative z-10 overflow-hidden">
//         <img src={LoginLogo} alt="logo" className="w-48 mx-auto mb-6" />

//         <h2 className="text-center text-2xl font-bold mb-8">
//           Individual Account Registration
//         </h2>

//         <div className="grid md:grid-cols-2 gap-4">
//           {/* Full Name */}
//           <div>
//             <label className="text-sm font-medium">Full Name</label>
//             <input
//               name="fullName"
//               value={formData.fullName}
//               onChange={getValue}
//               className={`w-full border rounded-md p-3 mt-1 text-sm focus:outline-none focus:ring-2 ${
//                 errors.fullName
//                   ? "border-red-500 focus:ring-red-400"
//                   : "border-gray-300 focus:ring-yellow-400"
//               }`}
//             />
//             {errors.fullName && (
//               <p className="text-xs text-red-500">{errors.fullName}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <label className="text-sm font-medium">Email</label>
//             <input
//               name="email"
//               value={formData.email}
//               onChange={getValue}
//               className={`w-full border rounded-md p-3 mt-1 text-sm focus:outline-none focus:ring-2 ${
//                 errors.email
//                   ? "border-red-500 focus:ring-red-400"
//                   : "border-gray-300 focus:ring-yellow-400"
//               }`}
//             />
//             {errors.email && (
//               <p className="text-xs text-red-500">{errors.email}</p>
//             )}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="text-sm font-medium">Phone</label>
//             <div className="flex gap-2 mt-1">
//               <select
//                 value={countryCode}
//                 onChange={(e) => setCountryCode(e.target.value)}
//                 className="border rounded-md p-3 text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-yellow-400"
//               >
//                 <option value="+1">+1</option>
//                 <option value="+44">+44</option>
//                 <option value="+92">+92</option>
//               </select>

//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/\D/g, "");
//                   setFormData({ ...formData, phone: value });
//                 }}
//                 placeholder="3012345678"
//                 className={`flex-1 border rounded-md p-3 text-sm focus:outline-none focus:ring-2 ${
//                   errors.phone
//                     ? "border-red-500 focus:ring-red-400"
//                     : "border-gray-300 focus:ring-yellow-400"
//                 }`}
//               />
//             </div>
//             {errors.phone && (
//               <p className="text-xs text-red-500">{errors.phone}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm font-medium">Password</label>
//             <div className="relative mt-1">
//               <input
//                 type={passwordVisible ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={getValue}
//                 className={`w-full border rounded-md p-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
//                   errors.password
//                     ? "border-red-500 focus:ring-red-400"
//                     : "border-gray-300 focus:ring-yellow-400"
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={togglePassword}
//                 className="absolute right-4 top-3 text-gray-400"
//               >
//                 {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-xs text-red-500">{errors.password}</p>
//             )}
//           </div>

//           {/* Button */}
//           <div className="col-span-full flex justify-center mt-6">
//             <button
//               onClick={handleSubmit}
//               disabled={actionLoading}
//               className="px-24 py-3 rounded-full bg-yellow-400 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
//             >
//               {actionLoading && (
//                 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               )}
//               {actionLoading ? "Creating..." : "Register"}
//             </button>
//           </div>
//           <div className="col-span-full flex justify-center mt-6">
//             <button
//               onClick={resendEmailVerification}
//               // disabled={actionLoading}
//               className="px-24 py-3 rounded-full bg-yellow-400 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
//             >
//               {/* {actionLoading && (
//                 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               )} */}
//               {/* {actionLoading ? "Sending..." : "Resend Verification"} */}
//               Resend Verification
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoginLogo from "../../src/assets/images/user/icons/prelogin_logo.png";
import TopSlideLoading from "../components/common/Loading/TopSlideLoading";
import { registerUser, resendEmailVerificationAPI } from "../utils/auth.utils";
import { toast } from "react-toastify";
export default function Register() {
 
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);

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
        phoneNumber, // ✅ CLEAN & CORRECT
      }); 
      message = result.message
      setToken(result.token);
      setShowResendButton(true);
      toast.success(message);
     
    } catch(err){ 
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
    try {
      const response = await resendEmailVerificationAPI(token); 
      if(response.data.success)
      {
        toast.success(response.data.message);
      }
      const result = response;
      console.log("result: ", result);
    } catch { 
      toast.error("Failed to resend email verification!");
    }
   
  };
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 px-4 py-8">
      <TopSlideLoading show={pageLoading} />
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-4xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-16    flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              <img src={LoginLogo}/>
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

        {/* Resend Verification */}
        {showResendButton && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the verification email?
            </p>
            <button
              onClick={resendEmailVerification}
              className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm underline transition-colors"
            >
              Resend Verification Email
            </button>
          </div>
        )}

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}