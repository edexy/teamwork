
// db.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
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
        phone VARCHAR(255)  NOT NULL,
        deparment VARCHAR(255)  NOT NULL,
        job_role VARCHAR(255)  NOT NULL,
        gender VARCHAR(255)  NOT NULL,
        user_type INT   NULL,
        created_at VARCHAR(255),
        updated_at VARCHAR(255)
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

pool.on('remove', () => {
    console.log('client removed');
    //process.exit(0);
});

//module.exports = pool;

module.exports = {
    createAllTables,
    pool:pool

};

require('make-runnable');