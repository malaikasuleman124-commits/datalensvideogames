import React, { useState } from 'react';
import { UploadForm } from './components/UploadForm';
import { SummaryStats } from './components/SummaryStats';
import { Dashboard } from './components/Dashboard';
import { Filters } from './components/Filters';
import { useDataset } from './hooks/useDataset';
import { ChatPanel } from './components/ChatPanel';

function App() {
  const [refreshStats, setRefreshStats] = useState(0);
  const { filters, setGenre, setPlatform, resetFilters } = useDataset();

  const handleUploadSuccess = () => {
    setRefreshStats((prev) => prev + 1);
    resetFilters();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start pt-12 px-4 transition-colors">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-blue-600 dark:text-blue-400">DataLens</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Video Game Sales Dashboard</p>
      </div>
      
      <div className="w-full flex justify-center">
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </div>

      <Filters 
        filters={filters} 
        onGenreChange={setGenre} 
        onPlatformChange={setPlatform} 
        onReset={resetFilters}
        refreshTrigger={refreshStats}
      />

      <SummaryStats refreshTrigger={refreshStats} filters={filters} />
      <Dashboard refreshTrigger={refreshStats} filters={filters} />
      
      <ChatPanel />
    </div>
  );
}

export default App;
