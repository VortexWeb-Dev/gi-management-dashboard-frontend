import { useState, useEffect } from "react";
import { Search, ChevronDown, Filter, Calendar } from "lucide-react";
import DealTypesChart from "../components/DealTypeStat";
import DeveloperPropertyPriceChart from "../components/PricePercent";
import {developerData as mockData} from './../mockData/mockdata'

export default function DeveloperStatsTable() {
  const [data, setData] = useState({});
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedDeveloper, setSelectedDeveloper] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availableDevelopers, setAvailableDevelopers] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  // Simulate data import from '../mockData/mockdata'
  useEffect(() => {
    
    setData(mockData);
    setFilteredData(mockData[selectedYear]);
    
    // Extract unique developer names
    const developers = [...new Set(Object.values(mockData[selectedYear]).map(month => month.developerName))];
    setAvailableDevelopers(["All", ...developers]);
  }, []);

  // Format currency with commas
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (selectedDeveloper === "All") {
      setFilteredData(data[selectedYear]);
    } else {
      const filtered = {};
      Object.entries(data[selectedYear] || {}).forEach(([month, monthData]) => {
        if (monthData.developerName === selectedDeveloper) {
          filtered[month] = monthData;
        }
      });
      setFilteredData(filtered);
    }
  }, [selectedDeveloper, selectedYear, data]);

  const filteredDevelopers = availableDevelopers.filter(dev => 
    dev.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotals = () => {
    const totals = {
      closedDeals: 0,
      propertyPrice: 0,
      grossCommission: 0,
      netCommission: 0,
      totalPaymentReceived: 0,
      amountReceivable: 0
    };

    Object.values(filteredData || {}).forEach(monthData => {
      totals.closedDeals += monthData.closedDeals;
      totals.propertyPrice += monthData.propertyPrice;
      totals.grossCommission += monthData.grossCommission;
      totals.netCommission += monthData.netCommission;
      totals.totalPaymentReceived += monthData.totalPaymentReceived;
      totals.amountReceivable += monthData.amountReceivable;
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Developer Stats {selectedYear}</h2>
        
        <div className="flex space-x-4">
          {/* Year Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {selectedYear}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                {Object.keys(data).map(year => (
                  <button
                    key={year}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Developer Filter */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              {selectedDeveloper}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search developers..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredDevelopers.map(dev => (
                      <button
                        key={dev}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedDeveloper === dev ? 'bg-blue-100 dark:bg-blue-900' : ''
                        }`}
                        onClick={() => {
                          setSelectedDeveloper(dev);
                          setIsFilterOpen(false);
                          setSearchTerm("");
                        }}
                      >
                        {dev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3">Developer</th>
              <th className="px-6 py-3 text-right">Closed Deals</th>
              <th className="px-6 py-3 text-right">Property Price</th>
              <th className="px-6 py-3 text-right">Gross Commission</th>
              <th className="px-6 py-3 text-right">Net Commission</th>
              <th className="px-6 py-3 text-right">Payment Received</th>
              <th className="px-6 py-3 text-right">Receivable</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredData || {}).map(([month, monthData]) => (
              <tr key={month} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 font-medium">{month}</td>
                <td className="px-6 py-4">{monthData.developerName}</td>
                <td className="px-6 py-4 text-right">{monthData.closedDeals}</td>
                <td className="px-6 py-4 text-right">AED {formatCurrency(monthData.propertyPrice)}</td>
                <td className="px-6 py-4 text-right">AED {formatCurrency(monthData.grossCommission)}</td>
                <td className="px-6 py-4 text-right">AED {formatCurrency(monthData.netCommission)}</td>
                <td className="px-6 py-4 text-right">AED {formatCurrency(monthData.totalPaymentReceived)}</td>
                <td className="px-6 py-4 text-right">AED {formatCurrency(monthData.amountReceivable)}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 dark:bg-gray-800 font-semibold">
              <td className="px-6 py-4" colSpan="2">Total</td>
              <td className="px-6 py-4 text-right">{totals.closedDeals}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.propertyPrice)}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.grossCommission)}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.netCommission)}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.totalPaymentReceived)}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.amountReceivable)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <DealTypesChart/>
      <DeveloperPropertyPriceChart/>
    </div>
  );
}