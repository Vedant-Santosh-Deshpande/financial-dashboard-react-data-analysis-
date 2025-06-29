// export const fetchTransactions = async () => {
//   const res = await fetch('http://localhost:5000/api/transactions');
//   return await res.json();
// };

export const fetchTransactions = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/transactions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};
