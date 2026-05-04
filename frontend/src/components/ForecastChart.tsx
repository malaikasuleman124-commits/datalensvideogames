import React, { useEffect, useState } from 'react';
import { api, Filters } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastData {
  year: number;
  sales: number;
  is_predicted: boolean;
}

export const ForecastChart: React.FC<{ refreshTrigger: number, filters: Filters }> = ({ refreshTrigger, filters }) => {
  const [data, setData] = useState<ForecastData[]>([]);

  useEffect(() => {
    api.getForecast(filters).then(setData).catch(console.error);
  }, [refreshTrigger, filters]);

  if (!data.length) return null;

  const historical = data.filter(d => !d.is_predicted);
  const predicted = data.filter(d => d.is_predicted);
  const lastHistorical = historical[historical.length - 1];
  const forecastSeries = lastHistorical ? [lastHistorical, ...predicted] : predicted;

  return (
    <div className="chart-container h-[450px] md:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 flex items-center">
          <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
          Sales Trend Forecast
        </h3>
        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-blue-600 mr-2"></div>
            Historical
          </div>
          <div className="flex items-center">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500 mr-2"></div>
            Predicted
          </div>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
            <XAxis 
              dataKey="year" 
              type="number"
              domain={['dataMin', 'dataMax']}
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => `${val}M`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                padding: '12px'
              }}
              formatter={(value: number, name: string, props: any) => {
                const isPredicted = props.payload.is_predicted;
                return [`${value.toFixed(1)}M`, isPredicted ? 'Predicted Sales' : 'Actual Sales'];
              }}
            />
            <Line 
              data={historical}
              type="monotone" 
              dataKey="sales" 
              stroke="#2563eb" 
              strokeWidth={4} 
              dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              data={forecastSeries}
              type="monotone" 
              dataKey="sales" 
              stroke="#10b981" 
              strokeWidth={4} 
              strokeDasharray="8 8"
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-[10px] text-gray-400 dark:text-gray-500 italic text-center">
        * Forecast calculated using linear regression trend analysis of historical global sales data.
      </p>
    </div>
  );
};
