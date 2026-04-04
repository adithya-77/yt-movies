import { IMDbMovie } from '@/types/movie';

const IMDB_API_BASE = 'https://api.imdbapi.dev/titles';
const cache = new Map<string, IMDbMovie>();

export async function fetchIMDbData(imdbId: string): Promise<IMDbMovie | null> {
  if (cache.has(imdbId)) {
    return cache.get(imdbId)!;
  }

  try {
    const response = await fetch(`${IMDB_API_BASE}/${imdbId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch IMDb data');
    }
    const data = await response.json();
    cache.set(imdbId, data);
    return data;
  } catch (error) {
    console.error('Error fetching IMDb data:', error);
    return null;
  }
}

export function getYouTubeThumbnail(youtubeUrl: string): string {
  const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : '';
}

export async function fetchIMDbCredits(imdbId: string) {
  try {
    const response = await fetch(`${IMDB_API_BASE}/${imdbId}/credits`);
    if (!response.ok) throw new Error('Failed to fetch IMDb credits');
    const data = await response.json();
    return data.credits || [];
  } catch (error) {
    console.error('Error fetching IMDb credits:', error);
    return [];
  }
}

export async function fetchIMDbCertificates(imdbId: string) {
  try {
    const response = await fetch(`${IMDB_API_BASE}/${imdbId}/certificates`);
    if (!response.ok) throw new Error('Failed to fetch certificates');
    const data = await response.json();
    return data.certificates || [];
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
}
