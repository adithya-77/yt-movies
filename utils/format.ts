export const formatRating = (rating: number | undefined): string => {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
};

export const formatYear = (year: number | undefined): string => {
  if (!year) return 'N/A';
  return year.toString();
};

export const formatGenres = (genres: Array<{ text: string }> | undefined): string => {
  if (!genres || genres.length === 0) return 'Unknown';
  return genres.map((g) => g.text).join(', ');
};

export const formatDuration = (minutes: number | undefined): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
