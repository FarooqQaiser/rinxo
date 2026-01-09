import { useState, useRef } from "react";
import Button from "../../../../components/common/Button/Button";
import { AlertCircle, ArrowLeft, Wallet } from "lucide-react";
import { toast } from "react-toastify";

export default function UserDepositThroughBank({ setActiveSubMenu }) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !bankName || !accountNumber || !proofImage) {
      toast.error("Please fill all fields and upload the payment proof.");
      return;
    }

    const formData = new FormData();
    formData.append("amount", Number(amount));
    formData.append("bankName", bankName);
    formData.append("accountNumber", accountNumber);
    formData.append("proofImage", proofImage);
    // console.log(formData);

    try {
      const response = await fetch("http://localhost:8000/api/user/deposit", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Upload failed!");

      // console.log("result: ", result);
      setAmount(0);
      setBankName("");
      setAccountNumber("");
      setProofImage(null);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Funds Successfully Deposited!");
    } catch (err) {
      // console.error("Failed to upload payment prove: ", err);
      toast.error(err.message);
    }
  };

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
            Deposit Funds using Bank
          </h2>
          <p className="text-gray-600">
            Add money to your wallet by depositing money from your bank.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum deposit: $10</p>
          </div>

          {/* Bank Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Askari Commercial Bank"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
                required
              />
            </div>
          </div>

          {/* Account Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 12345678901234"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
                required
              />
            </div>
          </div>

          {/* Payment Proof */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Payment Proof
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg cursor-pointer"
              required
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded border"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            Submit
          </button>
        </form>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-blue-600 shrink-0 mt-1" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">How it works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Enter the amount you deposited.</li>
                <li>Provide the name of the bank you used for the deposit.</li>
                <li>
                  Enter your account number from which the funds were
                  transferred.
                </li>
                <li>Bank Name: "ADMIN_BANK"</li>
                <li>Account Name: "ADMIN_ACCOUNT_NAME"</li>
                <li>Account Number: "ADMIN_ACCOUNT_NUMBER"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
