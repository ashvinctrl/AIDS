import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Threat } from '../types/threat';

interface ThreatChartProps {
  data: Threat[];
}

const ThreatChart: React.FC<ThreatChartProps> = ({ data }) => {
  const chartData = data.map(threat => ({
    time: new Date(threat.timestamp).toLocaleTimeString(),
    threats: threat.threatLevel === 'high' ? 1 : threat.threatLevel === 'medium' ? 0.5 : 0.1,
  }));

  return (
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
  );
};

export default ThreatChart;