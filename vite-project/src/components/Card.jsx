export default function Card({ title, value }) {
  return (
    <div className="bg-[#121212] p-4 rounded-xl flex flex-col items-center text-white w-full">
      <div className="text-gray-400 text-sm mb-2  ">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}