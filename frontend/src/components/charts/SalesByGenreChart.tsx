import React, { useEffect, useState } from 'react';
import { api, Filters } from '../../lib/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface GenreData {
  name: string;
  sales: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1', '#83a6ed', '#8e4585'];

export const SalesByGenreChart: React.FC<{ refreshTrigger: number, filters: Filters }> = ({ refreshTrigger, filters }) => {
  const [data, setData] = useState<GenreData[]>([]);

  useEffect(() => {
    api.getGenreSales(filters).then(setData).catch(console.error);
  }, [refreshTrigger, filters]);

  if (!data.length) return null;

  return (
    <div className="chart-container h-[450px]">
      <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
        Global Sales by Genre
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={4}
              dataKey="sales"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}M`, 'Sales']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
