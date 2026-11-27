export const initials = (name) => {
  const text = String(name || '').trim();
  if (!text) return '?';
  return text
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const pct = (part, whole) => (whole ? Math.round((100 * part) / whole) : 0);

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const formatNumber = (n) => Number(n).toLocaleString('en-IN');

export const cx = (...names) => names.filter(Boolean).join(' ');
