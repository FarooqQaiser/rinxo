import StatusBadge from "./StatusBadge";

export default function TransactionTable({ data, formatAmount }) {
   

  return (
    <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">ID</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Payment ID</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Balance Change</th>
          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data?.map((t, i) => (
          <tr key={i} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 text-sm text-gray-900">#{i + 1}</td>
            <td className="py-4 px-4 text-sm font-mono text-gray-600">{t.payment_id}</td>
            <td className="py-4 px-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                t.type === "deposit" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              }`}>
                {t.type.toUpperCase()}
              </span>
            </td>
            <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
              {t.currency.toUpperCase()} {formatAmount(t.amount)}
            </td>
            <td className="py-4 px-4 text-sm text-gray-600">
              {t.status === "completed" 
                ? `${formatAmount(t.balance_before)} → ${formatAmount(t.balance_after)}`
                : "N/A"
              }
            </td>
            <td className="py-4 px-4 text-center">
              <StatusBadge status={t.status} />
            </td>
            <td className="py-4 px-4 text-sm text-gray-600">{t.created_at.split("T")[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}
