import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Filter, X, Check, ArrowUpDown } from 'lucide-react';
import fetchData from '../utils/fetchData';

const TransactionTable = () => {
  // Data state
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    year: [],
    dealType: [],
    transactionType: [],
    leadSource: [],
    propertyType: []
  });
  
  const [dropdownOpen, setDropdownOpen] = useState({
    year: false,
    dealType: false,
    transactionType: false,
    leadSource: false,
    propertyType: false
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  // Fetch data from API
  useEffect(() => {
    fetchData(import.meta.env.VITE_OVERALL_DEALS, {}, setIsLoading, setError)
      .then((data)=>{
        setTransactions(data)
      })
  }, []);

  // Get unique years from transactions
  const years = useMemo(() => {
    if (!transactions.length) return [];
    const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [transactions]);

  // Filter options - derived from API data
  const filterOptions = useMemo(() => {
    if (!transactions.length) return {
      dealType: [],
      transactionType: [],
      leadSource: [],
      propertyType: []
    };
    
    return {
      dealType: [...new Set(transactions.map(t => t.dealType))],
      transactionType: [...new Set(transactions.map(t => t.transactionType))],
      leadSource: [...new Set(transactions.map(t => t.leadSource))],
      propertyType: [...new Set(transactions.map(t => t.propertyType))]
    };
  }, [transactions]);

  // Toggle dropdown
  const toggleDropdown = (filter) => {
    setDropdownOpen(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Toggle filter
  const toggleFilter = (filter, value) => {
    setFilters(prev => {
      const currentFilters = [...prev[filter]];
      if (currentFilters.includes(value)) {
        return { ...prev, [filter]: currentFilters.filter(v => v !== value) };
      } else {
        return { ...prev, [filter]: [...currentFilters, value] };
      }
    });
  };

  // Clear filter
  const clearFilter = (filter) => {
    setFilters(prev => ({ ...prev, [filter]: [] }));
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    if (!transactions.length) return [];
    
    return transactions.filter(transaction => {
      const year = new Date(transaction.date).getFullYear();
      
      return (filters.year.length === 0 || filters.year.includes(year)) &&
             (filters.dealType.length === 0 || filters.dealType.includes(transaction.dealType)) &&
             (filters.transactionType.length === 0 || filters.transactionType.includes(transaction.transactionType)) &&
             (filters.leadSource.length === 0 || filters.leadSource.includes(transaction.leadSource)) &&
             (filters.propertyType.length === 0 || filters.propertyType.includes(transaction.propertyType));
    });
  }, [filters, transactions]);

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    if (!filteredTransactions.length) return [];
    
    const { key, direction } = sortConfig;
    return [...filteredTransactions].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTransactions, sortConfig]);

  // Count active filters
  const countActiveFilters = (filterType) => {
    return filters[filterType].length;
  };

  
  if (isLoading || sortedTransactions.length == 0) {
    <div className='text-center text-4xl font-bold text-gray-700 dark:text-gray-200'>
              Loading....
            </div>
  }

  // Handle potential errors
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Transactions</h2>
        
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Year Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('year')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md border ${countActiveFilters('year') > 0 ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Year
              {countActiveFilters('year') > 0 && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{countActiveFilters('year')}</span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {dropdownOpen.year && (
              <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1 max-h-60 overflow-auto">
                  <div className="px-3 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Year</span>
                    {countActiveFilters('year') > 0 && (
                      <button 
                        onClick={() => clearFilter('year')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {years.map(year => (
                    <div 
                      key={year} 
                      className="px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleFilter('year', year)}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{year}</span>
                      {filters.year.includes(year) ? (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Deal Type Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('dealType')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md border ${countActiveFilters('dealType') > 0 ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Deal Type
              {countActiveFilters('dealType') > 0 && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{countActiveFilters('dealType')}</span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {dropdownOpen.dealType && (
              <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div className="px-3 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Deal Type</span>
                    {countActiveFilters('dealType') > 0 && (
                      <button 
                        onClick={() => clearFilter('dealType')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {filterOptions.dealType.map(type => (
                    <div 
                      key={type} 
                      className="px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleFilter('dealType', type)}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                      {filters.dealType.includes(type) ? (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Transaction Type Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('transactionType')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md border ${countActiveFilters('transactionType') > 0 ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Transaction Type
              {countActiveFilters('transactionType') > 0 && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{countActiveFilters('transactionType')}</span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {dropdownOpen.transactionType && (
              <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div className="px-3 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Transaction</span>
                    {countActiveFilters('transactionType') > 0 && (
                      <button 
                        onClick={() => clearFilter('transactionType')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {filterOptions.transactionType.map(type => (
                    <div 
                      key={type} 
                      className="px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleFilter('transactionType', type)}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                      {filters.transactionType.includes(type) ? (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Lead Source Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('leadSource')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md border ${countActiveFilters('leadSource') > 0 ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Source
              {countActiveFilters('leadSource') > 0 && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{countActiveFilters('leadSource')}</span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {dropdownOpen.leadSource && (
              <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1 max-h-60 overflow-auto">
                  <div className="px-3 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Source</span>
                    {countActiveFilters('leadSource') > 0 && (
                      <button 
                        onClick={() => clearFilter('leadSource')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {filterOptions.leadSource.map(source => (
                    <div 
                      key={source} 
                      className="px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleFilter('leadSource', source)}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{source}</span>
                      {filters.leadSource.includes(source) ? (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Property Type Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('propertyType')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md border ${countActiveFilters('propertyType') > 0 ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Property Type
              {countActiveFilters('propertyType') > 0 && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{countActiveFilters('propertyType')}</span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {dropdownOpen.propertyType && (
              <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1 max-h-60 overflow-auto">
                  <div className="px-3 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Property</span>
                    {countActiveFilters('propertyType') > 0 && (
                      <button 
                        onClick={() => clearFilter('propertyType')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {filterOptions.propertyType.map(type => (
                    <div 
                      key={type} 
                      className="px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => toggleFilter('propertyType', type)}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                      {filters.propertyType.includes(type) ? (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Clear All Filters Button */}
          {Object.values(filters).some(filter => filter.length > 0) && (
            <button 
              onClick={() => setFilters({
                year: [],
                dealType: [],
                transactionType: [],
                leadSource: [],
                propertyType: []
              })}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-red-50 text-red-700 border border-red-300 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/50"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </button>
          )}
        </div>
        
        {/* Active Filters Display */}
        {Object.entries(filters).some(([_, values]) => values.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, values]) => 
              values.map(value => (
                <div 
                  key={`${key}-${value}`} 
                  className="flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >
                  <span className="mr-1 font-medium">{key === 'year' ? 'Year' : key === 'dealType' ? 'Deal' : key === 'transactionType' ? 'Transaction' : key === 'leadSource' ? 'Source' : 'Property'}:</span>
                  {value}
                  <button 
                    onClick={() => toggleFilter(key, value)}
                    className="ml-1 p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
        
      </div>
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {sortedTransactions.length} transactions
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('developerName')}
              >
                <div className="flex items-center">
                  Developer Name
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('dealType')}
              >
                <div className="flex items-center">
                  Deal Type
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('propertyType')}
              >
                <div className="flex items-center">
                  Property Type
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('noOfBr')}
              >
                <div className="flex items-center">
                  No. Of Br
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('projectName')}
              >
                <div className="flex items-center">
                  Project
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('unitNo')}
              >
                <div className="flex items-center">
                  Unit
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('clientName')}
              >
                <div className="flex items-center">
                  Client
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('agentName')}
              >
                <div className="flex items-center">
                  Agent
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('propertyPrice')}
              >
                <div className="flex items-center justify-end">
                  Price
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>

              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('grossCommission')}
              >
                <div className="flex items-center justify-end">
                  Gross Commission
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              

              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('grossCommissionInclVAT')}
              >
                <div className="flex items-center justify-end">
                  Gross Commission Incl. VAT
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>

              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('vat')}
              >
                <div className="flex items-center justify-end">
                  VAT
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>

              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('agentCommission')}
              >
                <div className="flex items-center justify-end">
                  Agent Commission
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>

              <th 
                scope="col" 
                className="cursor-pointer px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => requestSort('leadSource')}
              >
                <div className="flex items-center justify-end">
                  Lead Source
                  <ArrowUpDown className="ml-1 w-4 h-4" />
                </div>
              </th>

            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.developerName || "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.dealType || "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.propertyType || "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.noOfBr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.projectName || "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.unitNo || "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.clientName || "Unavailable"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.agentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 text-right">
                    {transaction.propertyPrice.toLocaleString('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 text-right">
                    {transaction.grossCommission.toLocaleString('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 text-right">
                    {transaction.grossCommissionInclVAT.toLocaleString('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 text-right">
                    {transaction.vat.toLocaleString('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 text-right">
                    {transaction.agentCommission.toLocaleString('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.leadSource}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-10 text-center whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  No transactions found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;