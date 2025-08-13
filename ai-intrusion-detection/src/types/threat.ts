export interface Threat {
  timestamp: string;
  threatLevel: 'high' | 'medium' | 'low';
  sourceIP: string;
  type: string;
}