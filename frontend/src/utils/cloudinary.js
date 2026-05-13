export const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url) return url;
  if (!url.includes('cloudinary.com')) return url;

  // Check if transformation is already applied to avoid double adding
  if (url.includes('upload/q_auto')) return url;

  const uploadIndex = url.indexOf('upload/');
  if (uploadIndex === -1) return url;

  const transformation = `upload/q_auto,f_auto,w_${width}/`;
  return url.replace('upload/', transformation);
};
