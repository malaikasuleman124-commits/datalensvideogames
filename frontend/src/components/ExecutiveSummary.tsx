import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Sparkles, Loader2 } from 'lucide-react';

interface ExecutiveSummaryProps {
  refreshTrigger: number;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ refreshTrigger }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await api.getSummary();
        setSummary(data.summary);
      } catch (error) {
        console.error('Failed to fetch summary', error);
        setSummary('');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl animate-pulse flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
        <span className="text-blue-600 dark:text-blue-400 font-medium">Generating executive summary...</span>
      </div>
    );
  }

  if (!summary || summary.includes("No data available")) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl shadow-sm overflow-hidden relative group transition-all hover:shadow-md">
      <div className="absolute top-[-20px] right-[-20px] p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="h-32 w-32 text-blue-600 dark:text-blue-400" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center text-blue-700 dark:text-blue-300 font-bold mb-3 text-sm tracking-wide uppercase">
          <Sparkles className="h-4 w-4 mr-2" />
          Executive AI Summary
        </div>
        <p className="text-gray-800 dark:text-gray-100 leading-relaxed text-lg font-medium italic">
          "{summary}"
        </p>
      </div>
    </div>
  );
};
