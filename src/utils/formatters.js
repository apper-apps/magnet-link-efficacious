import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  return format(new Date(date), formatString);
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm');
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim('-');
};