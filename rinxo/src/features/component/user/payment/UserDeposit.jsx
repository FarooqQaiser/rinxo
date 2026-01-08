import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Wallet,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";
import Button from "../../../../components/common/Button/Button";

import {
  fetchCurrencies,
  getEstimate,
  createPayment,
  normalizeCurrency,
  getPaymentStatus,
} from "../../../../utils/payment.utils";

export default function UserDeposit({ setActiveSubMenu, user }) {
  const [amount, setAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("eth");
  const [currencies, setCurrencies] = useState([]);
  const [estimatedAmount, setEstimatedAmount] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("waiting");
  const POPULAR_CRYPTOS = ["btc", "eth", "usdt", "ltc", "bnb", "trx"];

  /* ================= FETCH CURRENCIES ================= */
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const data = await fetchCurrencies();
        const filtered = data?.currencies?.filter(c =>
          POPULAR_CRYPTOS.includes(c?.toLowerCase())
        );

        if (isMounted) {
          setCurrencies(filtered?.length ? filtered : POPULAR_CRYPTOS);
        }
      } catch {
        if (isMounted) setCurrencies(POPULAR_CRYPTOS);
      } finally {
        setTimeout(() => {
          if (isMounted) setLoadingPage(false);
        }, 200);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ================= PAYMENT STATUS POLLING ================= */
  useEffect(() => {
    if (!payment?.payment_id || !user?._id) return;

    let isActive = true;

    const checkStatus = async () => {
      if (!isActive) return false;

      try {
        const statusData = await getPaymentStatus({ 
          paymentId: payment.payment_id, 
          userId: user._id 
        });
        
        console.log("Payment status update:", statusData);
        
        if (!isActive) return false;

        if (statusData?.payment_status) {
          setPaymentStatus(statusData.payment_status);
          
          // Update payment object with latest data
          setPayment(prev => ({
            ...prev,
            payment_status: statusData.payment_status,
            actually_paid: statusData.actually_paid || prev.actually_paid,
            outcome_amount: statusData.outcome_amount || prev.outcome_amount
          }));
          
          // Stop polling if payment is finished, failed, or expired
          if (["finished", "failed", "expired", "refunded"].includes(statusData.payment_status)) {
            console.log(`Payment ${statusData.payment_status} - stopping status checks`);
            return true; // Signal to stop polling
          }
        }
        return false;
      } catch (err) {
        console.error("Error checking payment status:", err);
        // Don't stop polling on error, might be temporary network issue
        return false;
      }
    };

    // Initial check after 5 seconds
    const initialTimeout = setTimeout(() => {
      checkStatus();
    }, 5000);

    // Poll every 1 minute (60000ms)
    const intervalId = setInterval(async () => {
      const shouldStop = await checkStatus();
      if (shouldStop) {
        clearInterval(intervalId);
      }
    }, 10000);

    // Cleanup function
    return () => {
      isActive = false;
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [payment?.payment_id, user?._id]);
 
  /* ================= PRICE ESTIMATION (DEBOUNCE) ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount && parseFloat(amount) >= 10) {
        handleEstimate();
      } else {
        setEstimatedAmount(null);
        setError("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [amount, selectedCrypto]);

  const handleEstimate = async () => {
    setEstimating(true);
    setError("");

    try {
      const data = await getEstimate({
        amount: parseFloat(amount),
        currencyTo: normalizeCurrency(selectedCrypto),
      });

      if (!data.estimated_amount) throw new Error("Estimate unavailable");

      setEstimatedAmount(data.estimated_amount);
    } catch (err) {
      console.error("Estimate error:", err);
      setEstimatedAmount(null);

      if (err.response?.status === 403) {
        setError(
          "API key validation failed. Please check your NOWPayments API configuration."
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to get price estimate. Please try again.");
      }
    } finally {
      setEstimating(false);
    }
  };

  /* ================= CREATE PAYMENT ================= */
  const handleCreatePayment = async () => {
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    if (parsedAmount < 10) {
      setError("Minimum deposit amount is $10");
      return;
    }

    if (estimating) {
      setError("Please wait for price estimation to complete");
      return;
    }

    if (!estimatedAmount) {
      setError("Please wait for price estimation to complete");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const normalizedCurrency = normalizeCurrency(selectedCrypto);

      const payload = {
        price_amount: parsedAmount,
        price_currency: "usd",
        pay_currency: normalizedCurrency.toLowerCase(),
        order_description: `Wallet deposit of ${parsedAmount}`,
        ipn_callback_url: `${
          import.meta.env.VITE_API_URL || "http://localhost:8000/api"
        }/payment/ipn-callback`,
        success_url: window.location.origin + "/manage-funds?status=success",
        cancel_url: window.location.origin + "/deposit?status=cancelled",
      };

      const data = await createPayment({
        payload,
        userId: user._id,
      });
      
      console.log("Payment created:", data);
      
      setPayment(data);
      setPaymentStatus(data.payment_status || "waiting");

      // Initial status check
      try {
        const statusData = await getPaymentStatus({ 
          paymentId: data.payment_id, 
          userId: user._id 
        });
        console.log("Initial payment status:", statusData);
        if (statusData?.payment_status) {
          setPaymentStatus(statusData.payment_status);
        }
      } catch (err) {
        console.error("Error fetching initial payment status:", err);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create payment";
      setError(errorMsg);
      console.error("Payment creation error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      waiting: {
        bg: "bg-yellow-200",
        text: "text-yellow-700",
        label: "Waiting for Payment",
        animate: true
      },
      confirming: {
        bg: "bg-blue-200",
        text: "text-blue-700",
        label: "Confirming",
        animate: true
      },
      confirmed: {
        bg: "bg-blue-300",
        text: "text-blue-800",
        label: "Confirmed",
        animate: true
      },
      sending: {
        bg: "bg-indigo-200",
        text: "text-indigo-700",
        label: "Sending",
        animate: true
      },
      partially_paid: {
        bg: "bg-orange-200",
        text: "text-orange-700",
        label: "Partially Paid",
        animate: true
      },
      finished: {
        bg: "bg-green-600",
        text: "text-white",
        label: "Completed",
        animate: false
      },
      failed: {
        bg: "bg-red-600",
        text: "text-white",
        label: "Failed",
        animate: false
      },
      refunded: {
        bg: "bg-purple-600",
        text: "text-white",
        label: "Refunded",
        animate: false
      },
      expired: {
        bg: "bg-gray-600",
        text: "text-white",
        label: "Expired",
        animate: false
      }
    };

    const config = statusConfig[status] || statusConfig.waiting;

    return (
      <span 
        className={`px-3 py-1 text-sm rounded font-medium ${config.bg} ${config.text} ${
          config.animate ? 'animate-pulse' : ''
        }`}
      >
        {config.label}
      </span>
    );
  };

  if (loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cryptoIcons = {
    btc: "₿",
    eth: "Ξ",
    usdt: "₮",
    ltc: "Ł",
    bnb: "BNB",
    trx: "TRX",
  };

  /* ================= PAYMENT SCREEN ================= */
  if (payment) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <Button
          btnName="Back"
          onClick={() => {
            setActiveSubMenu("undefined");
            setPayment(null);
            setPaymentStatus("waiting");
            setAmount("");
            setEstimatedAmount(null);
          }}
          extraCss="mb-4 px-4 py-2 rounded-lg flex items-center gap-2"
          bgColour="bg-gray-100"
          textColour="text-gray-700"
          hoverBgColour="hover:bg-gray-200"
        >
          <ArrowLeft size={18} />
        </Button>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet size={32} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Complete Your Deposit
            </h2>
            <p className="text-gray-600">
              Send exactly{" "}
              <span className="font-bold text-yellow-600">
                {payment.pay_amount} {payment.pay_currency.toUpperCase()}
              </span>
            </p>
          </div>

          {/* Payment Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Payment Address</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-3 py-2 rounded border text-sm break-all">
                {payment.pay_address}
              </code>
              <button
                onClick={() => copyToClipboard(payment.pay_address)}
                className="p-2 hover:bg-gray-200 rounded transition"
                title={copied ? "Copied!" : "Copy address"}
              >
                {copied ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount (USD)</span>
              <span className="font-semibold">${payment.price_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pay Amount</span>
              <span className="font-semibold">
                {payment.pay_amount} {payment.pay_currency.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID</span>
              <span className="text-sm text-gray-500">
                {payment.payment_id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              {getStatusBadge(paymentStatus)}
            </div>
            {payment.actually_paid && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Received</span>
                <span className="text-sm font-semibold text-green-600">
                  {payment.actually_paid} {payment.pay_currency.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {paymentStatus === "finished" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">Payment Successful!</p>
                <p>Your deposit has been confirmed and credited to your wallet.</p>
              </div>
            </div>
          )}

          {paymentStatus === "failed" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Payment Failed</p>
                <p>Your payment could not be processed. Please try again or contact support.</p>
              </div>
            </div>
          )}

          {paymentStatus === "expired" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-800">
                <p className="font-semibold mb-1">Payment Expired</p>
                <p>This payment request has expired. Please create a new deposit request.</p>
              </div>
            </div>
          )}

          {paymentStatus === "partially_paid" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-semibold mb-1">Partially Paid</p>
                <p>We received partial payment. Please send the remaining amount to complete the transaction.</p>
              </div>
            </div>
          )}

          {["waiting", "confirming", "confirmed", "sending"].includes(paymentStatus) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Send the exact amount shown above</li>
                  <li>Payment expires in 60 minutes</li>
                  <li>Funds will be credited after network confirmation</li>
                  <li>Status updates automatically every minute</li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Button */}
          {payment.invoice_id && ["waiting", "confirming", "confirmed"].includes(paymentStatus) && (
            <button
              onClick={() =>
                window.open(
                  `https://nowpayments.io/payment/?iid=${payment.invoice_id}`,
                  "_blank"
                )
              }
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              Open Payment Page <ExternalLink size={18} />
            </button>
          )}

          {paymentStatus === "finished" && (
            <button
              onClick={() => {
                setActiveSubMenu("undefined");
                setPayment(null);
                setPaymentStatus("waiting");
                setAmount("");
                setEstimatedAmount(null);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Back to Wallet
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ================= MAIN FORM ================= */
  return (
    <div className="p-4 sm:p-6 max-w-1xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <Button
          btnName="Back"
          onClick={() => setActiveSubMenu("undefined")}
          extraCss="mb-4 px-4 py-2 rounded-lg flex items-center gap-2"
          bgColour="bg-gray-100"
          textColour="text-gray-700"
          hoverBgColour="hover:bg-gray-200"
        >
          <ArrowLeft size={18} />
        </Button>

        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet size={32} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Deposit Funds using Crypto
          </h2>
          <p className="text-gray-600">
            Add money to your wallet using cryptocurrency
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
              min="10"
              step="0.01"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum deposit: $10</p>
          <p className="text-xs text-gray-500 mt-1">Minimum deposit BTC: $24</p>
        </div>

        {/* Cryptocurrency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Cryptocurrency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currencies.map((crypto) => (
              <button
                key={crypto}
                onClick={() => setSelectedCrypto(crypto)}
                className={`p-4 rounded-lg border-2 transition disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  selectedCrypto === crypto
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                disabled={crypto === "btc" && amount < 24}
              >
                <div className="text-2xl mb-1">
                  {cryptoIcons[crypto] || "💰"}
                </div>
                <p className="font-semibold text-gray-800 uppercase">
                  {crypto}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Amount */}
        {amount && parseFloat(amount) >= 10 && (
          <div className="bg-gray-50 rounded-lg p-4">
            {estimating ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 size={20} className="animate-spin" />
                <p className="text-sm">Calculating crypto amount...</p>
              </div>
            ) : estimatedAmount ? (
              <>
                <p className="text-sm text-gray-600 mb-1">
                  You will pay approximately:
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {estimatedAmount} {selectedCrypto.toUpperCase()}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Waiting for price estimate...
              </p>
            )}
          </div>
        )}

        {/* Quick Amount Buttons */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Select</p>
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 250, 500].map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value.toString())}
                className="py-2 px-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium text-gray-700"
              >
                ${value}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreatePayment}
          disabled={
            loading ||
            estimating ||
            !amount ||
            parseFloat(amount) < 10 ||
            !estimatedAmount ||
            (selectedCrypto === "btc" && amount < 24)
          }
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creating Payment...
            </>
          ) : estimating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Calculating...
            </>
          ) : !estimatedAmount && amount && parseFloat(amount) >= 10 ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Getting Price...
            </>
          ) : (
            <>
              <Wallet size={20} />
              Continue to Payment
            </>
          )}
        </button>

        {/* Helper text for disabled button */}
        {!estimatedAmount && amount && parseFloat(amount) >= 10 && (
          <p className="text-xs text-center text-gray-500 -mt-3">
            Please wait for price calculation to complete
          </p>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">How it works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter the amount you want to deposit</li>
                <li>Select your preferred cryptocurrency</li>
                <li>Send crypto to the provided address</li>
                <li>Funds will be credited after confirmation</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}