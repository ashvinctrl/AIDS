import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend, trendUp }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:bg-white/5 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-700/30 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm ${trendUp ? 'text-green-400' : 'text-red-400'} flex items-center`}>
          {trend}
          <svg
            className={`w-4 h-4 ml-1 ${trendUp ? 'text-green-400' : 'text-red-400'}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d={trendUp ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </span>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
};

export default StatCard;