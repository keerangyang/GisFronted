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

export const gisServicePath = (path) =>
  `http://${process.env.VUE_APP_GIS_SERVER_IP}:${process.env.VUE_APP_GIS_SERVER_PORT}/arcgis/rest/services/${path}`;
