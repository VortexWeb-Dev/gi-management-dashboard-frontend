import { useState, useEffect } from "react";
import { Search, ChevronDown, Filter, Calendar } from "lucide-react";
import DealTypesChart from "../components/DealTypeStat";
import DeveloperPropertyPriceChart from "../components/PricePercent";
import {developerData as mockData} from './../mockData/mockdata'
import fetchData from "../utils/fetchData";

export default function DeveloperStatsTable() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() );
  const [selectedDeveloper, setSelectedDeveloper] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availableDevelopers, setAvailableDevelopers] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [totalData, setTotalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    fetchData("https://ec2-gicrm.ae/management-dashboard-backend/?endpoint=dashboard", {}, setLoading, setError)
      .then((apiData) => {
        if (apiData && apiData.developer_stats) {
          setTotalData(apiData)
          setData(apiData.developer_stats)
          console.log(apiData.developer_stats)
          
          // Extract unique developer names
          const developers = [...new Set(apiData.developer_stats.map(item => item.developer))];
          setAvailableDevelopers(["All", ...developers]);  
        }

       
      });
  }, []);

  // Format currency with commas
  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Filter data based on selected developer
  // useEffect(() => {
  //   if (selectedDeveloper === "All") {
  //     setFilteredData(data);
  //     console.log(data);
      
  //   } else {
  //     const filtered = data.filter(item => item.developer === selectedDeveloper);
  //     setFilteredData(filtered);
  //     console.log("data:",data);
  //     console.log("filtered:",JSON.parse(filtered));
      
  //   }
  // }, [selectedDeveloper, data]);
  useEffect(() => {
    // Only run when real data has been fetched
    if (!Array.isArray(data) || data.length === 0) return;
  
    if (selectedDeveloper === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.developer === selectedDeveloper);
      setFilteredData(filtered);
    }
  }, [selectedDeveloper, data]);

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
  
    // Check if filteredData exists and is an array before iterating
    if (Array.isArray(filteredData) && filteredData.length > 0) {
      filteredData.forEach(item => {
        totals.closedDeals += item.closed_deals || 0;
        totals.propertyPrice += item.property_price || 0;
        totals.grossCommission += item.total_commission || 0;
        totals.netCommission += item.agent_commission || 0;
        // These fields don't exist in new data structure, setting to 0
        totals.totalPaymentReceived += 0;
        totals.amountReceivable += 0;
      });
    }
  
    return totals;
  };

  const totals = calculateTotals();

  if (loading || data.length <1 || filteredData.length == 0) {
    
    return (
      <div className="text-4xl text-gray-600 py-8">
        Loading...
      </div>
    );
  }else{
    
    console.log(data);
    console.log(filteredData);

 
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Developer Stats {selectedYear}</h2>
        
        <div className="flex space-x-4">
          {/* Year Selector - Kept for future use but not functional */}
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
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setSelectedYear(new Date().getFullYear());
                    setIsDropdownOpen(false);
                  }}
                >
                  {new Date().getFullYear()}
                </button>
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
              <th className="px-6 py-3 text-right">Net Commission</th>  {/* Agent Commission*/}
              <th className="px-6 py-3 text-right">Payment Received</th> {/* 0 for now*/}
              <th className="px-6 py-3 text-right">Receivable</th> {/* 0 for now */}
            </tr>
          </thead>
          <tbody>
            {filteredData 
            && 
            filteredData.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 font-medium">{item.month}</td>
                <td className="px-6 py-4">{item.developer}</td>
                <td className="px-6 py-4 text-right">{item.closed_deals}</td>
                <td className="px-6 py-4 text-right">AED {formatCurrency(item.property_price.toFixed(2))}</td>
                <td className="px-6 py-4 text-right">AED {formatCurrency(item.total_commission.toFixed(2))}</td>
                <td className="px-6 py-4 text-right">AED {formatCurrency(item.agent_commission.toFixed(2))}</td>
                <td className="px-6 py-4 text-right">AED 0</td>
                <td className="px-6 py-4 text-right">AED 0</td>
              </tr>

            ))
            }
            <tr className="bg-gray-100 dark:bg-gray-800 font-semibold">
            <td className="px-6 py-4" colSpan="2">Total</td>
              <td className="px-6 py-4 text-right">{totals.closedDeals}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.propertyPrice.toFixed(2))}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.grossCommission.toFixed(2))}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.netCommission.toFixed(2))}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.totalPaymentReceived.toFixed(2))}</td>
              <td className="px-6 py-4 text-right">AED {formatCurrency(totals.amountReceivable.toFixed(2))}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <DealTypesChart apiData={totalData.deal_type_distribution}/>
      <DeveloperPropertyPriceChart apiData={totalData.developer_property_price_distribution}/>
    </div>
  
  );
}

}