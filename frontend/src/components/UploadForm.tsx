import React, { useState, useRef } from 'react';
import { api } from '../lib/api';
import { Upload, FileType, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setStatus('error');
        setMessage('Please select a valid CSV file.');
        return;
      }
      setFile(selectedFile);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    setMessage('');

    try {
      const response = await api.uploadDataset(file);
      
      setStatus('success');
      setMessage(`Success! ${response.data.rows_inserted} rows inserted.`);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.detail || 'An error occurred during upload.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass-container rounded-[2.5rem] transition-all duration-500">
      <div 
        className={cn(
          "border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer group",
          status === 'error' ? "border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10" : "border-gray-100 bg-gray-50/50 hover:border-blue-500 hover:bg-blue-50/50 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/10",
          file && status !== 'error' ? "border-blue-500 bg-blue-50/50 dark:border-blue-500/30 dark:bg-blue-900/20" : ""
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv" 
          className="hidden" 
        />
        
        {file ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-2xl">
              <FileType className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              <Upload className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">Drop your CSV here</p>
            <p className="text-xs text-gray-400">or click to browse files (max 50MB)</p>
          </div>
        )}
      </div>

      {message && (
        <div className={cn(
          "mt-6 p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold uppercase tracking-wider",
          status === 'error' ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
        )}>
          {status === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle className="h-4 w-4 shrink-0" />}
          <span>{message}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || status === 'uploading'}
        className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex justify-center items-center"
      >
        {status === 'uploading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Analyze Dataset'
        )}
      </button>
    </div>
  );
};
