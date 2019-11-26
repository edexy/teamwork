const pool = require('../../db/connection').pool;


exports.getFeed = (req, res, next) => {
    let articles = {};
    let gifs = {};

    pool.connect((err, client, done) => {

        client.query('SELECT id, title, article, user_id as authorId, created_at as createdOn FROM articles ORDER BY id DESC').then((result) => {
            done();
            client
                .query('SELECT id, title, url, user_id as authorId, created_at as createdOn FROM gifs ORDER BY id DESC')
                .then((resp) => {


                    return res.status(200).json({
                        status: 'success',
                        data: Object.assign({}, resp.rows, result.rows)


                    });
                }).catch(err => {
                    return res.status(400).json({ err });
                });
        }).catch(error => {
            return res.status(400).json({ error });
        });



    });
}
