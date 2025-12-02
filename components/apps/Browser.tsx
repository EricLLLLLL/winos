import React, { useState } from 'react';
import { AppComponentProps } from '../../types';
import { Globe, RefreshCw, Search, Lock } from 'lucide-react';
import { generateAssistantResponse } from '../../services/geminiService';

const Browser: React.FC<AppComponentProps> = () => {
  const [url, setUrl] = useState('winnux://assistant');
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const result = await generateAssistantResponse(userMsg);
    
    setHistory(prev => [...prev, { role: 'ai', text: result }]);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      {/* Browser Bar */}
      <div className="h-12 bg-slate-800 flex items-center px-4 gap-3 border-b border-slate-700">
        <div className="flex gap-2 text-gray-400">
            <button className="hover:text-white"><Globe size={16} /></button>
            <button className="hover:text-white"><RefreshCw size={14} /></button>
        </div>
        <div className="flex-1 bg-slate-900 rounded-full h-8 flex items-center px-4 text-sm text-gray-300 border border-slate-700">
            <Lock size={12} className="mr-2 text-green-400" />
            <input 
                value={url} 
                onChange={e => setUrl(e.target.value)}
                className="bg-transparent w-full outline-none"
            />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        {history.length === 0 ? (
            <div className="mt-20 flex flex-col items-center text-center max-w-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                    <Search size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-semibold mb-2">Winnux Copilot</h1>
                <p className="text-gray-400 mb-8">Ask me anything about Linux commands, React code, or general knowledge.</p>
                
                <form onSubmit={handleSearch} className="w-full relative">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="How do I unzip a tar.gz file?" 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                    />
                    <Search className="absolute left-4 top-4 text-gray-500" size={20} />
                </form>
            </div>
        ) : (
            <div className="w-full max-w-3xl flex flex-col gap-6 pb-4">
                {history.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-slate-800 text-gray-100 rounded-bl-sm border border-slate-700'
                        }`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                         <div className="bg-slate-800 rounded-2xl px-5 py-3 border border-slate-700 flex gap-2 items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                    </div>
                )}
                
                {/* Sticky input for continuous chat */}
                <div className="sticky bottom-0 bg-slate-900 pt-4">
                     <form onSubmit={handleSearch} className="w-full relative">
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask follow up..." 
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 pl-12 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-lg"
                        />
                         <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Browser;