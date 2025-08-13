import { useState, useEffect } from 'react';
import { generateThreatData } from '../utils/dataGenerator';
import { Threat } from '../types/threat';

const useThreatData = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [stats, setStats] = useState({
    totalThreats: 0,
    highSeverity: 0,
    activeConnections: 0,
    blockedIPs: 0,
  });

  useEffect(() => {
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

  return { threats, stats };
};

export default useThreatData;