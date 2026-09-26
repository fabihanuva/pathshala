// Format a price in Bangladeshi Taka. 0 or falsy renders as "Free".
export const formatPrice = (price) => {
  if (!price || price <= 0) return 'Free';
  return `৳${Number(price).toLocaleString('en-IN')}`;
};

// Category -> visual theme used for generated thumbnails when no image URL is set.
// Keeps every card visually distinct without depending on external images.
export const CATEGORY_THEME = {
  Programming: { gradient: 'from-brand-600 to-ink-900', icon: '💻' },
  Design: { gradient: 'from-fuchsia-600 to-indigo-800', icon: '🎨' },
  Marketing: { gradient: 'from-amber-500 to-rose-600', icon: '📣' },
  Business: { gradient: 'from-sky-600 to-blue-900', icon: '📊' },
  Other: { gradient: 'from-slate-600 to-slate-800', icon: '📚' },
};

export const getCategoryTheme = (category) => CATEGORY_THEME[category] || CATEGORY_THEME.Other;

// Level badge colors, mirroring how skill-level badges are styled on course marketplaces
export const LEVEL_THEME = {
  Beginner: 'bg-brand-50 text-brand-700',
  Intermediate: 'bg-sky-50 text-sky-700',
  Advanced: 'bg-violet-50 text-violet-700',
};

export const getLevelTheme = (level) => LEVEL_THEME[level] || LEVEL_THEME.Beginner;
