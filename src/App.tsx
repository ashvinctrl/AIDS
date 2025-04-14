import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Server, Globe, Lock, AlertCircle, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulated threat data
const generateThreatData = () => {
  return {
    timestamp: new Date().toISOString(),
    threatLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    sourceIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    type: ['SQL Injection', 'XSS Attack', 'DDoS', 'Brute Force', 'Malware'][Math.floor(Math.random() * 5)],
  };
};

const generateChartData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    threats: Math.floor(Math.random() * 100),
  }));
};

function App() {
  const [threats, setThreats] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalThreats: 0,
    highSeverity: 0,
    activeConnections: 0,
    blockedIPs: 0,
  });
  const [chartData] = useState(generateChartData());

  useEffect(() => {
    // Simulate real-time threats
    const interval = setInterval(() => {
      const newThreat = generateThreatData();
      setThreats(prev => [newThreat, ...prev].slice(0, 10));
      setStats(prev => ({
        totalThreats: prev.totalThreats + 1,
        highSeverity: prev.highSeverity + (newThreat.threatLevel === 'high' ? 1 : 0),
        activeConnections: Math.floor(Math.random() * 1000),
        blockedIPs: Math.floor(Math.random() * 50),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
            title="Total Threats"
            value={stats.totalThreats}
            trend="+12% from last hour"
            trendUp={true}
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-yellow-400" />}
            title="High Severity"
            value={stats.highSeverity}
            trend="+5% from last hour"
            trendUp={true}
          />
          <StatCard
            icon={<Server className="w-6 h-6 text-green-400" />}
            title="Active Connections"
            value={stats.activeConnections}
            trend="-3% from last hour"
            trendUp={false}
          />
          <StatCard
            icon={<Lock className="w-6 h-6 text-purple-400" />}
            title="Blocked IPs"
            value={stats.blockedIPs}
            trend="+8% from last hour"
            trendUp={true}
          />
        </div>

        {/* Threat Activity Chart */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Threat Activity (24h)</h2>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors">
                24h
              </button>
              <button className="px-3 py-1 rounded-full bg-gray-700/30 text-gray-400 text-sm hover:bg-gray-700/50 transition-colors">
                7d
              </button>
              <button className="px-3 py-1 rounded-full bg-gray-700/30 text-gray-400 text-sm hover:bg-gray-700/50 transition-colors">
                30d
              </button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(107,114,128,0.3)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#60A5FA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Threats */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Recent Threats</h2>
            </div>
            <button className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors">
              View All
            </button>
          </div>
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
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, trend, trendUp }: { 
  icon: React.ReactNode; 
  title: string; 
  value: number;
  trend: string;
  trendUp: boolean;
}) {
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
}

export default App;