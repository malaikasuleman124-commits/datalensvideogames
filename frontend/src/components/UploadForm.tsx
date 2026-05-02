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
    <div className="w-full max-w-md p-6 bg-card text-card-foreground rounded-xl shadow-lg border border-border bg-white dark:bg-gray-800">
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          status === 'error' ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20",
          file && status !== 'error' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
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
          <div className="flex flex-col items-center space-y-2">
            <FileType className="h-10 w-10 text-blue-500" />
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium">Click or drag CSV file here</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Max file size 50MB</p>
          </div>
        )}
      </div>

      {message && (
        <div className={cn(
          "mt-4 p-3 rounded-md flex items-start space-x-2 text-sm",
          status === 'error' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        )}>
          {status === 'error' ? <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> : <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />}
          <span>{message}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || status === 'uploading'}
        className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition-colors"
      >
        {status === 'uploading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Dataset'
        )}
      </button>
    </div>
  );
};
