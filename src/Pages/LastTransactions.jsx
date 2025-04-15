import React, { useState, useEffect } from 'react';
import { Search, Calendar, ArrowUpDown } from 'lucide-react';
import fetchData from '../utils/fetchData';

const AgentTransactionsTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  // Load data on component mount
  useEffect(() => {
    fetchData(import.meta.env.VITE_LAST_TRANSACTIONS, {}, setLoading, setError )
      .then((data)=>{
        console.log(data)
        setData(data)
      })
    // setData(agentLastTransactions);
    setFilteredData(data);
  }, []);

  // Filter data when search term or year filter changes
  useEffect(() => {
    let results = data;
    
    if (searchTerm) {
      results = results.filter(item => 
        item.agent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (yearFilter) {
      results = results.filter(item => {
        const dealYear = new Date(item.lastDealDate).getFullYear().toString();
        return dealYear === yearFilter;
      });
    }
    
    setFilteredData(results);
  }, [searchTerm, yearFilter, data]);

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // 'en-GB' gives '11 Jun 2024' format
  }
  
  // Get unique years for filter dropdown
  const getYearOptions = () => {
    const years = new Set();
    data.forEach(item => {
      const year = new Date(item.lastDealDate).getFullYear();
      years.add(year.toString());
    });
    return Array.from(years).sort();
  };

  if(loading || filteredData == null || filteredData.length ==0){
    return <div className="text-4xl text-gray-600 py-8">
    Loading...
  </div>
  }

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Agent Transactions</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Agent filter */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by agent name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          {/* Year filter */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="pl-10 w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Years</option>
              {getYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                // onClick={() => requestSort('agent')}
              >
                <div className="flex items-center">
                  Agent 
                  {/* {getSortIndicator('agent')} */}
                  {/* <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" /> */}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                // onClick={() => requestSort('joiningDate')}
              >
                <div className="flex items-center">
                  Joining Date 
                  {/* {getSortIndicator('joiningDate')} */}
                  {/* <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" /> */}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                // onClick={() => requestSort('lastDealDate')}
              >
                <div className="flex items-center">
                  Last Deal 
                  {/* {getSortIndicator('lastDealDate')} */}
                  {/* <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" /> */}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                // onClick={() => requestSort('project')}
              >
                <div className="flex items-center">
                  Project 
                  {/* {getSortIndicator('project')} */}
                  {/* <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" /> */}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                // onClick={() => requestSort('amount')}
              >
                <div className="flex items-center">
                  Amount 
                  {/* {getSortIndicator('amount')} */}
                  {/* <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" /> */}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                // onClick={() => requestSort('grossComms')}
              >
                <div className="flex items-center">
                  Commission 
                  {/* {getSortIndicator('grossComms')} */}
                  {/* <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" /> */}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                // onClick={() => requestSort('monthsWithoutClosing')}
              >
                <div className="flex items-center">
                  Months Without Closing 
                  {/* {getSortIndicator('monthsWithoutClosing')} */}
                  {/* <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" /> */}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {
            filteredData!=null ?
            (filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.agent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">

                    {item.joiningDate? formatDate(item.joiningDate): "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {item.joiningDate? formatDate(item.lastDealDate) : "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {item.project || "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatCurrency(item.grossComms)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.monthsWithoutClosing > 2 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : item.monthsWithoutClosing > 0
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {item.monthsWithoutClosing}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No matching records found
                </td>
              </tr>
            )
            )
            :
            <div className='text-center text-4xl font-bold text-gray-700 dark:text-gray-200'>
              Loading....
            </div>
            }
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        { filteredData != null ?
        (`Showing ${filteredData.length} of ${data.length} records`)
        :
        "No records found"
        }
      </div>
      
    </div>
  );
};

export default AgentTransactionsTable;