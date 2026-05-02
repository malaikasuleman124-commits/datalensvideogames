import React from 'react';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isAssistant ? 'justify-start' : 'flex-row-reverse space-x-reverse justify-start'}`}>
      <div className={`p-2 rounded-lg shrink-0 ${isAssistant ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
        {isAssistant ? (
          <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        ) : (
          <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
      </div>
      
      <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
        isAssistant 
          ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700' 
          : 'bg-blue-600 text-white'
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
};
