export default function PaymentsTable({ payments }) {
  const formatAmount = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return Number(value).toFixed(2);
  };

  return (
    <div className="min-w-200">
      <h2 className="text-xl font-semibold mb-4">Payments Table</h2>
      <table className="w-full text-left">
        <thead className="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Payment ID</th>
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Price Amount</th>
            <th className="py-3 px-4">Price Currency</th>
            <th className="py-3 px-4">Pay Amount</th>
            <th className="py-3 px-4">Pay Currency</th>
            <th className="py-3 px-4">Actually Paid</th>
            <th className="py-3 px-4">Pay Address</th>
            <th className="py-3 px-4">Created At</th>
          </tr>
        </thead>
        <tbody>
          {payments &&
            payments.map((payment, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">{index + 1}</td>
                <td className="py-4 px-4">{payment.payment_id}</td>
                <td className="py-4 px-4">{payment.order_id}</td>
                <td className="py-4 px-4">{payment.payment_status}</td>
                <td className="py-4 px-4">
                  {formatAmount(payment.price_amount)}
                </td>
                <td className="py-4 px-4">{payment.pay_currency}</td>
                <td className="py-4 px-4">{payment.pay_amount}</td>
                <td className="py-4 px-4">{payment.pay_currency}</td>
                <td className="py-4 px-4">{payment.actually_paid}</td>
                <td className="py-4 px-4">{payment.pay_address}</td>
                <td className="py-4 px-4">
                  {payment.created_at.split("T")[0]}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
