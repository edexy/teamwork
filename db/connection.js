const pg = require('pg');

const config = {
  user: process.env.DB_USER, //this is the db user credential
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

module.exports = pool;