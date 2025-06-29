// import React from "react";
// import TransactionItem from "./TransactionItem";

// export default function TransactionsTable({
//   transactions,
//   currentPage,
//   totalPages,
//   setCurrentPage,
// }) {
//   return (
//     <div className="bg-[#121212] m-6 p-4 rounded-xl w-305">
//       <h2 className="text-2xl mb-4">All Transactions</h2>

//       {/* Table Header */}
//       <div className="grid grid-cols-4 gap-6 items-center py-4 border-b border-gray-700 text-white text-sm">
//         <div className="text-center">User</div>
//         <div className="text-center">Date</div>
//         <div className="text-center">Amount</div>
//         <div className="text-center">Status</div>
//       </div>

//       {/* Transaction rows */}
//       {transactions.map((t) => (
//         <TransactionItem key={t.id} {...t} />
//       ))}

//       {/* Pagination controls */}
//       <div className="flex justify-center items-center gap-4 mt-4">
//         <button
//           className="px-3 py-1 rounded text-black bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//         >
//           Prev
//         </button>

//         <span className="text-gray-300">
//           Page {currentPage} of {totalPages}
//         </span>

//         <button
//           className="px-3 py-1 rounded text-black bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import TransactionItem from "./TransactionItem";

export default function TransactionsTable({
  transactions,
  currentPage,
  totalPages,
  setCurrentPage,
  filters,
  setFilters,
}) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleClear = () => {
    setFilters({
      status: "",
      category: "",
      minAmount: "",
      maxAmount: "",
      userId: "",
    });
    setShowFilterPanel(false);
  };

  return (
    <div className="bg-[#121212] m-6 p-4 rounded-xl w-308 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Transactions</h2>

        <button
          className="text-black bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        >
          <i className="fas fa-filter mr-2"></i>
          Filters
        </button>
      </div>

      {/* Floating filter panel */}
      {showFilterPanel && (
        <div className="absolute top-16 right-6 w-64 bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg mb-3 text-white">Filters</h3>

          {/* Status filter */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full p-2 rounded text-gray-400 bg-[#2d2c33] border border-gray-600"
            >
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full p-2 rounded text-gray-400 bg-[#2d2c33] border border-gray-600"
            >
              <option value="">All</option>
              <option value="Revenue">Revenue</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div className="flex justify-between gap-2">
            <button
              className="flex-1 bg-green-600 text-black px-3 py-2 rounded hover:bg-green-700"
              onClick={() => setShowFilterPanel(false)}
            >
              Apply
            </button>
            <button
              className="flex-1 bg-red-600 text-black px-3 py-2 rounded hover:bg-red-700"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-6 items-center py-4 border-b border-gray-700 text-white text-sm">
        <div className="text-center">User</div>
        <div className="text-center">Date</div>
        <div className="text-center">Amount</div>
        <div className="text-center">Status</div>
      </div>

      {/* Transactions */}
      {transactions.map((t) => (
        <TransactionItem key={t.id} {...t} />
      ))}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="px-3 py-1 rounded text-black bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span className="text-gray-300">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-3 py-1 rounded text-black bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
