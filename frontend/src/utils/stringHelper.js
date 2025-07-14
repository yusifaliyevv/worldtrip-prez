export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncate = (string, maxLength) => {
  if (string.length <= maxLength) return string;
  return string.slice(0, maxLength) + '...';
};
