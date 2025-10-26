
import React, { useState, useRef } from 'react';
import type { ImageFile } from '../types';
import { PaperclipIcon, SendIcon, XIcon } from './Icons';

interface UserInputProps {
  onSend: (text: string, image: ImageFile | null) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (isLoading || (!text.trim() && !imageFile)) return;
    onSend(text.trim(), imageFile);
    setText('');
    setImageFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        alert("File is too large. Please select an image under 4MB.");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImageFile({ file, previewUrl });
    }
  };

  const removeImage = () => {
    if (imageFile) {
        URL.revokeObjectURL(imageFile.previewUrl);
    }
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-2 border-green-200 rounded-xl p-2 flex flex-col gap-2 focus-within:ring-2 focus-within:ring-green-400 transition-shadow duration-200">
      {imageFile && (
        <div className="relative w-24 h-24 p-1">
          <img src={imageFile.previewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
          <button onClick={removeImage} className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors"
          aria-label="Attach image"
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your plant or upload a photo..."
          className="flex-1 bg-transparent focus:outline-none resize-none max-h-24 text-gray-800 placeholder-gray-500"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || (!text.trim() && !imageFile)}
          className="p-2 rounded-full text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default UserInput;
