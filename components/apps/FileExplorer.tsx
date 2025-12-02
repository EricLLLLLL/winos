import React from 'react';
import { AppComponentProps, FileSystemItem } from '../../types';
import { Folder, FileText, Image, Music, Video, HardDrive } from 'lucide-react';

const mockFiles: FileSystemItem[] = [
  { name: 'Documents', type: 'folder', date: '2023-10-24 10:30' },
  { name: 'Downloads', type: 'folder', date: '2023-10-24 11:15' },
  { name: 'Pictures', type: 'folder', date: '2023-10-23 09:20' },
  { name: 'project_notes.txt', type: 'file', size: '2 KB', date: '2023-10-25 14:00' },
  { name: 'resume.pdf', type: 'file', size: '1.2 MB', date: '2023-10-20 16:45' },
  { name: 'vacation.jpg', type: 'file', size: '4.5 MB', date: '2023-09-15 08:30' },
];

const FileExplorer: React.FC<AppComponentProps> = () => {
  return (
    <div className="h-full flex flex-col bg-[#1c1c1c] text-white">
      {/* Toolbar */}
      <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4 bg-[#2c2c2c]">
        <div className="flex gap-2 text-gray-400">
            <button className="hover:text-white">&larr;</button>
            <button className="hover:text-white">&rarr;</button>
            <button className="hover:text-white">&uarr;</button>
        </div>
        <div className="flex-1 bg-[#1c1c1c] rounded px-3 py-1 text-sm border border-white/10 flex items-center gap-2">
            <HardDrive size={14} className="text-gray-400" />
            <span>Home / User</span>
        </div>
        <input placeholder="Search Home" className="bg-[#1c1c1c] rounded px-3 py-1 text-sm border border-white/10 w-48 focus:outline-none" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-white/10 p-2 hidden md:block bg-[#202020]">
            <div className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">Favorites</div>
            <div className="flex flex-col gap-1">
                {['Desktop', 'Downloads', 'Documents', 'Pictures', 'Music', 'Videos'].map(item => (
                    <div key={item} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer text-sm text-gray-300">
                        <Folder size={16} className="text-blue-400" />
                        {item}
                    </div>
                ))}
            </div>
             <div className="text-xs font-semibold text-gray-400 px-2 py-1 mt-4 uppercase tracking-wider">Drives</div>
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer text-sm text-gray-300">
                        <HardDrive size={16} className="text-gray-400" />
                        Local Disk (C:)
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockFiles.map((file, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-3 rounded hover:bg-white/10 cursor-pointer group transition-colors">
                        {file.type === 'folder' ? (
                            <Folder size={48} className="text-yellow-500 fill-yellow-500/20" />
                        ) : file.name.endsWith('.jpg') ? (
                             <Image size={48} className="text-purple-400" />
                        ) : (
                            <FileText size={48} className="text-gray-400" />
                        )}
                        <span className="text-sm text-center truncate w-full px-1">{file.name}</span>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 border-t border-white/10 pt-4">
                 <h3 className="text-sm text-gray-400 mb-2">Recent Files</h3>
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-2 py-2 font-medium">Name</th>
                            <th className="px-2 py-2 font-medium">Date Modified</th>
                            <th className="px-2 py-2 font-medium">Size</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {mockFiles.filter(f => f.type === 'file').map((file, i) => (
                             <tr key={i} className="hover:bg-white/5 border-b border-white/5">
                                <td className="px-2 py-2 flex items-center gap-2">
                                    <FileText size={16} /> {file.name}
                                </td>
                                <td className="px-2 py-2">{file.date}</td>
                                <td className="px-2 py-2">{file.size}</td>
                             </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;