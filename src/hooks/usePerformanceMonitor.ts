import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  componentCount: number;
  networkLatency: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    componentCount: 0,
    networkLatency: 0,
  });

  useEffect(() => {
    const measurePerformance = () => {
      // Memory usage (if available)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? 
        Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100) : 0;

      // Render time
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const renderTime = navigationTiming ? 
        navigationTiming.loadEventEnd - navigationTiming.fetchStart : 0;

      // Component count (approximate)
      const componentCount = document.querySelectorAll('[data-reactroot] *').length;

      setMetrics(prev => ({
        ...prev,
        memoryUsage,
        renderTime,
        componentCount,
      }));
    };

    // Measure network latency
    const measureLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/health', { method: 'HEAD' });
        const latency = performance.now() - start;
        setMetrics(prev => ({ ...prev, networkLatency: latency }));
      } catch {
        // Handle error silently
      }
    };

    measurePerformance();
    measureLatency();

    const interval = setInterval(() => {
      measurePerformance();
      measureLatency();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return metrics;
};