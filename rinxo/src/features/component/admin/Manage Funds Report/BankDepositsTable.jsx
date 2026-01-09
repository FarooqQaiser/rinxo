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
  const [selectedImage, setSelectedImage] = useState(null);

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
    <>
      {/* Full-size image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-[#0000004d] bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-1xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white text-xl font-bold hover:text-gray-300 transition-colors cursor-pointer"
            >
              ✕ Close
            </button>
            <img
              src={selectedImage}
              alt="Proof Full Size"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {data?.map((d, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm font-semibold text-gray-900">
                #{i + 1}
              </div>
              <StatusBadge status={d.status} />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono text-gray-900 text-xs">
                  {d.payment_id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Account:</span>
                <span className="font-mono text-gray-900">
                  {d.accountNumber}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Bank:</span>
                <span className="text-gray-900">{d.bankName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">{d.amount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900">
                  {d.depositedAt.split("T")[0]}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Proof:</span>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                    d.proofImage
                  }`}
                  alt="Proof"
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-300"
                  onClick={() =>
                    setSelectedImage(
                      `${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        d.proofImage
                      }`
                    )
                  }
                />
              </div>
            </div>

            {d.status === "pending" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <select
                  onChange={(e) => handleStatusChange(e, i)}
                  value={rowStatuses[i] || ""}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer mb-2"
                >
                  <option value="">Select Action</option>
                  <option value="verified">Verify</option>
                  <option value="rejected">Reject</option>
                </select>
                {dirtyRows.has(i) && (
                  <button
                    onClick={() => handleSave(i, d._id)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Payment ID
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
                Proof
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
                  {d.payment_id}
                </td>
                <td className="py-4 px-4 text-sm font-mono text-gray-600">
                  {d.accountNumber}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {d.bankName}
                </td>
                <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                  {d.amount}
                </td>
                <td className="py-4 px-4 text-center">
                  <StatusBadge status={d.status} />
                </td>
                <td className="py-4 px-4 text-center">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                      d.proofImage
                    }`}
                    alt="Proof"
                    className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-300 inline-block"
                    onClick={() =>
                      setSelectedImage(
                        `${import.meta.env.VITE_BACKEND_URL}/uploads/${
                          d.proofImage
                        }`
                      )
                    }
                  />
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
    </>
  );
}
