import { REGIONS } from '../config/regions';

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');      // Replace multiple - with single -
};

export const getRegionFromSlug = (slug) => {
  if (!slug) return '';
  const match = REGIONS.find(region => slugify(region) === slug);
  // If no exact match in REGIONS, attempt a naive unslugify
  if (match) return match;
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
