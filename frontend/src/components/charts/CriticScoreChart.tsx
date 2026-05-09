import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { api, Filters } from '../../lib/api';
import { Star } from 'lucide-react';

interface CriticScoreChartProps {
  refreshTrigger: number;
  filters: Filters;
}

export const CriticScoreChart: React.FC<CriticScoreChartProps> = ({ refreshTrigger, filters }) => {
  const [data, setData] = useState<{ bin: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const scoresData = await api.getCriticScores(filters);
        setData(scoresData);
      } catch (error) {
        console.error('Failed to fetch critic scores', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger, filters]);

  if (loading || data.length === 0) {
    return (
      <div className="glass-container p-6 rounded-2xl h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-orange-200 dark:bg-orange-900/50"></div>
          <div className="text-gray-400 font-medium">Loading critic scores...</div>
        </div>
      </div>
    );
  }

  // Define premium gradient colors for bars
  const colors = [
    '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
    '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'
  ];

  return (
    <div className="glass-container p-6 rounded-2xl h-[400px] flex flex-col transition-all duration-300 hover:shadow-lg group">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Critic Score Distribution</h2>
          <p className="text-xs text-gray-500 font-medium">Frequency of scores grouped by 10s</p>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="bin" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `${value}`}
              dx={-10}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: '#fff',
                fontWeight: 500
              }}
              itemStyle={{ color: '#f97316' }}
              formatter={(value: number) => [`${value} Games`, 'Count']}
              labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
            />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]}
              barSize={32}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
