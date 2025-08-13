import React from 'react';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-black/30 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI Intrusion Detection System
              </h1>
              <p className="text-gray-400 text-sm">Real-time threat monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center px-3 py-1 bg-green-500/10 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              <span className="text-green-400 text-sm">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;