
// db.js
const { Pool } = require('pg');

let connectionString = '';

if(process.env.NODE_ENV === 'test'){
    connectionString =  `postgresql://${process.env.DB_USERDB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
}else{
    connectionString = process.env.DATABASE_URL;
}
const pool = new Pool({
    
    connectionString: connectionString
});

pool.on('connect', () => {
    console.log('connected to the db');
});


/**
 * Create User Table
 */
const createUserTable = () => {
    const queryText =
        `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255)  NOT NULL,
        last_name  VARCHAR(255)  NOT NULL,
        email VARCHAR(255)  NOT NULL,
        password VARCHAR(255) NOT NULL,
        department VARCHAR(255)   NULL,
        job_role VARCHAR(255)   NULL,
        gender VARCHAR(255)   NULL,
        address VARCHAR(255)   NULL,
        user_type INT   DEFAULT 2,
        created_at VARCHAR(255) NOT NULL
      )`;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
            //pool.end();
        })
        .catch((err) => {
            console.log(err);
            //pool.end();
        });
}

/**
 * Create A Table
 */
const createGifTable = () => {
    const queryText =
        `CREATE TABLE IF NOT EXISTS
        gifs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255)  NOT NULL,
          url VARCHAR(255)  NOT NULL,
          public_id VARCHAR(255)  NOT NULL,
          user_id VARCHAR(255)  NOT NULL,
          created_at VARCHAR(255)  NOT NULL,
          updated_at VARCHAR(255)   NULL
        )`;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
         //   pool.end();
        })
        .catch((err) => {
            console.log(err);
          //  pool.end();
        });
}

/**
* Create A Table
*/
const createArticleTable = () => {
    const queryText =
        `CREATE TABLE IF NOT EXISTS
        articles(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255)  NOT NULL,
          article VARCHAR(255)  NOT NULL,
          public_id VARCHAR(255)  NOT NULL,
          user_id VARCHAR(255)  NOT NULL,
          created_at VARCHAR(255)  NOT NULL,
          updated_at VARCHAR(255)   NULL
        )`;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
           // pool.end();
        })
        .catch((err) => {
            console.log(err);
           // pool.end();
        });
}

/**
* Create A Table
*/
const createCommentTable = () => {
    const queryText =
        `CREATE TABLE IF NOT EXISTS
        comments(
          id SERIAL PRIMARY KEY,
          article_id INT  DEFAULT NULL,
          gif_id INT  DEFAULT NULL,
          user_id INT  NOT NULL,
          comment TEXT  NOT NULL,
          created_at VARCHAR(255)  NOT NULL
        )`;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
            //pool.end();
        })
        .catch((err) => {
            console.log(err);
           // pool.end();
        });
}


/**
 * Create All Tables
 */
const createAllTables = () => {
    createUserTable();
    createGifTable();
    createArticleTable();
    createCommentTable();
}

// pool.on('remove', () => {
//     console.log('client removed');
//     //process.exit(0);
// });

//module.exports = pool;

module.exports = {
    createAllTables,
    pool:pool

};

require('make-runnable');