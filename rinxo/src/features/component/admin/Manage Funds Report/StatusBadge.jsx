export default function StatusBadge({ status }) {
  const colors = {
    completed: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    failed: "bg-red-100 text-red-700 border-red-200",
    finished:"bg-green-100 text-green-700 border-green-200",
    waiting:"bg-yellow-100 text-yellow-700 border-yellow-200", 
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status?.toUpperCase()}
    </span>
  );
}
