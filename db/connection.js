const pg = require('pg');

const connectionString = 'postgres://fvdnvotwgndsms:9184b8f761f1d4d682280dd084198d0c181cf0e1b2b8850957c5068938a43dc5@ec2-174-129-253-169.compute-1.amazonaws.com:5432/dcor00j4blrt0a'

const pool = new Pool({
  connectionString: connectionString,
})

// const config = {
//   user: process.env.DB_USER, //this is the db user credential
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: 5432,
//   max: 10, // max number of clients in the pool
//   idleTimeoutMillis: 30000,
// };

//const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

module.exports = pool;