import React, { useState, useEffect } from "react";
import TeamCard from "../components/TeamCard";
import { Search } from "lucide-react";
import fetchData from "../utils/fetchData";

const TeamsPage = () => {
  const [view, setView] = useState("grid"); // 'grid' or 'list'

  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
 

  // Filter data when search term or year filter changes
  useEffect(() => {
    fetchData(import.meta.env.VITE_SALES_TEAMS, {}, setLoading, setError)
    .then((results)=>{


      if (searchTerm) {
        results = results.filter(
          (team) =>
            team.members.some((member) =>
              member.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) || team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      setFilteredTeams(results);
    })

  }, [searchTerm, teams]);

  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex gap-16">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sales Teams
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage and view all sales team performance
              </p>
            </div>

            <div className="relative flex item-center h-12 w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by member or team name.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1 rounded ${
                  view === "grid"
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1 rounded ${
                  view === "list"
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {  loading  ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) 
        :
            (filteredTeams && filteredTeams.length != 0) ? 
        <div
          className={`grid ${
            view === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          } gap-6`}
        >
          {(
            filteredTeams.map((team, index) => (
              <TeamCard key={index} team={team} />
            ))
          ) }
        </div>
        : (
            <>
              <div className="mt-10 text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md">
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  🚫 There is no team or member matching your search term.
                </p>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default TeamsPage;
