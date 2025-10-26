
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, ImageFile } from '../types';
import { getChatSession, fileToGenerativePart } from '../services/geminiService';
import Message from './Message';
import UserInput from './UserInput';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef(getChatSession());
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Start with a welcome message
    setMessages([
      {
        id: 'init-message',
        role: 'model',
        text: "Hello! I'm Flora, your gardening assistant. Please upload a photo of a plant, and I'll identify it and provide care instructions. You can also ask me any gardening questions!",
      },
    ]);
  }, []);

  const sendMessage = async (inputText: string, imageFile: ImageFile | null) => {
    if (!inputText && !imageFile) return;
    
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: imageFile?.previewUrl,
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Prepare content for Gemini
    const contents: any[] = [];
    if (inputText) {
      contents.push({ text: inputText });
    }
    if (imageFile) {
        try {
            const imagePart = await fileToGenerativePart(imageFile.file);
            contents.push(imagePart);
        } catch (error) {
            console.error("Error converting file:", error);
            setMessages(prev => [...prev, { id: 'error-file', role: 'model', text: 'Sorry, I had trouble processing that image file.' }]);
            setIsLoading(false);
            return;
        }
    }

    try {
      const stream = await chatSessionRef.current.sendMessageStream({ message: contents });

      let modelResponse = '';
      const modelMessageId = Date.now().toString() + '-model';

      // Add a placeholder for the model's response
      setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { id: 'error-api', role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div ref={chatContainerRef} className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <Message message={{id: 'loading', role: 'model', text: '...'}} isLoading={true} />
        )}
      </div>
      <div className="p-4 border-t border-green-200 bg-gray-50">
        <UserInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Chat;
