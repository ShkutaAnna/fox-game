export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandom = (min: number, max: number): number => {
  return Math.random() * (max - min + 1) + min;
};