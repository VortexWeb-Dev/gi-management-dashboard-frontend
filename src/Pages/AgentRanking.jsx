import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Medal, DollarSign, User, Info } from "lucide-react";
import { agentRankingData } from "./../mockData/mockdata"; 

export default function AgentRankingTable() {
  const availableYears = Object.keys(agentRankingData)
                             .map(y => parseInt(y))
                             .sort((a, b) => b - a); // Sort descending to get latest first

  const latestYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();

  const firstMonthWithData = (year) => {
      const monthsInOrder = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      if (!agentRankingData[year]) return "January";
      return monthsInOrder.find(month => agentRankingData[year][month]?.length > 0) || "January";
  }

  const [year, setYear] = useState(latestYear);
  const [selectedMonth, setSelectedMonth] = useState(firstMonthWithData(latestYear));
  const [sortOrder, setSortOrder] = useState("rank");
  const [agentData, setAgentData] = useState([]);

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const yearOptions = [...availableYears].sort((a, b) => a - b);

  useEffect(() => {
    let data = [];
    if (agentRankingData[year] && agentRankingData[year][selectedMonth]) {
       // Create a new array to avoid modifying the original mock data
      data = [...agentRankingData[year][selectedMonth]];
      sortAgentData(data, sortOrder);
    }
    setAgentData(data); // Set to empty array if no data
  }, [year, selectedMonth, sortOrder]); // Dependency array

  const sortAgentData = (data, sortBy) => {
    if (!data) return; // Guard clause

    if (sortBy === "rank") {
      data.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === "name") {
      // Sort alphabetically by name
      data.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const handleSortChange = (sortBy) => {
    setSortOrder(sortBy);
  };

  const currentMonthIndex = months.indexOf(selectedMonth);

  const nextMonth = () => {
    if (currentMonthIndex < months.length - 1) {
      setSelectedMonth(months[currentMonthIndex + 1]);
    } else {
       // Check if next year exists in data
      const nextYear = year + 1;
      if (agentRankingData[nextYear]) {
        setYear(nextYear);
        setSelectedMonth(months[0]); // Go to January of next year
      }
    }
  };

  const prevMonth = () => {
    if (currentMonthIndex > 0) {
      setSelectedMonth(months[currentMonthIndex - 1]);
    } else {
      const prevYear = year - 1;
      if (agentRankingData[prevYear]) {
        setYear(prevYear);
        setSelectedMonth(months[11]); 
      }
    }
  };

  const isPrevDisabled = () => {
    const prevYear = year - 1;
    return currentMonthIndex === 0 && !agentRankingData[prevYear];
  };

  const isNextDisabled = () => {
    const nextYear = year + 1;
    return currentMonthIndex === months.length - 1 && !agentRankingData[nextYear];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Agent Rankings</h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6"> 
          {/* Date Navigation & Selection */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            <button
              onClick={prevMonth}
              disabled={isPrevDisabled()}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-3 py-1">
              <Calendar size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-sm md:text-base">{selectedMonth} {year}</span>
            </div>
            <button
              onClick={nextMonth}
              disabled={isNextDisabled()}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Next Month"
            >
              <ChevronRight size={20} />
            </button>

            <select
              value={year}
              onChange={(e) => {
                  const newYear = parseInt(e.target.value);
                  setYear(newYear);
                  // Reset to the first available month in the new year, or January
                  setSelectedMonth(firstMonthWithData(newYear));
              }}
              className="ml-3 px-3 py-[9px] rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <div className="bg-gray-100 rounded-lg dark:bg-gray-900 p-4">
            SORT BY: 
            </div>
            {/* Using an array for easier mapping if needed, but manual is fine too */}
            {[
              { key: "rank", label: "Rank", icon: Medal },
              { key: "name", label: "Name", icon: User },
              
            ].map(sortOpt => (
              <button
                key={sortOpt.key}
                onClick={() => handleSortChange(sortOpt.key)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${sortOrder === sortOpt.key
                    ? "bg-blue-600 text-white shadow-md" // Enhanced active state
                    : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <sortOpt.icon size={16} className="mr-1.5" /> {/* Slightly more margin */}
                <span>{sortOpt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"> {/* Added overflow-x-auto */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <Medal size={16} className="mr-1.5 text-gray-400 dark:text-gray-500" />
                  Rank
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <User size={16} className="mr-1.5 text-gray-400 dark:text-gray-500" />
                  Agent
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <DollarSign size={16} className="mr-1.5 text-gray-400 dark:text-gray-500" />
                  Gross Commission
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {agentData && agentData.length > 0 ? (
              agentData.map((agent, index) => (
                <tr
                  key={agent.name + '-' + agent.rank} // More unique key
                  className={`hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-start"> {/* Center content within the cell */}
                      <span className={`
                          inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shadow-sm
                          ${agent.rank === 1 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 ring-1 ring-yellow-300 dark:ring-yellow-600' :
                           agent.rank === 2 ? 'bg-gray-100 text-gray-700 dark:bg-gray-600/20 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600' :
                           agent.rank === 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-600' :
                           'bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-600'
                         }`}
                      >
                        {agent.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{agent.name}</div>
                
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                       {formatCurrency(agent.grossCommission)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Enhanced No Data state
              <tr>
                <td colSpan="3">
                   <div className="text-center py-16 px-6 bg-gray-50 dark:bg-gray-800/30 rounded-b-lg">
                      <Info size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                      <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">No Data Available</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">There is no agent ranking data for {selectedMonth} {year}.</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}