import React, { useState, useEffect } from 'react';
import { AppDefinition, WindowInstance } from '../types';
import { LayoutGrid, Wifi, Volume2, Battery, ChevronUp } from 'lucide-react';

interface TaskbarProps {
  apps: AppDefinition[];
  openWindows: WindowInstance[];
  activeWindowId: string | null;
  onToggleStart: () => void;
  onAppClick: (app: AppDefinition) => void;
  onWindowClick: (windowId: string) => void;
  isStartOpen: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  openWindows,
  activeWindowId,
  onToggleStart,
  onAppClick,
  onWindowClick,
  isStartOpen
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter apps to show on taskbar (pinned + open)
  // For simplicity, we show all "apps" as pinned, and indicators for open ones
  
  return (
    <div className="h-12 w-full bg-slate-900/80 backdrop-blur-xl border-t border-white/10 absolute bottom-0 z-[10000] flex items-center justify-between px-2 select-none">
      
      {/* Invisible spacer to center the apps */}
      <div className="flex-1"></div>

      {/* Center Icons */}
      <div className="flex items-center gap-1 h-full">
        {/* Start Button */}
        <button 
            onClick={onToggleStart}
            className={`p-2 rounded hover:bg-white/10 transition duration-200 relative group flex items-center justify-center ${isStartOpen ? 'bg-white/10' : ''}`}
        >
            <LayoutGrid size={24} className="text-blue-400 fill-blue-400/20" />
        </button>

        {apps.map(app => {
            const isOpen = openWindows.some(w => w.appType === app.id);
            const isActive = openWindows.find(w => w.id === activeWindowId)?.appType === app.id;
            
            return (
                <button
                    key={app.id}
                    onClick={() => {
                        const win = openWindows.find(w => w.appType === app.id && !w.isMinimized);
                        if (win && win.id === activeWindowId) {
                           // Minimize logic could go here if we passed a minimize handler
                           // For now, if active, do nothing or maybe minimize
                        } else if (win) {
                            onWindowClick(win.id);
                        } else {
                            onAppClick(app);
                        }
                    }}
                    className={`p-2 w-10 h-10 rounded hover:bg-white/10 transition duration-200 relative flex items-center justify-center group ${isActive ? 'bg-white/5' : ''}`}
                >
                    <div className="text-gray-200 group-hover:-translate-y-1 transition-transform duration-200">
                        {app.icon}
                    </div>
                    {/* Running indicator line */}
                    {isOpen && (
                        <div className={`absolute bottom-0.5 h-1 rounded-full transition-all duration-300 ${isActive ? 'w-4 bg-blue-400' : 'w-1 bg-gray-400'}`}></div>
                    )}
                </button>
            )
        })}
      </div>

      {/* System Tray */}
      <div className="flex-1 flex justify-end items-center gap-2 h-full">
        <div className="flex items-center gap-1 hover:bg-white/5 p-1 rounded transition cursor-default">
            <ChevronUp size={16} className="text-gray-300" />
        </div>
        
        <div className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 rounded transition cursor-default">
             <Wifi size={16} className="text-gray-300" />
             <Volume2 size={16} className="text-gray-300" />
             <Battery size={16} className="text-gray-300" />
        </div>

        <div className="flex flex-col items-end justify-center px-2 py-0.5 hover:bg-white/5 rounded transition cursor-default text-right min-w-[80px]">
            <span className="text-xs text-white font-medium leading-none">
                {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
            <span className="text-[10px] text-gray-300 leading-none mt-0.5">
                {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
        </div>
        
        {/* Show Desktop Nook */}
        <div className="w-1.5 h-full border-l border-gray-600/50 hover:bg-white/10 cursor-pointer ml-1"></div>
      </div>
    </div>
  );
};

export default Taskbar;