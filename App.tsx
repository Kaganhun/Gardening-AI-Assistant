
import React from 'react';
import Chat from './components/Chat';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-screen">
        <header className="w-full p-4 text-center border-b border-green-200 bg-white/50 backdrop-blur-sm sticky top-0">
          <h1 className="text-3xl font-bold text-green-800">Gardening Assistant</h1>
          <p className="text-green-600">Your AI-powered plant expert</p>
        </header>
        <main className="flex-1 w-full overflow-hidden">
          <Chat />
        </main>
      </div>
    </div>
  );
};

export default App;
