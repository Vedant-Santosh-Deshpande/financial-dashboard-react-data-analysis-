import React, { useEffect, useState,useMemo } from "react";
import Card from "../components/Card";
import TransactionsTable from "../components/TransactionsTable";
import TransactionItem from "../components/TransactionItem";
import RecentTransactions from "../components/RecentTransactions";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchTransactions } from "../services/api";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [summary, setSummary] = useState({
    revenue: 0,
    expenses: 0,
    balance: 0,
    savings: 0,
  });

  const [filters, setFilters] = useState({
    minAmount: "",
    maxAmount: "",
    status: "",
    category: "",
    userId: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [chartRange, setChartRange] = useState("Monthly");
const [showChartFilter, setShowChartFilter] = useState(false);



  
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchMin = filters.minAmount
        ? t.amount >= parseFloat(filters.minAmount)
        : true;

      const matchMax = filters.maxAmount
        ? t.amount <= parseFloat(filters.maxAmount)
        : true;

      const matchStatus = filters.status
        ? t.status?.toLowerCase() === filters.status.toLowerCase()
        : true;

      const matchCategory = filters.category
        ? t.category?.toLowerCase() === filters.category.toLowerCase()
        : true;

      const matchUser = filters.userId
        ? t.user_id === filters.userId
        : true;

      return (
        matchMin &&
        matchMax &&
        matchStatus &&
        matchCategory &&
        matchUser
      );
    });
  }, [transactions, filters]);


  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => console.error("Failed to fetch transactions:", err));
  }, []);
  
  
  useEffect(() => {
    setChartData(generateMonthlyChartData(filteredTransactions));
    setStatusChartData(generateStatusChartData(filteredTransactions));
    setSummary(calculateSummary(filteredTransactions));
  }, [filteredTransactions]);
  
  useEffect(() => {
    setChartData(generateMonthlyChartData(filteredTransactions));
    setStatusChartData(generateStatusChartData(filteredTransactions));
    setSummary(calculateSummary(filteredTransactions));
  }, [filteredTransactions]);
  
  useEffect(() => {
    let filtered = [];
    if (chartRange === "Monthly") {
      filtered = generateMonthlyChartData(transactions);
    } else if (chartRange === "Weekly") {
      filtered = generateWeeklyChartData(transactions);
    } else if (chartRange === "Yearly") {
      filtered = generateYearlyChartData(transactions);
    }
    setChartData(filtered);
  }, [chartRange, transactions]);








  function generateWeeklyChartData(transactions) {
  const weeklyMap = {};

  transactions.forEach((t) => {
    const dateObj = new Date(t.date);
    if (isNaN(dateObj)) return;

    // Get the start of week (Monday)
    const day = dateObj.getDay();
    const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(dateObj.setDate(diff));
    const weekKey = monday.toISOString().slice(0, 10);

    if (!weeklyMap[weekKey]) {
      weeklyMap[weekKey] = { income: 0, expenses: 0 };
    }

    if (t.category?.toLowerCase() === "revenue") {
      weeklyMap[weekKey].income += t.amount;
    } else if (t.category?.toLowerCase() === "expense") {
      weeklyMap[weekKey].expenses += t.amount;
    }
  });

  return Object.entries(weeklyMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([weekKey, values]) => ({
      month: `Week of ${new Date(weekKey).toLocaleDateString()}`,
      income: parseFloat(values.income.toFixed(2)),
      expenses: parseFloat(values.expenses.toFixed(2)),
    }));
}



  function generateMonthlyChartData(transactions) {
    const monthlyMap = {};

    transactions.forEach((t) => {
      const dateObj = new Date(t.date);
      if (isNaN(dateObj)) return;

      const monthKey = `${dateObj.getFullYear()}-${(
        dateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expenses: 0 };
      }

      if ((t.category || "").toLowerCase() === "revenue") {
        monthlyMap[monthKey].income += t.amount;
      } else if ((t.category || "").toLowerCase() === "expense") {
        monthlyMap[monthKey].expenses += t.amount;
      }
    });

    return Object.entries(monthlyMap)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([monthKey, values]) => ({
        month: new Date(`${monthKey}-01`).toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        income: parseFloat(values.income.toFixed(2)),
        expenses: parseFloat(values.expenses.toFixed(2)),
      }));
  }

function generateYearlyChartData(transactions) {
  const yearlyMap = {};

  transactions.forEach((t) => {
    const dateObj = new Date(t.date);
    if (isNaN(dateObj)) return;

    const yearKey = dateObj.getFullYear();

    if (!yearlyMap[yearKey]) {
      yearlyMap[yearKey] = { income: 0, expenses: 0 };
    }

    if (t.category?.toLowerCase() === "revenue") {
      yearlyMap[yearKey].income += t.amount;
    } else if (t.category?.toLowerCase() === "expense") {
      yearlyMap[yearKey].expenses += t.amount;
    }
  });

  return Object.entries(yearlyMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([yearKey, values]) => ({
      month: yearKey.toString(),
      income: parseFloat(values.income.toFixed(2)),
      expenses: parseFloat(values.expenses.toFixed(2)),
    }));
}

  function generateStatusChartData(transactions) {
    const statusMap = {};

    transactions.forEach((t) => {
      const status = t.status || "Unknown";
      if (!statusMap[status]) {
        statusMap[status] = 0;
      }
      statusMap[status] += t.amount;
    });

    return Object.entries(statusMap).map(([status, amount]) => ({
      status,
      amount: parseFloat(amount.toFixed(2)),
    }));
  }

  function calculateSummary(transactions) {
    let revenue = 0;
    let expenses = 0;

    transactions.forEach((t) => {
      if ((t.category || "").toLowerCase() === "revenue") {
        revenue += t.amount;
      } else if ((t.category || "").toLowerCase() === "expense") {
        expenses += t.amount;
      }
    });

    const balance = revenue - expenses;
    const savings = balance * 0.3;

    return {
      revenue: revenue.toFixed(2),
      expenses: expenses.toFixed(2),
      balance: balance.toFixed(2),
      savings: savings.toFixed(2),
    };
  }




  const [currentPage, setCurrentPage] = useState(1);
const transactionsPerPage = 30;
const indexOfLastTx = currentPage * transactionsPerPage;
const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
const currentTransactions = filteredTransactions.slice(
  indexOfFirstTx,
  indexOfLastTx
);
const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden  bg-[#2d2c33] text-white flex">
      {/* Sidebar */}
      {/* <aside className="fixed top-0 left-0 h-full w-64 bg-[#121212] p-5 z-50 overflow-y-auto">
        <div className="text-white font-bold text-4xl mb-6 mt-3 text-center">Penta</div>
        <nav className="flex flex-col space-y-4 text-gray-400 mt-10">
          {["Dashboard", "Transactions", "Wallet", "Analytics", "Settings"].map(
            (tab) => (
              <div key={tab} className="p-2 ml-10 hover:text-green-400 cursor-pointer text-lg text-start  ">
                {tab}
              </div>
            )
          )}
        </nav>
      </aside> */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-[#121212] p-5 z-50 overflow-y-auto">
        <div className="text-white font-bold text-4xl mb-6 mt-3 text-center">
          Penta
        </div>
        <nav className="flex flex-col space-y-4 mt-10">
          {["Dashboard", "Transactions", "Wallet", "Analytics", "Settings"].map(
            (tab) => (
              <div
                key={tab}
                className={`p-2 ml-10 cursor-pointer text-lg text-start ${
                  activePage === tab
                    ? "text-green-400 font-bold"
                    : "text-gray-400 hover:text-green-400"
                }`}
                onClick={() => setActivePage(tab)}
              >
                {tab}
              </div>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      {activePage === "Dashboard" && (
        <>
          <main className="flex-1 ml-64">
            {/* Header with filter icon */}
            <div className="w-full flex justify-between bg-[#121212] items-center mb-2 p-6">
              <div className="text-3xl font-semibold">Dashboard</div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-black bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                Filter
              </button>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="bg-[#121212] p-6 m-6 rounded-xl mb-6 grid grid-cols-2 gap-4 ">

                {/* MinAmount */}
                <div className=" border border-gray-700 p-4 rounded-lg">
                  <label className="block text-gray-400 mb-1">Min Amount</label>
                  <input
                    type="number"
                    className="p-2 rounded w-100 text-gray-400 border border-white"
                    value={filters.minAmount}
                    onChange={(e) =>
                      setFilters({ ...filters, minAmount: e.target.value })
                    }
                  />
                </div>

                    {/* MaxAmount */}
                <div className=" border border-gray-700 p-4 rounded-lg">
                  <label className="block text-gray-400 mb-1">Max Amount</label>
                  <input
                    type="number"
                    className="p-2 rounded  text-gray-400 w-100 border border-white"
                    value={filters.maxAmount}
                    onChange={(e) =>
                      setFilters({ ...filters, maxAmount: e.target.value })
                    }
                  />
                </div>

                    {/* Status */}
                <div className=" border border-gray-700 p-4 rounded-lg">
                  <label className="block text-gray-400 mb-1">Status</label>
                  <select
                    className="p-2 rounded w-100 text-gray-400  border border-white"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                    {/* Category */}
                <div className=" border border-gray-700 p-4 rounded-lg">
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    className="p-2 rounded w-100 text-gray-400  border border-white"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                  {/* User ID */}
                <div className=" border border-gray-700 p-4 rounded-lg">
                  <label className="block text-gray-400 mb-1">User ID</label>
                  <select
                    className="p-2 rounded w-100 text-gray-400  border border-white"
                    value={filters.userId}
                    onChange={(e) =>
                      setFilters({ ...filters, userId: e.target.value })
                    }
                  >
                    <option value="">All</option>
                    <option value="user_001">user_001</option>
                    <option value="user_002">user_002</option>
                    <option value="user_003">user_003</option>
                    <option value="user_004">user_004</option>
                  </select>
                </div>


                <div className="flex gap-4 items-center justify-center col-span-2">
                  <button
                    className="bg-green-500 px-4 py-2 rounded text-black hover:bg-green-600"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </button>

                  <button
                    className="bg-red-500 px-4 py-2 rounded text-black  "
                    onClick={() => {
                      setFilters({
                        minAmount: "",
                        maxAmount: "",
                        status: "",
                        category: "",
                        userId: "",
                      });
                    }}
                  >
                    Clear Filters
                  </button>
                </div>

              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 m-6">
              <Card title="Balance" value={`$${summary.balance}`} />
              <Card title="Revenue" value={`$${summary.revenue}`} />
              <Card title="Expenses" value={`$${summary.expenses}`} />
              <Card title="Savings" value={`$${summary.savings}`} />
            </div>


            <div className="grid grid-cols-3 gap-6 m-6">
              <div className="col-span-2">
                {/* your LineChart goes here */}
                            <div className="bg-[#121212] m-6 p-4 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg">{chartRange} Revenue vs Expenses</h2>
                <div className="relative w-15 h-8 pl-3 text-black border rounded-lg cursor-pointer hover:text-white bg-gray-300"
                onClick={() => setShowChartFilter(!showChartFilter)}
                >
                  {/* <i
                    className="fas fa-filter text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => setShowChartFilter(!showChartFilter)}
                  ></i> */}Filter
                  {showChartFilter && (
                    <div className="absolute right-0 mt-2 w-32 bg-[#1f1f1f] border border-gray-700 rounded shadow-lg z-50">
                      {["Weekly", "Monthly", "Yearly"].map((range) => (
                        <div
                          key={range}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setChartRange(range);
                            setShowChartFilter(false);
                            // Optional: trigger data reload here
                          }}
                        >
                          {range}
                        </div>
                      ))}
                    </div>
                  )}
                </div>


              </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#facc15"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              </div>
              <RecentTransactions transactions={transactions} />
            </div>


            {/* Transactions */}
            <div className="bg-[#121212]  m-6 p-4 rounded-xl">
              <h2 className="text-lg mb-4">All Transactions</h2>

              <div className="grid grid-cols-4 gap-6 items-center py-4 border-b border-gray-700 text-white text-sm">
                <div  className="text-center">User</div>
                <div  className="text-center">Date</div>
                <div className="text-center">Amount</div>
                <div className="text-center">Status</div>
              </div>


              {currentTransactions.map((t) => (
                <TransactionItem key={t.id} {...t} />
              ))}

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
          </main>
        </>
      )}

       {activePage === "Transactions" && (
        <div className="ml-64 m-0 p-0">
           <TransactionsTable
            transactions={currentTransactions}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            filters={filters}
            setFilters={setFilters}
          />

        </div>
        )}
    </div>
  );
}
