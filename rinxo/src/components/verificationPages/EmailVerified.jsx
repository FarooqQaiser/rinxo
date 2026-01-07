import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import LoginLogo from "../../assets/images/user/icons/prelogin_logo.png";
import { verifyEmail } from "../../utils/auth.utils";
import TopSlideLoading from "../common/Loading/TopSlideLoading";

export default function EmailVerified() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        setStatus("success");
        setMessage(res.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      <TopSlideLoading show={loading} />

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center relative z-10">
        <img src={LoginLogo} alt="logo" className="w-40 mx-auto mb-6" />

        {status === "loading" && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-500">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-full bg-yellow-400 text-white font-semibold hover:bg-yellow-500 transition"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <button
              onClick={() => navigate("/register")}
              className="w-full py-3 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
            >
              Back to Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
