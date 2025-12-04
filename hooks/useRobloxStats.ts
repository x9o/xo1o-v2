import { useState, useEffect } from 'react';
import { fetchGameStats, RobloxStats } from '../services/robloxService';

export const useRobloxStats = (gameUrl: string, initialVisits: string, initialActive: string) => {
  const [stats, setStats] = useState({
    visits: initialVisits,
    playing: initialActive,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGameStats(gameUrl);
        
        if (isMounted) {
          if (data) {
            setStats({
              visits: data.visits,
              playing: data.playing,
            });
          }
          setIsLoading(false);
        }
      } catch (error) {
        // Silently fail and keep initial stats on error to prevent crashes
        console.warn("Failed to load stats for", gameUrl, error);
        if (isMounted) setIsLoading(false);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [gameUrl]);

  return { stats, isLoading };
};