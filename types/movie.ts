export interface Movie {
  id: string;
  name: string;
  imdb_id: string;
  youtube_url: string;
  genres?: string[];
  imdb_data?: any;
  created_at: string;
}

export interface IMDbMovie {
  id: string;
  primaryTitle: string;
  originalTitle?: string;
  startYear?: number;
  genres?: string[];
  plot?: string;
  primaryImage?: {
    url: string;
  };
  rating?: {
    aggregateRating?: number;
    voteCount?: number;
  };
  runtimeSeconds?: number;
  stars?: any[];
  directors?: any[];
  writers?: any[];
}

export interface CachedMovie extends Movie {
  imdbData?: IMDbMovie;
}

export interface IMDbCredit {
  category: string;
  name: {
    id: string;
    displayName: string;
    primaryImage?: {
      url: string;
    };
  };
  characters?: string[];
}

export interface IMDbCertificate {
  rating: string;
  country: {
    code: string;
    name: string;
  };
}
