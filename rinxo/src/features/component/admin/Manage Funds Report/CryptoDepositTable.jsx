export default function CryptoDepositTable({ data, formatAmount }) {
  return (
    <div className="overflow-x-auto">
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
  );
}
