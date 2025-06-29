export default function TransactionItem({
  user_profile,
  user_id,
  date,
  amount,
  status,
}) {
  return (
    <div className="grid grid-cols-4 gap-6 items-center justify-center py-2 border-b border-gray-700 text-white text-sm">
      <div className="flex ml-21 items-center gap-3">
        {user_profile ? (
          <img
            src={user_profile}
            alt={user_id}
            className="w-8 h-8 ml-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8  rounded-full bg-gray-600 flex items-center justify-center text-xs">
            ?
          </div>
        )}
        <span className="font-medium text-gray-200">{user_id}</span>
      </div>

      <div className="text-center text-gray-400">{new Date(date).toDateString()}</div>

      <div
        className={` text-center font-medium ${
          status === "Paid"
            ? "text-green-400"
            : status === "Unpaid"
            ? "text-red-400"
            : "text-yellow-400"
        }`}
      >
        {status === "Paid" ? "+" : status === "Unpaid" ? "-" : "-"}
        ${amount.toFixed(2)}
      </div>

      <div
        className={`w-30 ml-20 h-8 text-center text-xs px-3 py-2 rounded-full font-semibold ${
          status === "Paid"
            ? "bg-green-700/30 text-green-400"
            : status === "Pending"
            ? "bg-yellow-400/30 text-yellow-500"
            : "bg-red-700 text-red-100"
        }`}
      >
        {status === "Paid"
          ? "Successful"
          : status === "Unpaid"
          ? "Waiting"
          : status}
      </div>
    </div>
  );
}
