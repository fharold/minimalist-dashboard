export const getRandomString = (length = 8, format = 'alphanum') => {
  const result = [];
  let currentLength = length;
  while (currentLength > 0) {
    const seed = Math.random();
    result.push(seed.toString(format === 'num' ? 10 : 36).substring(2, Math.min(currentLength + 2, 12)));
    currentLength -= 10;
  }
  return result.join('');
};
