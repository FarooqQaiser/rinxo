import StatusBadge from "./StatusBadge";

export default function TransactionTable({ data, formatAmount }) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
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
                Type
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Balance Change
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
                <td className="py-4 px-4 text-sm font-mono text-gray-600">
                  {t.payment_id}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      t.type === "deposit"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {t.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                  {t.currency.toUpperCase()} {formatAmount(t.amount)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {t.status === "completed"
                    ? `${formatAmount(t.balance_before)} → ${formatAmount(
                        t.balance_after
                      )}`
                    : "N/A"}
                </td>
                <td className="py-4 px-4 text-center">
                  <StatusBadge status={t.status} />
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {t.created_at.split("T")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-3">
        {data?.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Transaction #{i + 1}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      t.type === "deposit"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {t.type.toUpperCase()}
                  </span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {t.currency.toUpperCase()} {formatAmount(t.amount)}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Payment ID</div>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {t.payment_id}
                </div>
              </div>

              {t.status === "completed" && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Balance Change</div>
                  <div className="text-sm text-gray-900">
                    {formatAmount(t.balance_before)} →{" "}
                    {formatAmount(t.balance_after)}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-500 mb-1">Date</div>
                <div className="text-sm text-gray-900">
                  {t.created_at.split("T")[0]}
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!data || data.length === 0) && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            No transactions found
          </div>
        )}
      </div>
    </>
  );
}