import createClient from '../src';

const client = createClient({
  clientId: process.env.MYOB_CLIENT_ID,
  secret: process.env.MYOB_EXO_SECRET,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  logger: console,
});

client.salesorder.findAll().then(order => {
  console.log(order);
}).catch(e => console.error(e));
