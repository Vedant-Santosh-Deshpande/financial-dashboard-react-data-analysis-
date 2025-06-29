


import React from "react";
import { Link } from "react-router-dom";

export default function RecentTransactions({ transactions }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="bg-[#121212] rounded-xl p-4 mt-6 w-full h-95">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-white">Recent Transactions</h2>
        <Link
          to="/transactions"
          className="text-green-400 text-sm hover:underline"
        >
          See all
        </Link>
      </div>

      {recent.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between mb-3 hover:bg-[#2d2c33] p-2 rounded"
        >
          <div className="flex items-center">
            <img
              src={t.user_profile || "https://via.placeholder.com/40"}
              alt="?"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="text-white text-sm">{t.user_id}</div>
          </div>

          <div
            className={`text-sm font-semibold ${
              t.status?.toLowerCase() === "paid"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {t.status?.toLowerCase() === "paid" ? "+" : "-"}${t.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
