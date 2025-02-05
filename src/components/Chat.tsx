import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Chat() {
  const [input, setInput] = useState('');
  const { chatHistory, addChatMessage } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addChatMessage('user', input);
    
    // TODO: Integrate with your LLM API here
    // For now, we'll just echo the message
    setTimeout(() => {
      addChatMessage('assistant', `Echo: ${input}`);
    }, 1000);

    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`p-2 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white ml-12' 
                : 'bg-gray-100 mr-12'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about D&D..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}