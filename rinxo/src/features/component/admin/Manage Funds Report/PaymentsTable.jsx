import StatusBadge from "./StatusBadge";

export default function PaymentsTable({ data, formatAmount }) {
 

  return (
    <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">ID</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Payment ID</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Currency</th>
          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data?.map((p, i) => (
          <tr key={i} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
            <td className="py-4 px-4 text-sm font-mono text-gray-600">{p.payment_id}</td>
            <td className="py-4 px-4 text-sm font-mono text-gray-600">{p.order_id}</td>
            <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
              {formatAmount(p.price_amount)}
            </td>
            <td className="py-4 px-4 text-sm text-gray-600">{p.pay_currency}</td>
            <td className="py-4 px-4 text-center">
              <StatusBadge status={p.payment_status} />
            </td>
            <td className="py-4 px-4 text-sm text-gray-600">{p.created_at.split("T")[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}
