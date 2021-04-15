const formatDigit = (digit: number): string => `${digit}`.padStart(2, '0');

export const getFilename = (database: string): string => {
  const now = new Date();

  return `${database}_${now.getFullYear()}${formatDigit(now.getUTCMonth())}${formatDigit(
    now.getDate()
  )}${formatDigit(now.getUTCHours())}${formatDigit(
    now.getUTCMinutes()
  )}${formatDigit(now.getUTCSeconds())}`;
};
