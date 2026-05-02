import React from 'react';
import { UploadForm } from './components/UploadForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-blue-600 dark:text-blue-400">DataLens</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Video Game Sales Dashboard</p>
      </div>
      
      <UploadForm />
    </div>
  );
}

export default App;
