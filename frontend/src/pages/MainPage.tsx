import React, { useState } from 'react';
import { UploadForm } from '../components/UploadForm';
import { SummaryStats } from '../components/SummaryStats';
import { Dashboard } from '../components/Dashboard';
import { Filters } from '../components/Filters';
import { ChatPanel } from '../components/ChatPanel';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { useDataset } from '../hooks/useDataset';

export const MainPage: React.FC = () => {
  const [refreshStats, setRefreshStats] = useState(0);
  const { filters, setGenre, setPlatform, resetFilters } = useDataset();

  const handleUploadSuccess = () => {
    setRefreshStats((prev) => prev + 1);
    resetFilters();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start pt-16 pb-20 px-4 transition-colors duration-500">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-50"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="text-center mb-12 relative">
        <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          DataLens
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
          Advanced analytics and AI-powered insights for global video game sales.
        </p>
      </header>
      
      <main className="w-full max-w-6xl flex flex-col items-center">
        <section className="w-full flex justify-center mb-10">
          <div className="w-full max-w-xl">
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
        </section>

        <ExecutiveSummary refreshTrigger={refreshStats} />

        <div className="w-full sticky top-4 z-30 mb-6 px-2">
          <Filters 
            filters={filters} 
            onGenreChange={setGenre} 
            onPlatformChange={setPlatform} 
            onReset={resetFilters}
            refreshTrigger={refreshStats}
          />
        </div>

        <section className="w-full space-y-8">
          <SummaryStats refreshTrigger={refreshStats} filters={filters} />
          <Dashboard refreshTrigger={refreshStats} filters={filters} />
        </section>
      </main>
      
      <ChatPanel />
      
      <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-800 w-full text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          © 2026 DataLens Analytics • Built with React & FastAPI
        </p>
      </footer>
    </div>
  );
};
