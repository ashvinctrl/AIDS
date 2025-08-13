import { Threat } from '../types/threat';

export const generateThreatData = (): Threat => {
  return {
    timestamp: new Date().toISOString(),
    threatLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    sourceIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    type: ['SQL Injection', 'XSS Attack', 'DDoS', 'Brute Force', 'Malware'][Math.floor(Math.random() * 5)],
  };
};

export const generateChartData = (hours: number = 24): Array<{ time: string; threats: number }> => {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${i}:00`,
    threats: Math.floor(Math.random() * 100),
  }));
};