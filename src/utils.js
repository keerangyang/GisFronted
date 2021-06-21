export const promisify = (obj) => {
  if (typeof obj.when !== "function" || typeof obj.catch !== "function") {
    throw new TypeError(
      'instance does not have a "when" method, cannot promisify it'
    );
  }

  return new Promise((resolve, reject) => {
    obj.when(resolve).catch(reject);
  });
};
