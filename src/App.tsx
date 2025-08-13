import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Shield, AlertTriangle, Activity, Server, Globe, Lock, AlertCircle, BarChart3, RefreshCw, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Enhanced threat data generation with realistic patterns
const generateThreatData = () => {
  const threatTypes = [
    'SQL Injection', 'XSS Attack', 'DDoS', 'Brute Force', 'Malware',
    'Port Scan', 'Data Exfiltration', 'Phishing', 'Ransomware', 'APT'
  ];
  
  const severityWeights = { high: 0.15, medium: 0.35, low: 0.5 };
  const rand = Math.random();
  let threatLevel: 'high' | 'medium' | 'low' = 'low';
  
  if (rand < severityWeights.high) threatLevel = 'high';
  else if (rand < severityWeights.high + severityWeights.medium) threatLevel = 'medium';
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    threatLevel,
    sourceIP: generateRealisticIP(),
    destinationIP: generateRealisticIP(),
    type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
    blocked: Math.random() > 0.7,
    bytes: Math.floor(Math.random() * 100000) + 1000,
    packets: Math.floor(Math.random() * 1000) + 10,
  };
};

const generateRealisticIP = () => {
  // Generate more realistic IP patterns
  const privateRanges = [
    () => `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    () => `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    () => `172.${16 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  ];
  
  return Math.random() > 0.3 
    ? privateRanges[Math.floor(Math.random() * privateRanges.length)]()
    : `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const generateChartData = (hours: number = 24) => {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const time = new Date(now.getTime() - (hours - 1 - i) * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate realistic traffic patterns (higher during business hours)
    const baseThreats = hour >= 9 && hour <= 17 ? 40 + Math.random() * 60 : 10 + Math.random() * 30;
    const threats = Math.floor(baseThreats + Math.sin(hour / 24 * Math.PI * 2) * 20);
    
    return {
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      threats,
      blocked: Math.floor(threats * 0.3),
      timestamp: time.getTime(),
    };
  });
};

type Threat = {
  id: string;
  timestamp: string;
  threatLevel: 'high' | 'medium' | 'low';
  sourceIP: string;
  destinationIP: string;
  type: string;
  confidence: number;
  blocked: boolean;
  bytes: number;
  packets: number;
};

type SystemStats = {
  totalThreats: number;
  highSeverity: number;
  activeConnections: number;
  blockedIPs: number;
  systemLoad: number;
  memoryUsage: number;
};

type ChartDataPoint = {
  time: string;
  threats: number;
  blocked: number;
  timestamp: number;
};

// Memoized components for performance
const StatCard = memo(({ icon, title, value, trend, trendUp, loading }: { 
  icon: React.ReactNode; 
  title: string; 
  value: number;
  trend: string;
  trendUp: boolean;
  loading?: boolean;
}) => (
  <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:bg-white/5 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-700/30 rounded-lg">
        {loading ? <RefreshCw className="w-6 h-6 animate-spin text-blue-400" /> : icon}
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
    <p className="text-3xl font-bold">{loading ? '...' : value.toLocaleString()}</p>
  </div>
));

function App() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalThreats: 0,
    highSeverity: 0,
    activeConnections: 0,
    blockedIPs: 0,
    systemLoad: 0,
    memoryUsage: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>(generateChartData());
  const [filter, setFilter] = useState<string>('all');
  const [blockedIPs, setBlockedIPs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(3000);

  // Memoized filtered threats for performance
  const filteredThreats = useMemo(() => {
    return filter === 'all' ? threats : threats.filter(t => t.threatLevel === filter);
  }, [threats, filter]);

  // Optimized threat generation with useCallback
  const generateNewThreat = useCallback(() => {
    const newThreat = generateThreatData();
    
    setThreats(prev => {
      const updated = [newThreat, ...prev].slice(0, 50); // Keep more history
      return updated;
    });
    
    setStats(prev => ({
      totalThreats: prev.totalThreats + 1,
      highSeverity: prev.highSeverity + (newThreat.threatLevel === 'high' ? 1 : 0),
      activeConnections: Math.floor(Math.random() * 1000) + 500,
      blockedIPs: prev.blockedIPs + (newThreat.blocked ? 1 : 0),
      systemLoad: Math.random() * 100,
      memoryUsage: Math.random() * 80 + 20,
    }));

    // Auto-block high severity threats
    if (newThreat.threatLevel === 'high' && Math.random() > 0.3) {
      setBlockedIPs(prev => new Set([...prev, newThreat.sourceIP]));
    }
  }, []);

  // Enhanced real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      generateNewThreat();
      
      // Update chart data periodically
      if (Math.random() > 0.8) {
        setChartData(prev => {
          const newData = [...prev];
          const lastPoint = newData[newData.length - 1];
          const newPoint = {
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            threats: Math.floor(Math.random() * 100),
            blocked: Math.floor(Math.random() * 30),
            timestamp: Date.now(),
          };
          newData.push(newPoint);
          return newData.slice(-24); // Keep last 24 points
        });
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, generateNewThreat]);

  // Optimized block handler
  const handleBlock = useCallback((ip: string) => {
    setBlockedIPs(prev => new Set([...prev, ip]));
    
    // Update threat status
    setThreats(prev => prev.map(threat => 
      threat.sourceIP === ip ? { ...threat, blocked: true } : threat
    ));
  }, []);

  // Bulk actions
  const handleBlockAll = useCallback((threatLevel: 'high' | 'medium' | 'low') => {
    const ipsToBlock = threats
      .filter(t => t.threatLevel === threatLevel && !t.blocked)
      .map(t => t.sourceIP);
    
    setBlockedIPs(prev => new Set([...prev, ...ipsToBlock]));
    setThreats(prev => prev.map(threat => 
      ipsToBlock.includes(threat.sourceIP) ? { ...threat, blocked: true } : threat
    ));
  }, [threats]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setChartData(generateChartData());
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Intrusion Detection System v2.0
                </h1>
                <p className="text-gray-400 text-sm">Advanced ML-powered threat monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* System Status */}
              <div className="flex items-center px-3 py-1 bg-green-500/10 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-green-400 text-sm">System Active</span>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 rounded-lg transition-colors ${
                    autoRefresh ? 'bg-green-500/10 text-green-400' : 'bg-gray-700/30 text-gray-400'
                  }`}
                  title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
                >
                  <Activity className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                
                <button className="p-2 bg-gray-700/30 text-gray-400 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
            title="Total Threats"
            value={stats.totalThreats}
            trend="+12% from last hour"
            trendUp={true}
            loading={isLoading}
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-yellow-400" />}
            title="High Severity"
            value={stats.highSeverity}
            trend="+5% from last hour"
            trendUp={true}
            loading={isLoading}
          />
          <StatCard
            icon={<Server className="w-6 h-6 text-green-400" />}
            title="Active Connections"
            value={stats.activeConnections}
            trend="-3% from last hour"
            trendUp={false}
            loading={isLoading}
          />
          <StatCard
            icon={<Lock className="w-6 h-6 text-purple-400" />}
            title="Blocked IPs"
            value={blockedIPs.size}
            trend="+8% from last hour"
            trendUp={true}
            loading={isLoading}
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
            title="System Load"
            value={Math.round(stats.systemLoad)}
            trend={`${stats.systemLoad > 50 ? '+' : '-'}${Math.abs(stats.systemLoad - 50).toFixed(1)}%`}
            trendUp={stats.systemLoad > 50}
            loading={isLoading}
          />
          <StatCard
            icon={<Globe className="w-6 h-6 text-cyan-400" />}
            title="Memory Usage"
            value={Math.round(stats.memoryUsage)}
            trend={`${stats.memoryUsage > 60 ? '+' : '-'}${Math.abs(stats.memoryUsage - 60).toFixed(1)}%`}
            trendUp={stats.memoryUsage > 60}
            loading={isLoading}
          />
        </div>

        {/* Enhanced Threat Activity Chart */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Threat Activity & Mitigation</h2>
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
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(107,114,128,0.3)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                  }}
                  labelStyle={{ color: '#E5E7EB' }}
                />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  fill="url(#threatsGradient)"
                  name="Threats Detected"
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#blockedGradient)"
                  name="Threats Blocked"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Filter & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium">Filter by severity:</span>
            {['all', 'high', 'medium', 'low'].map((level) => (
              <button
                key={level}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${filter === level 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-700/50 text-blue-300 hover:bg-blue-800/50 hover:text-white'}
                `}
                onClick={() => setFilter(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
                {level !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {threats.filter(t => t.threatLevel === level).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBlockAll('high')}
              className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Block All High
            </button>
            <button
              onClick={() => setThreats([])}
              className="px-4 py-2 bg-gray-600/80 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Clear History
            </button>
          </div>
        </div>

        {/* Enhanced Recent Threats Table */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">
                Recent Threats 
                <span className="ml-2 text-sm text-gray-400">
                  ({filteredThreats.length} of {threats.length})
                </span>
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-sm border border-gray-600"
              >
                <option value={1000}>1s refresh</option>
                <option value={3000}>3s refresh</option>
                <option value={5000}>5s refresh</option>
                <option value={10000}>10s refresh</option>
              </select>
              <button className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors">
                Export CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-xl shadow-lg bg-black/40 backdrop-blur border border-gray-700/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-700/50 bg-gray-800/30">
                  <th className="p-4 font-semibold">Time</th>
                  <th className="p-4 font-semibold">Severity</th>
                  <th className="p-4 font-semibold">Source IP</th>
                  <th className="p-4 font-semibold">Destination</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Confidence</th>
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredThreats.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No threats found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredThreats.slice(0, 20).map((threat) => (
                    <tr key={threat.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="p-4 text-gray-300">
                        {new Date(threat.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center
                            ${threat.threatLevel === 'high'
                              ? 'bg-red-600/20 text-red-300 border border-red-500/30'
                              : threat.threatLevel === 'medium'
                              ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-green-600/20 text-green-300 border border-green-500/30'}
                          `}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            threat.threatLevel === 'high' ? 'bg-red-400' :
                            threat.threatLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`} />
                          {threat.threatLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-blue-300">{threat.sourceIP}</td>
                      <td className="p-4 font-mono text-gray-400">{threat.destinationIP}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-700/50 rounded text-xs">
                          {threat.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                threat.confidence > 0.8 ? 'bg-red-500' :
                                threat.confidence > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${threat.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {Math.round(threat.confidence * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-gray-400">
                        <div>{threat.bytes.toLocaleString()} bytes</div>
                        <div>{threat.packets} packets</div>
                      </td>
                      <td className="p-4">
                        {threat.blocked ? (
                          <span className="px-2 py-1 bg-red-600/20 text-red-300 rounded-full text-xs border border-red-500/30">
                            Blocked
                          </span>
                        ) : blockedIPs.has(threat.sourceIP) ? (
                          <span className="px-2 py-1 bg-red-600/20 text-red-300 rounded-full text-xs border border-red-500/30">
                            IP Blocked
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-full text-xs border border-green-500/30">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {!threat.blocked && !blockedIPs.has(threat.sourceIP) ? (
                          <button
                            className="px-3 py-1 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                            onClick={() => handleBlock(threat.sourceIP)}
                          >
                            Block IP
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredThreats.length > 20 && (
            <div className="mt-4 text-center">
              <button className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                Load More ({filteredThreats.length - 20} remaining)
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Remove the old StatCard function since we moved it up

export default App;