import React, { useState } from 'react';
import { Terminal, FolderOpen, Globe, Settings, Calculator, FileCode } from 'lucide-react';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import TerminalApp from './components/apps/Terminal';
import FileExplorer from './components/apps/FileExplorer';
import Browser from './components/apps/Browser';
import { AppDefinition, AppType, WindowInstance } from './types';

// App Registry
const APPS: AppDefinition[] = [
  { 
    id: AppType.TERMINAL, 
    name: 'Terminal', 
    icon: <Terminal size={20} />, 
    component: TerminalApp,
    defaultWidth: 700,
    defaultHeight: 500
  },
  { 
    id: AppType.EXPLORER, 
    name: 'Files', 
    icon: <FolderOpen size={20} className="text-yellow-500 fill-yellow-500/20" />, 
    component: FileExplorer,
    defaultWidth: 800,
    defaultHeight: 600
  },
  { 
    id: AppType.BROWSER, 
    name: 'Edge (AI)', 
    icon: <Globe size={20} className="text-blue-500" />, 
    component: Browser,
    defaultWidth: 900,
    defaultHeight: 700
  },
  { 
    id: AppType.EDITOR, 
    name: 'Code Editor', 
    icon: <FileCode size={20} className="text-cyan-400" />, 
    component: () => <div className="p-4 text-white">Placeholder for Editor</div>,
    defaultWidth: 600,
    defaultHeight: 400
  },
  { 
    id: AppType.SETTINGS, 
    name: 'Settings', 
    icon: <Settings size={20} className="text-gray-400" />, 
    component: () => <div className="p-8 text-white"><h1 className="text-2xl mb-4">Settings</h1><p>Winnux Version 1.0.0</p></div>,
    defaultWidth: 600,
    defaultHeight: 450
  }
];

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);

  const openApp = (app: AppDefinition) => {
    setStartOpen(false);
    
    // Simple logic: allow multiple instances
    const newWindow: WindowInstance = {
      id: Math.random().toString(36).substr(2, 9),
      appType: app.id,
      title: app.name,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      x: 50 + (windows.length * 20),
      y: 50 + (windows.length * 20),
      width: app.defaultWidth,
      height: app.defaultHeight
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null); // Deselect
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    bringToFront(id);
  };

  const bringToFront = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (!win) return prev;
      
      // If already minimized, unminimize
      const wasMinimized = win.isMinimized;
      
      return prev.map(w => w.id === id 
        ? { ...w, zIndex: nextZIndex, isMinimized: false } 
        : w
      );
    });
    setNextZIndex(prev => prev + 1);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  return (
    <div 
        className="relative w-screen h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url(https://picsum.photos/1920/1080?blur=2)' }}
        onClick={() => setStartOpen(false)}
    >
      {/* Desktop Icons Area (Placeholder) */}
      <div className="absolute top-0 left-0 p-4 grid grid-cols-1 gap-4">
        {APPS.slice(0, 3).map(app => (
            <div 
                key={app.id} 
                onDoubleClick={() => openApp(app)}
                className="w-20 h-24 flex flex-col items-center justify-center gap-1 rounded hover:bg-white/10 cursor-pointer group transition-colors"
            >
                <div className="text-white drop-shadow-lg scale-110">{app.icon}</div>
                <span className="text-xs text-white text-center font-medium drop-shadow-md line-clamp-2 leading-tight">{app.name}</span>
            </div>
        ))}
      </div>

      {/* Windows Layer */}
      {windows.map(win => {
        const appDef = APPS.find(a => a.id === win.appType);
        if (!appDef) return null;
        const Component = appDef.component;

        return (
          <Window
            key={win.id}
            window={win}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={bringToFront}
            onMove={moveWindow}
            icon={appDef.icon}
          >
            <Component windowId={win.id} />
          </Window>
        );
      })}

      {/* UI Layer */}
      <StartMenu 
        isOpen={startOpen} 
        apps={APPS} 
        onOpenApp={openApp}
        onClose={() => setStartOpen(false)}
      />

      <Taskbar 
        apps={APPS} 
        openWindows={windows} 
        activeWindowId={activeWindowId} 
        onToggleStart={() => setStartOpen(!startOpen)}
        isStartOpen={startOpen}
        onAppClick={openApp}
        onWindowClick={bringToFront}
      />
    </div>
  );
};

export default App;