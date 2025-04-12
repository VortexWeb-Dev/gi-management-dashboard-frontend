import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Search } from 'lucide-react';

export default function DeveloperPropertyPriceChart({apiData}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Simulating fetch – replace with real API call
    // const apiData = ;

    const total = apiData.reduce((sum, d) => sum + d.property_price, 0);
    setTotalPrice(total);

    const processed = apiData.map(d => ({
      name: d.developer,
      value: d.property_price,
      percentage: d.percentage
    }));

    setChartData(processed);

    const filtered = searchTerm
      ? processed.filter(d =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : processed;

    setFilteredData(filtered);
  }, [searchTerm]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
          <p className="text-gray-600 dark:text-gray-300">
            AED {new Intl.NumberFormat().format(item.value)}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            {item.payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Developer Property Price Distribution
      </h2>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search developer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Chart and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total price card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm px-6 w-full max-w-md mx-auto py-16">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              Total Property Price
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">{new Date().getFullYear()}</div>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {new Intl.NumberFormat().format(totalPrice)}
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Developer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Property Price (AED)</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((developer, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{developer.name}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  {new Intl.NumberFormat().format(developer.value)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  <div className="flex items-center">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {developer.percentage}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
