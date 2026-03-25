export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const getDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return getDateKey(date1) === getDateKey(date2);
};
