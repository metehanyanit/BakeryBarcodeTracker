import React from 'react';
import { FileUpload } from './components/FileUpload';
import { Chat } from './components/Chat';
import { Dashboard } from './components/Dashboard';
import { useStore } from './store/useStore';
import { Loader2, Dice6, Scroll, Swords } from 'lucide-react';

function App() {
  const { isProcessing, data } = useStore();

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=2000')] bg-cover bg-fixed">
      <div className="min-h-screen backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-8">
            {/* Header */}
            <div className="bg-parchment p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Swords className="w-12 h-12 text-red-800" />
                <h1 className="text-4xl font-medieval text-red-900">D&D Data Assistant</h1>
                <Scroll className="w-12 h-12 text-red-800" />
              </div>
              <p className="text-gray-700 font-manuscript text-lg">Upload your chronicles and begin your journey!</p>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-7xl bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8">
              <FileUpload />

              {isProcessing && (
                <div className="flex items-center justify-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 mt-4">
                  <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                  <span className="text-amber-700 font-manuscript">Decoding ancient scrolls...</span>
                </div>
              )}

              {data.length > 0 && (
                <div className="text-center mt-4">
                  <span className="font-manuscript text-lg text-amber-800">
                    {data.length} artifacts discovered and cataloged
                  </span>
                </div>
              )}

              <Dashboard />
              <Chat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;