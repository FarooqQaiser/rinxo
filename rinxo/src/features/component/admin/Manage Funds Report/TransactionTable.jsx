export default function TransactionTable({ transactions }) {
  const formatAmount = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return Number(value).toFixed(2);
  };

  return (
    <div className="min-w-200">
      <h2 className="text-xl font-semibold mb-4">Transaction Table</h2>
      <table className="w-full text-left">
        <thead className="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Payment ID</th>
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4">Currency</th>
            <th className="py-3 px-4">Balance Before</th>
            <th className="py-3 px-4">Balance After</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions &&
            transactions.map((transaction, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">{index + 1}</td>
                <td className="py-4 px-4">{transaction.payment_id}</td>
                <td className="py-4 px-4">{transaction.type}</td>
                <td className="py-4 px-4">
                  {formatAmount(transaction.amount)}
                </td>
                <td className="py-4 px-4">
                  {transaction.currency.toUpperCase()}
                </td>
                <td className="py-4 px-4">
                  {transaction.status === "completed"
                    ? formatAmount(transaction.balance_before)
                    : "NIL"}
                </td>
                <td className="py-4 px-4">
                  {transaction.status === "completed"
                    ? formatAmount(transaction.balance_after)
                    : "NIL"}
                </td>
                <td className="py-4 px-4">{transaction.status}</td>
                <td className="py-4 px-4">{transaction.description}</td>
                <td className="py-4 px-4">
                  {transaction.created_at.split("T")[0]}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
