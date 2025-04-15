import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Trophy,
  User,
  DollarSign,
} from "lucide-react";
import fetchData from "../utils/fetchData";

export default function AgentRankings() {
  const [currentMonth, setCurrentMonth] = useState("jan");
  const [sortBy, setSortBy] = useState("rank");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const currentMonthIndex = monthsShort.indexOf(currentMonth);
  const currentMonthName = months[currentMonthIndex];

  useEffect(() => {
    // Simulate API fetch
    // setLoading(true);
    // In a real app, this would be an actual API call
    // fetch('/api/rankings')

    fetchData(import.meta.env.VITE_AGENT_RANKINGS, {}, setLoading).then(
      (rankingData) => {
        setData(rankingData);
      }
    );

    //   setData(sampleData);
    // setLoading(false);
  }, []);

  const handlePrevMonth = () => {
    const prevIndex = (currentMonthIndex - 1 + 12) % 12;
    setCurrentMonth(monthsShort[prevIndex]);
  };

  const handleNextMonth = () => {
    const nextIndex = (currentMonthIndex + 1) % 12;
    setCurrentMonth(monthsShort[nextIndex]);
  };

  const getCurrentMonthData = () => {
    if (!data || !data[currentMonth]) return [];

    // Convert the object to an array for easier rendering
    const rankingsArray = Object.entries(data[currentMonth]).map(
      ([rank, details]) => ({
        rank: parseInt(rank),
        agent: details.agent,
        gross_commission: details.gross_commission,
      })
    );

    // Sort based on the selected sorting method
    if (sortBy === "name") {
      rankingsArray.sort((a, b) => a.agent.localeCompare(b.agent));
    }
    // For rank sorting, we use the original ranking

    return rankingsArray;
  };

  const currentMonthData = getCurrentMonthData();

  const formatCurrency = (amount) => {
    return `AED ${amount.toLocaleString()}`;
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-amber-500 text-black";
      case 2:
        return "bg-gray-400 text-black";
      case 3:
        return "bg-amber-700 text-white";
      default:
        return "bg-blue-700 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Agent Rankings {currentYear}
      </h1>

      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center bg-gray-800 dark:bg-gray-800 text-white px-4 py-2 rounded">
            <button onClick={handlePrevMonth} className="p-1 mr-2">
              <ChevronLeft size={20} />
            </button>
            <Calendar size={20} className="mr-2" />
            <span className="font-medium">
              {currentMonthName} {currentYear}
            </span>
            <button onClick={handleNextMonth} className="p-1 ml-2">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded">
            <span className="px-3 text-gray-700 dark:text-gray-300">
              SORT BY:
            </span>
            <button
              className={`flex items-center px-4 py-2 rounded ${
                sortBy === "rank"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setSortBy("rank")}
            >
              <Trophy size={18} className="mr-2" />
              Rank
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded ${
                sortBy === "name"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setSortBy("name")}
            >
              <User size={18} className="mr-2" />
              Name
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
          <div className="grid grid-cols-3 p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Trophy size={16} className="mr-2" />
              <span className="font-medium">RANK</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <User size={16} className="mr-2" />
              <span className="font-medium">AGENT</span>
            </div>
            <div className="flex items-center justify-end text-gray-500 dark:text-gray-400">
              <DollarSign size={16} className="mr-2" />
              <span className="font-medium">GROSS COMMISSION</span>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : currentMonthData.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No data available for this month.
            </div>
          ) : (
            currentMonthData.map((item) => (
              <div
                key={item.rank}
                className="grid grid-cols-3 p-4 border-b border-gray-100 dark:border-gray-700 items-center"
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankColor(
                      item.rank
                    )}`}
                  >
                    {item.rank}
                  </div>
                </div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {item.agent}
                </div>
                <div className="text-right text-green-500 font-medium">
                  {formatCurrency(item.gross_commission)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
