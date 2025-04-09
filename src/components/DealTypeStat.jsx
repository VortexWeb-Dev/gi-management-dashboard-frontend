import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DealTypesChart() {
  // Sample data for the deal types
  const data = [
    { name: 'Offplan', deals: 45 },
    { name: 'Primary', deals: 65 },
    { name: 'Secondary', deals: 30 }
  ];

  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to detect system dark mode preference
  useEffect(() => {
    // Check initial dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    // Set up listener for changes
    const darkModeListener = (e) => {
      setIsDarkMode(e.matches);
    };

    darkModeQuery.addEventListener('change', darkModeListener);
    
    // Clean up
    return () => {
      darkModeQuery.removeEventListener('change', darkModeListener);
    };
  }, []);

  // Colors based on theme
  const colors = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    chartColors: {
      offplan: isDarkMode ? '#8884d8' : '#6366f1',
      primary: isDarkMode ? '#82ca9d' : '#10b981',
      secondary: isDarkMode ? '#ffc658' : '#f59e0b'
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${colors.background} ${colors.text} border ${colors.border} transition-colors duration-300 mb-8`}>
      <h2 className="text-2xl font-bold mb-4">Deal Types Distribution</h2>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#ccc'} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: isDarkMode ? '#fff' : '#333' }}
            />
            <YAxis 
              tick={{ fill: isDarkMode ? '#fff' : '#333' }}
              label={{ 
                value: 'Number of Deals', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: isDarkMode ? '#fff' : '#333' } 
              }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#374151' : '#fff',
                border: isDarkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
                color: isDarkMode ? '#fff' : '#000'
              }} 
            />
            <Legend 
              wrapperStyle={{ 
                color: isDarkMode ? '#fff' : '#333' 
              }} 
            />
            <Bar 
              dataKey="deals" 
              name="Number of Deals" 
              fill={isDarkMode ? '#8884d8' : '#6366f1'} 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.map((item) => (
          <div
            key={item.name}
            className={`p-4 rounded-lg ${colors.border} border flex flex-col items-center justify-center`}
          >
            <div className="text-lg font-medium">{item.name}</div>
            <div className="text-3xl font-bold mt-2">{item.deals}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">deals</div>
          </div>
        ))}
      </div>
    </div>
  );
}