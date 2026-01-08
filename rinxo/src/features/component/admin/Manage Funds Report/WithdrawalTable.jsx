import { useState } from "react";
import StatusBadge from "./StatusBadge";

export default function WithdrawalTable({ data, formatAmount, setIsLoading }) {
  const [selectedStatus, setSelectedStatus] = useState({});
  const [loadingRow, setLoadingRow] = useState(null);
  const [completedRows, setCompletedRows] = useState(new Set());

  const updateWithdrawalStatus = async (status, withdrawId, rowIndex) => {
    setLoadingRow(rowIndex);

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

      await response.json();

      setCompletedRows((prev) => new Set([...prev, rowIndex]));
      setIsLoading(true);
      setSelectedStatus((prev) => {
        const updated = { ...prev };
        delete updated[rowIndex];
        return updated;
      });
    } catch (err) {
      console.error("Server Error:", err);
    } finally {
      setLoadingRow(null);
    }
  };

  const handleStatusChange = (e, rowIndex) => {
    const value = e.target.value;

    if (value === "") {
      setSelectedStatus((prev) => {
        const updated = { ...prev };
        delete updated[rowIndex];
        return updated;
      });
    } else {
      setSelectedStatus((prev) => ({
        ...prev,
        [rowIndex]: value,
      }));
    }
  };

  const handleSave = (rowIndex, id) => {
    const status = selectedStatus[rowIndex];
    if (status) {
      updateWithdrawalStatus(status, id, rowIndex);
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Method
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Account Details
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Bank Info
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fee
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Net Amount
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data?.map((w, i) => (
              <tr key={w._id || i} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  #{i + 1}
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {w.method}
                  </div>
                </td>
                <td className="py-4 px-4">
                  {w.method === "crypto" ? (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        <span className="text-gray-500">Currency:</span>{" "}
                        {w.details?.currency || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 font-mono break-all max-w-xs">
                        {w.details?.walletAddress || "N/A"}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {w.details?.accountName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Acc: {w.details?.accountNumber || "N/A"}
                      </div>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4">
                  {w.method === "crypto" ? (
                    <div className="text-sm text-gray-900">
                      <span className="text-gray-500">Network:</span>{" "}
                      {w.details?.network || "N/A"}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {w.details?.bankName || "N/A"}
                      </div>
                      {w.details?.swiftCode && (
                        <div className="text-xs text-gray-500">
                          SWIFT: {w.details.swiftCode}
                        </div>
                      )}
                      {w.details?.routingNumber && (
                        <div className="text-xs text-gray-500">
                          Routing: {w.details.routingNumber}
                        </div>
                      )}
                    </div>
                  )}
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
                <td className="py-4 px-4">
                  {w.status === "pending" && !completedRows.has(i) && (
                    <div className="flex gap-2 justify-center items-center">
                      <select
                        onChange={(e) => handleStatusChange(e, i)}
                        value={selectedStatus[i] || ""}
                        disabled={loadingRow === i}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select Action</option>
                        <option value="completed">Approve</option>
                        <option value="cancelled">Reject</option>
                      </select>
                      {selectedStatus[i] && (
                        <button
                          onClick={() => handleSave(i, w._id)}
                          disabled={loadingRow === i}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors shadow-sm"
                        >
                          {loadingRow === i ? "Saving..." : "Save"}
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No withdrawal requests found
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {data?.map((w, i) => (
          <div
            key={w._id || i}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-500 mb-1">Request #{i + 1}</div>
                <div className="text-sm font-semibold text-gray-900 capitalize">
                  {w.method}
                </div>
              </div>
              <StatusBadge status={w.status} />
            </div>

            {/* Account Details */}
            <div className="space-y-3 mb-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Account Details</div>
                {w.method === "crypto" ? (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      Currency: {w.details?.currency || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600 font-mono break-all">
                      {w.details?.walletAddress || "N/A"}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {w.details?.accountName || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600">
                      Acc: {w.details?.accountNumber || "N/A"}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {w.method === "crypto" ? "Network" : "Bank Info"}
                </div>
                {w.method === "crypto" ? (
                  <div className="text-sm text-gray-900">
                    {w.details?.network || "N/A"}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {w.details?.bankName || "N/A"}
                    </div>
                    {w.details?.swiftCode && (
                      <div className="text-xs text-gray-600">
                        SWIFT: {w.details.swiftCode}
                      </div>
                    )}
                    {w.details?.routingNumber && (
                      <div className="text-xs text-gray-600">
                        Routing: {w.details.routingNumber}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Amount Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Amount</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {w.currency} {formatAmount(w.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Fee</div>
                  <div className="text-sm font-medium text-gray-600">
                    {formatAmount(w.processing_fee)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Net Amount</div>
                  <div className="text-sm font-semibold text-green-600">
                    {formatAmount(w.net_amount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {w.status === "pending" && !completedRows.has(i) && (
              <div className="space-y-2">
                <select
                  onChange={(e) => handleStatusChange(e, i)}
                  value={selectedStatus[i] || ""}
                  disabled={loadingRow === i}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Action</option>
                  <option value="completed">Approve</option>
                  <option value="cancelled">Reject</option>
                </select>
                {selectedStatus[i] && (
                  <button
                    onClick={() => handleSave(i, w._id)}
                    disabled={loadingRow === i}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors shadow-sm"
                  >
                    {loadingRow === i ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {(!data || data.length === 0) && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            No withdrawal requests found
          </div>
        )}
      </div>
    </>
  );
}
