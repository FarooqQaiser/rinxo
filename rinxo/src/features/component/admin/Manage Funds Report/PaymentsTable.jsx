import StatusBadge from "./StatusBadge";

export default function PaymentsTable({ data, formatAmount }) {
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
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Order ID
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                Currency
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
            {data?.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
                <td className="py-4 px-4 text-sm font-mono text-gray-600">
                  {p.payment_id}
                </td>
                <td className="py-4 px-4 text-sm font-mono text-gray-600">
                  {p.order_id}
                </td>
                <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                  {formatAmount(p.price_amount)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{p.pay_currency}</td>
                <td className="py-4 px-4 text-center">
                  <StatusBadge status={p.payment_status} />
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {p.created_at.split("T")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-3">
        {data?.map((p, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
              <div>
                <div className="text-xs text-gray-500 mb-1">Payment #{i + 1}</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatAmount(p.price_amount)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{p.pay_currency}</div>
              </div>
              <StatusBadge status={p.payment_status} />
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Payment ID</div>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {p.payment_id}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Order ID</div>
                <div className="text-sm font-mono text-gray-900 break-all">
                  {p.order_id}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Date</div>
                <div className="text-sm text-gray-900">
                  {p.created_at.split("T")[0]}
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!data || data.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No payments found
          </div>
        )}
      </div>
    </>
  );
}