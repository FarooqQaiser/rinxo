import { useState } from "react";
import { CiSaveUp2 } from "react-icons/ci";
import Button from "../../../../components/common/Button/Button";

export default function WithdrawalTable({
 data, formatAmount, StatusBadge
}) {
   const [dirtyRows, setDirtyRows] = useState(new Set());
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateWithdrawalStatus = async (status, withdrawId) => {
    setIsLoading(true);
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
      window.location.reload();
    } catch (err) {
      console.error(`Server Error! ${err}`);
    } finally {
      setIsLoading(false);
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

    updateWithdrawalStatus(status, id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">ID</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Account Details</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Bank Info</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Fee</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Net Amount</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data?.map((w, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
              <td className="py-4 px-4">
                <div className="text-sm font-medium text-gray-900">{w.details.accountName}</div>
                <div className="text-xs text-gray-500">{w.details.accountNumber}</div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-900">{w.details.bankName}</div>
                <div className="text-xs text-gray-500">SWIFT: {w.details.swiftCode}</div>
              </td>
              <td className="py-4 px-4 text-right text-sm font-medium text-gray-900">
                {w.currency} {formatAmount(w.amount)}
              </td>
              <td className="py-4 px-4 text-right text-sm text-gray-600">
                {formatAmount(w.processing_fee)}
              </td>
              <td className="py-4 px-4 text-right text-sm font-semibold text-green-600">
                {formatAmount(w.net_amount)}
              </td>
              <td className="py-4 px-4 text-center">
                <StatusBadge status={w.status} />
              </td>
              <td className="py-4 px-4 text-center">
                {w.status === "pending" && (
                  <div className="flex gap-2 justify-center items-center">
                    <select 
                      onChange={(e) => handleWithdrawStatusChange(e, i)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="">Action</option>
                      <option value="completed">Approve</option>
                      <option value="cancelled">Reject</option>
                    </select>
                    {dirtyRows.has(i) && (
                      <button
                        onClick={() => handleSave(i, w._id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                      >
                        Save
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
