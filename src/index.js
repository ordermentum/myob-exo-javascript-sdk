import 'babel-polyfill';

import NULL_LOGGER from 'null-logger';
import Client from './client';
import resources from './resources';

function createClient({
  clientId,
  secret,
  token = {},
  logger = NULL_LOGGER,
  username,
  password,
  timeout = 3000,
  apiBase = 'https://exo.api.myob.com/',
 }) {
  const client = new Client({
    clientId,
    username,
    password,
    secret,
    token,
    apiBase,
    timeout,
    logger });

  return {
    client,
    salesorder: resources.salesorder(client),
    stockitem: resources.stockitem(client),
    stock: resource.stock(client),
    token: resources.token(client),
  };
}

export default createClient;
