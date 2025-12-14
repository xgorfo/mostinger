import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM dd, yyyy');
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};