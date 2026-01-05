import { useState } from "react";
import { CiSaveUp2 } from "react-icons/ci";
import Button from "../../../../components/common/Button/Button";

export default function WithdrawalTable({
  withdrawals,
  isLoading,
  setIsLoading,
}) {
  const [dirtyRows, setDirtyRows] = useState(new Set());
  const [status, setStatus] = useState("");

  const formatAmount = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return Number(value).toFixed(2);
  };

  const updateWithdrawaStatus = async (status, withdrawId) => {
    setIsLoading(false);
    try {
      const response = await fetch(
        `http://localhost:8000/api/withdrawal/${withdrawId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ERROR! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result: ", result);
      setIsLoading(true);
    } catch (err) {
      console.error(`Server Error! ${err}`);
      setIsLoading(true);
    }
  };

  const handleWithdrawStatusChange = (e, rowIndex) => {
    const value = e.target.value;

    if (value === "") {
      setDirtyRows((prev) => {
        const updated = new Set(prev);
        updated.delete(rowIndex);
        return updated;
      });
      return;
    }

    setDirtyRows((prev) => {
      const updated = new Set(prev);
      updated.add(rowIndex);
      return updated;
    });
    setStatus(value);
  };

  const handleSave = (rowIndex, id) => {
    setDirtyRows((prev) => {
      const updated = new Set(prev);
      updated.delete(rowIndex);
      return updated;
    });

    updateWithdrawaStatus(status, id);
  };

  return (
    <div className="min-w-200">
      <h2 className="text-xl font-semibold mb-4">Withdrawal Table</h2>

      <table className="w-full text-left">
        <thead className="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Method</th>
            <th className="py-3 px-4">Account Name</th>
            <th className="py-3 px-4">Bank Name</th>
            <th className="py-3 px-4">Account Number</th>
            <th className="py-3 px-4">Routing Number</th>
            <th className="py-3 px-4">Swift Code</th>
            <th className="py-3 px-4">Currency</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4">Processing Fee</th>
            <th className="py-3 px-4">Net Amount</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {withdrawals?.map((withdrawal, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-4 px-4">{index + 1}</td>
              <td className="py-4 px-4">{withdrawal.method}</td>
              <td className="py-4 px-4">{withdrawal.details.accountName}</td>
              <td className="py-4 px-4">{withdrawal.details.bankName}</td>
              <td className="py-4 px-4">{withdrawal.details.accountNumber}</td>
              <td className="py-4 px-4">{withdrawal.details.routingNumber}</td>
              <td className="py-4 px-4">{withdrawal.details.swiftCode}</td>
              <td className="py-4 px-4">{withdrawal.currency}</td>
              <td className="py-4 px-4">{formatAmount(withdrawal.amount)}</td>
              <td className="py-4 px-4">
                {formatAmount(withdrawal.processing_fee)}
              </td>
              <td className="py-4 px-4">
                {formatAmount(withdrawal.net_amount)}
              </td>
              <td className="py-4 px-4">{withdrawal.status}</td>

              <td className="mt-4 py-4 px-4 flex gap-2 justify-center items-center">
                {withdrawal.status === "pending" && (
                  <>
                    <select
                      onChange={(e) => handleWithdrawStatusChange(e, index)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Select</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {dirtyRows.has(index) && (
                      <Button
                        onClick={() => handleSave(index, withdrawal._id)}
                        extraCss="px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                        bgColour="bg-yellow-400"
                        textColour="text-black"
                        hoverBgColour="hover:bg-yellow-500"
                        disabled={isLoading}
                      >
                        <CiSaveUp2 size={18} />
                      </Button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
