import { useState } from "react";
import StatusBadge from "./StatusBadge";

export default function BankDepositsTable({
  data,
  userId,
  setIsLoading,
  isLoading,
}) {
  const [dirtyRows, setDirtyRows] = useState(new Set());
  const [rowStatuses, setRowStatuses] = useState({});

  const handleStatusChange = (e, rowIndex) => {
    const value = e.target.value;

    if (value === "") {
      setDirtyRows((prev) => {
        const updated = new Set(prev);
        updated.delete(rowIndex);
        return updated;
      });
      setRowStatuses((prev) => {
        const updated = { ...prev };
        delete updated[rowIndex];
        return updated;
      });
      return;
    }

    setDirtyRows((prev) => {
      const updated = new Set(prev);
      updated.add(rowIndex);
      return updated;
    });
    setRowStatuses((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const updateStatus = async (status, bankDepositId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/deposits/${userId}/${bankDepositId}`,
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
      setIsLoading(false);
    } catch (err) {
      console.error(`Server Error! ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (rowIndex, id) => {
    const status = rowStatuses[rowIndex];
    if (!status) return;

    setDirtyRows((prev) => {
      const updated = new Set(prev);
      updated.delete(rowIndex);
      return updated;
    });

    updateStatus(status, id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              ID
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Account Number
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Bank Name
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Amount
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
              Date
            </th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data?.map((d, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
              <td className="py-4 px-4 text-sm font-mono text-gray-600">
                {d.accountNumber}
              </td>
              <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                {d.bankName}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">{d.amount}</td>
              <td className="py-4 px-4 text-center">
                <StatusBadge status={d.status} />
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {d.depositedAt.split("T")[0]}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {d.status === "pending" && (
                  <div className="flex gap-2 justify-center items-center">
                    <select
                      onChange={(e) => handleStatusChange(e, i)}
                      value={rowStatuses[i] || ""}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
                    >
                      <option value="">Select Action</option>
                      <option value="verified">Verify</option>
                      <option value="rejected">Reject</option>
                    </select>
                    {dirtyRows.has(i) && (
                      <button
                        onClick={() => handleSave(i, d._id)}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors shadow-sm cursor-pointer"
                      >
                        {isLoading ? "Saving..." : "Save"}
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
