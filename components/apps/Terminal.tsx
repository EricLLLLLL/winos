import React, { useState, useEffect, useRef } from 'react';
import { AppComponentProps } from '../../types';
import { executeTerminalCommand } from '../../services/geminiService';

interface Log {
  type: 'command' | 'output';
  content: string;
}

const Terminal: React.FC<AppComponentProps> = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<Log[]>([
    { type: 'output', content: 'Welcome to Winnux OS v1.0.0 (GNU/Linux)' },
    { type: 'output', content: 'Type "help" for a list of commands.' }
  ]);
  const [processing, setProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const command = input.trim();
      setInput('');
      setProcessing(true);
      
      setLogs(prev => [...prev, { type: 'command', content: command }]);

      if (command === 'clear') {
        setLogs([]);
        setProcessing(false);
        return;
      }

      // Collect history for context
      const history = logs.filter(l => l.type === 'command').map(l => l.content).slice(-5);
      
      const output = await executeTerminalCommand(command, history);
      setLogs(prev => [...prev, { type: 'output', content: output }]);
      setProcessing(false);
    }
  };

  return (
    <div 
        className="h-full bg-black/90 text-green-400 p-4 font-mono text-sm flex flex-col"
        onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        {logs.map((log, i) => (
            <div key={i} className={`mb-1 ${log.type === 'command' ? 'text-white font-bold' : 'text-green-300 whitespace-pre-wrap'}`}>
                {log.type === 'command' ? (
                    <span className="flex">
                        <span className="text-blue-400 mr-2">winnux@user:~$</span>
                        {log.content}
                    </span>
                ) : (
                    log.content
                )}
            </div>
        ))}
        {processing && <div className="animate-pulse">_</div>}
      </div>
      <div className="flex items-center mt-2">
        <span className="text-blue-400 mr-2">winnux@user:~$</span>
        <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
            autoFocus
            disabled={processing}
        />
      </div>
    </div>
  );
};

export default Terminal;