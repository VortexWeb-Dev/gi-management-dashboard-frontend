import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DealTypesChart({apiData}) {
  

  // Map API data to chart data
  const data = Object.entries(apiData).map(([key, value]) => ({
    name: key === 'Off-Plan' ? 'Offplan' : key,
    deals: value,
  }));

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 transition-colors duration-300 mb-8">
      <h2 className="text-2xl font-bold mb-4">Deal Types Distribution</h2>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" className="dark:stroke-gray-600" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              tick={{ fill: 'currentColor' }}
              label={{
                value: 'Number of Deals',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'currentColor' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                color: '#000',
              }}
              wrapperClassName="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Legend wrapperStyle={{ color: 'currentColor' }} />
            <Bar dataKey="deals" name="Number of Deals" fill="#6366f1" className="dark:fill-indigo-400" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.map((item) => (
          <div
            key={item.name}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center"
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
