export const awaitable = (fn: (resolve: (val: unknown) => void) => void) => {
  return new Promise((resolve) => {
    fn(resolve);
  });
};
