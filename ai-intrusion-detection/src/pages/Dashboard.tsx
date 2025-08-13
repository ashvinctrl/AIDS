import React from 'react';
import StatCard from '../components/StatCard';
import ThreatChart from '../components/ThreatChart';
import ThreatTable from '../components/ThreatTable';
import useThreatData from '../hooks/useThreatData';

const Dashboard: React.FC = () => {
  const { stats, threats } = useThreatData();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
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
      <ThreatChart />

      {/* Recent Threats */}
      <ThreatTable threats={threats} />
    </div>
  );
};

export default Dashboard;