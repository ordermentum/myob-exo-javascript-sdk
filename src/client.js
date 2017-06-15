import axios from 'axios';
import rateLimit from './interceptors/rate_limit';
import expiredToken from './interceptors/expired_token';

const pack = require('../package');

export default class Client {
  constructor({ clientId,
                secret,
                logger, callback = () => {}, username, password,
                timeout = 5000, apiBase = 'https://exo.api.myob.com/' }) {
    this.apiBase = apiBase;
    this.logger = logger;
    this.callback = callback;
    this.adapter = axios;
    this.username = username;
    this.password = password;
    this.clientId = clientId;

    // FIXME: in case of exo need to find where this secret is being
    // used as we don't authenticate via oauth...

    this.secret = secret;
    this.timeout = timeout;
    this.callback = callback;
    this.instance = this.getInstance(false);
  }

  getInstance() {
    this.logger.info('Request Headers', this.getHeaders(root));

    const instance = this.adapter.create({
      baseURL: this.apiBase,
      timeout: this.timeout,
      responseType: 'json',
      headers: this.getHeaders(),
    });

    rateLimit(instance, 5);
    expiredToken(instance, this, 2);
    return instance;
  }

  getHeaders() {
    // API Docs: http://developer.myob.com/api/exo/exo-api-overview/authentication/
    // Format looks to be:
    // {
      // Authorization: `Bearer ${username:password}`,
      // x-myobapi-key: this.clientId,
      // x-myobapi-exotoken: `${token}`
    // }
    // Confirm whether or not this needs to change
    // the api-exotoken can be found in the e-mail.
    // the api-key is on my.myob.com under Adam's account.
    // Need to specify application/json to avoid XML returns.
    const headers = {
      'x-myobapi-exotoken': this.clientId,
      'x-myobapi-key': this.secret,
      Authorization: `Basic ${this.getUserToken()}`,
      'User-Agent': `Ordermentum MYOB Exo Client ${pack.version}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return headers;
  }

  getUserToken() {
    return new Buffer(`${this.username}:${this.password}`)
                    .toString('base64');
  }

  get(...args) {
    return this.instance.get(...args)
    .then(r => r.data);
  }

  post(...args) {
    return this.instance.post(...args)
    .then(r => r.data);
  }

  patch(...args) {
    return this.instance.patch(...args)
    .then(r => r.data);
  }

  put(...args) {
    return this.instance.put(...args)
    .then(r => r.data);
  }

  delete(...args) {
    return this.instance.delete(...args)
    .then(r => r.data);
  }
}
