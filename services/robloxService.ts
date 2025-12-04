
const PROXY_URL = 'https://corsproxy.io/?';

export interface RobloxStats {
  visits: string;
  playing: string;
  favorites: string;
  rawVisits: number;
  rawPlaying: number;
}

export const formatCount = (count: number): string => {
  if (count >= 1000000000) {
    return (count / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
};

export const fetchGameStats = async (gameUrl: string): Promise<RobloxStats | null> => {
  try {
    const placeIdMatch = gameUrl.match(/\/games\/(\d+)\//);
    if (!placeIdMatch) return null;
    const placeId = placeIdMatch[1];

    // Step 1: Get Universe ID
    const universeResponse = await fetch(
      `${PROXY_URL}https://apis.roblox.com/universes/v1/places/${placeId}/universe`
    );
    
    if (!universeResponse.ok) {
        throw new Error(`Universe fetch failed: ${universeResponse.status}`);
    }
    
    const universeData = await universeResponse.json();
    const universeId = universeData.universeId;

    if (!universeId) return null;

    // Step 2: Get Game Stats
    const statsResponse = await fetch(
      `${PROXY_URL}https://games.roblox.com/v1/games?universeIds=${universeId}`
    );
    
    if (!statsResponse.ok) {
        throw new Error(`Stats fetch failed: ${statsResponse.status}`);
    }

    const statsData = await statsResponse.json();
    const game = statsData.data && statsData.data[0];
    
    if (!game) return null;

    return {
      visits: formatCount(game.visits),
      playing: formatCount(game.playing),
      favorites: formatCount(game.favoritedCount),
      rawVisits: game.visits,
      rawPlaying: game.playing
    };
  } catch (error) {
    console.warn('Failed to fetch Roblox stats:', error);
    return null;
  }
};