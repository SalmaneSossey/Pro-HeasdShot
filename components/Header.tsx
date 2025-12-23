import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Camera className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ProHeadshot AI
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
          <span>Gemini 2.5 Flash Image</span>
        </div>
      </div>
    </header>
  );
};