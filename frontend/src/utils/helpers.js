/**
 * Format a date string into a human-readable format.
 * e.g. "Jan 10, 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Truncate a string to a given length, appending "..." if truncated.
 */
export const truncate = (str, maxLength = 150) => {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

/**
 * Extract a plain-text excerpt from content (first N words).
 */
export const generateExcerpt = (content, wordCount = 30) => {
  if (!content) return '';
  const words = content.split(/\s+/).slice(0, wordCount);
  return words.join(' ') + (content.split(/\s+/).length > wordCount ? '...' : '');
};

/**
 * Parse comma-separated tags string into an array of clean tags.
 */
export const parseTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
};

/**
 * Extract the user-friendly error message from an axios error response.
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.errors?.length) {
    return error.response.data.errors.join(', ');
  }
  return (
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred'
  );
};
