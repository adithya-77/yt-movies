export const validateImdbId = (imdbId: string): boolean => {
  const imdbIdRegex = /^tt\d{7,8}$/;
  return imdbIdRegex.test(imdbId.trim());
};

export const validateYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
  return youtubeRegex.test(url.trim());
};

export const validateMovieName = (name: string): boolean => {
  return name.trim().length >= 1 && name.trim().length <= 200;
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

export const formatImdbId = (imdbId: string): string => {
  const cleaned = imdbId.trim().toLowerCase();
  if (cleaned.startsWith('tt')) {
    return cleaned;
  }
  return `tt${cleaned}`;
};
