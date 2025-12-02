import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowInstance } from '../types';

interface WindowProps {
  window: WindowInstance;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  children,
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus(window.id);
    // Only allow dragging from the header
    if ((e.target as HTMLElement).closest('.window-header')) {
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - window.x,
          y: e.clientY - window.y
        });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        onMove(window.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, onMove, window.isMaximized]);

  if (window.isMinimized) return null;

  const baseClasses = "absolute flex flex-col overflow-hidden shadow-2xl transition-all duration-75 border border-white/10";
  const themeClasses = "bg-slate-900/85 backdrop-blur-xl rounded-lg";
  
  const style = window.isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: window.zIndex }
    : { top: window.y, left: window.x, width: window.width, height: window.height, zIndex: window.zIndex };

  return (
    <div
      ref={windowRef}
      className={`${baseClasses} ${themeClasses}`}
      style={style}
      onMouseDown={() => onFocus(window.id)}
    >
      {/* Title Bar */}
      <div 
        className="window-header h-10 bg-white/5 flex items-center justify-between px-3 select-none cursor-default"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
            {icon}
            <span>{window.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
            <Minus size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
            {window.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(window.id); }} className="p-1.5 hover:bg-red-500 rounded-md text-gray-400 hover:text-white transition-colors group">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};

export default Window;