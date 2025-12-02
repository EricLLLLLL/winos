import React from 'react';
import { Search, Power, Settings, User } from 'lucide-react';
import { AppDefinition } from '../types';

interface StartMenuProps {
  isOpen: boolean;
  apps: AppDefinition[];
  onOpenApp: (app: AppDefinition) => void;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, onOpenApp, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[600px] h-[650px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden z-[9999] transition-all duration-200 origin-bottom"
        onClick={(e) => e.stopPropagation()}
    >
        {/* Search */}
        <div className="p-6 pb-2">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search for apps, settings, and documents" 
                    className="w-full bg-[#1f2937] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    autoFocus
                />
            </div>
        </div>

        {/* Pinned Section */}
        <div className="px-8 py-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">Pinned</span>
                <button className="bg-white/5 px-2 py-0.5 rounded text-xs text-white hover:bg-white/10 transition">All apps &gt;</button>
            </div>
            
            <div className="grid grid-cols-6 gap-4">
                {apps.map((app) => (
                    <button 
                        key={app.id}
                        onClick={() => { onOpenApp(app); onClose(); }}
                        className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/5 transition group"
                    >
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
                           <div className="text-white scale-125">{app.icon}</div>
                        </div>
                        <span className="text-xs text-center text-gray-200 truncate w-full">{app.name}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 mb-4">
                 <span className="text-sm font-semibold text-white">Recommended</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition cursor-pointer">
                    <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center text-blue-400 font-bold text-xs">DOC</div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">Project_Proposal.docx</span>
                        <span className="text-[10px] text-gray-400">10 min ago</span>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition cursor-pointer">
                    <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center text-purple-400 font-bold text-xs">IMG</div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">mockup_v2.png</span>
                        <span className="text-[10px] text-gray-400">2h ago</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="h-16 bg-black/20 border-t border-white/5 flex items-center justify-between px-12 mt-auto">
            <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded cursor-pointer transition">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                </div>
                <span className="text-xs font-medium text-white">Winnux User</span>
            </div>
            <button className="p-2 hover:bg-white/10 rounded transition text-white">
                <Power size={18} />
            </button>
        </div>
    </div>
  );
};

export default StartMenu;