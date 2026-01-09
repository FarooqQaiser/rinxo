export default function CryptoDepositTable({ data, formatAmount }) {
  return (
    <>
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
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Balance Change
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Description
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Date
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
                <td className="py-4 px-4 text-right text-sm font-semibold text-green-600">
                  +{d.currency.toUpperCase()} {formatAmount(d.amount)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {formatAmount(d.balance_before)} →{" "}
                  {formatAmount(d.balance_after)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {d.description}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {d.created_at.split("T")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-3">
        {data?.map((d, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            {/* Header */}
            <div className="mb-3 pb-3 border-b border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Deposit #{i + 1}</div>
              <div className="text-xl font-bold text-green-600">
                +{d.currency.toUpperCase()} {formatAmount(d.amount)}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Payment ID</div>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {d.payment_id}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Balance Change</div>
                <div className="text-sm text-gray-900">
                  {formatAmount(d.balance_before)} →{" "}
                  {formatAmount(d.balance_after)}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Description</div>
                <div className="text-sm text-gray-900">{d.description}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Date</div>
                <div className="text-sm text-gray-900">
                  {d.created_at.split("T")[0]}
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!data || data.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No deposits found
          </div>
        )}
      </div>
    </>
  );
}
