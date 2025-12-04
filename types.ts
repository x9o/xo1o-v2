export interface GameStats {
  visits: string;
  activePlayers: string;
  rating?: string;
}

export interface GameProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  gameLink: string;
  stats: GameStats;
  tags: string[];
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  videoId: string; // YouTube ID
  flipImageUrl?: string; // Optional image for flip effect
}