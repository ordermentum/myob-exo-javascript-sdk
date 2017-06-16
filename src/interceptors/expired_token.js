// Referene:- http://developer.myob.com/api/exo/exo-api-overview/authentication/
// http://developer.myob.com/api/exo/endpoints/token/#GET

export default function expiredToken(instance, client, retries = 5) {
  return instance.interceptors.response.use(null, (error) => {
    const config = error.config;

    if (!config) {
      return Promise.reject(error);
    }

    config.expiredTokenRetry = config.expiredTokenRetry || 3;

    const accessDenied = error.data && error.data.Message && error.data.Message === 'Access denied';
    const canTry = (!config.expiredTokenRetry || config.expiredTokenRetry < retries);

    if (error.code !== 'ECONNABORTED' && !accessDenied && error.response.status === 401 && canTry) {
      config.expiredTokenRetry += 1;

/* A call to the token endpoint automatically refreshes the token
used in the call and returns the refreshed token as a string. */

      return client.get('/token').then((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        client.callback(token);

        return instance(config);
      }).catch((e) => {
        client.logger.error('could not refresh token', e);

        throw error;
      });
    }

    throw error;
  });
}
