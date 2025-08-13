import React from 'react';
import { Threat } from '../types/threat';

interface ThreatTableProps {
  threats: Threat[];
}

const ThreatTable: React.FC<ThreatTableProps> = ({ threats }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700/50">
            <th className="pb-3 text-gray-400 font-medium">Timestamp</th>
            <th className="pb-3 text-gray-400 font-medium">Threat Level</th>
            <th className="pb-3 text-gray-400 font-medium">Source IP</th>
            <th className="pb-3 text-gray-400 font-medium">Type</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((threat, index) => (
            <tr key={index} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
              <td className="py-4">{new Date(threat.timestamp).toLocaleTimeString()}</td>
              <td className="py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  threat.threatLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                  threat.threatLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {threat.threatLevel}
                </span>
              </td>
              <td className="py-4 font-mono text-sm">{threat.sourceIP}</td>
              <td className="py-4">{threat.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThreatTable;