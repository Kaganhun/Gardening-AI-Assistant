
import React from 'react';
import type { ChatMessage } from '../types';
import { UserIcon, PlantIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

// A simple component to render markdown-like text
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none text-gray-800">
      {content.split('\n').map((paragraph, index) => {
        if (paragraph.trim() === '') return null;

        // Basic markdown handling
        let element = <p key={index}>{paragraph}</p>;
        if (paragraph.startsWith('### ')) {
          element = <h3 key={index} className="font-bold text-base mt-3 mb-1">{paragraph.replace('### ', '')}</h3>;
        } else if (paragraph.startsWith('- ')) {
          element = <li key={index} className="ml-4 list-disc">{paragraph.replace('- ', '')}</li>;
        } else if (/\*\*(.*?)\*\*/.test(paragraph)) {
             const parts = paragraph.split(/\*\*(.*?)\*\*/g);
             element = <p key={index}>{parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}</p>;
        }

        return element;
      })}
    </div>
  );
};


const Message: React.FC<MessageProps> = ({ message, isLoading = false }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-3 ${isModel ? '' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
          <PlantIcon className="w-5 h-5" />
        </div>
      )}

      <div className={`max-w-xl w-full px-4 py-3 rounded-2xl ${isModel ? 'bg-green-100 text-green-900 rounded-tl-none' : 'bg-blue-500 text-white rounded-br-none'}`}>
        {message.image && (
          <img src={message.image} alt="User upload" className="rounded-lg mb-2 max-h-64" />
        )}
        {isLoading ? (
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        ) : (
          <MarkdownContent content={message.text} />
        )}
      </div>

      {!isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default Message;
