const pool = require('../../db/connection');


exports.createArticle = (req, res, next) => {

    const data = {
        title: req.body.title,
        article: req.body.article,
        user_id: req.body.userId,
        created_at: new Date()
    };

    //save the article details to db 
    pool.connect((err, client, done) => {
        let query = 'INSERT INTO articles (title, article, user_id, created_at) VALUES($1,$2,$3,$4) RETURNING *';
        let values = [data.title, data.article, data.user_id, data.created_at];
        client.query(query, values, (error, result) => {
            done();
            if (error) {
                res.status(400).json({ error });
            } else {
                const resp = {
                    message: 'Article successfully posted',
                    articleID: parseInt(result.rows[0].id),
                    title: result.rows[0].title,
                    createdOn: result.rows[0].created_at,
                    userId: result.rows[0].user_id

                };

                return res.status(201).json({
                    status: 'success',
                    data: resp,


                });
            }

        });
    });




}

exports.updateArticle = (req, res, next) => {
    let _id = req.params._id;

    const data = {
        title: req.body.title,
        article: req.body.article,
        user_id: req.body.userId,
        updated_at: new Date()
    };

    //save the article details to db 
    pool.connect((err, client, done) => {
        let query = 'UPDATE articles SET title = $1, article = $2, updated_at = $3  WHERE id = $4 RETURNING *';
        let values = [data.title, data.article, data.updated_at, _id];
        client.query(query, values, (error, result) => {
            done();
            if (error) {
                res.status(400).json({ error });
            } else {
                const resp = {
                    message: 'Article updated successfully',
                    articleID: parseInt(result.rows[0].id),
                    title: result.rows[0].title,
                    updatedOn: result.rows[0].updated_at,
                    userId: result.rows[0].user_id

                };

                return res.status(201).json({
                    status: 'success',
                    data: resp,


                });
            }

        });
    });




}


exports.deleteArticle = (req, res, next) => {

    let _id = req.params._id;

    //check database for the
    pool.connect((err, client, done) => {
        client.query('DELETE FROM articles WHERE id = $1 RETURNING *', [_id], (error, result) => {
            done();
            if (result.rowCount < 1) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Article Not Found'
                });
            }

            if (error) {
                return res.status(400).json({ error });
            }

            return res.status(400).json({
                status: 'success',
                message: 'Article Deleted Successfully'
            });

        });
    });



    // bcrypt.hash(req.body.password, 10).then(
    //     (hash) => {
    //         const data = {
    //             firstname: req.body.firstName,
    //             lastname: req.body.lastName,
    //             email: req.body.email,
    //             password: hash,
    //             gender: req.body.gender,
    //             jobrole: req.body.jobRole,
    //             department: req.body.department,
    //             address: req.body.address,
    //             created_at: new Date()


    //         };


    //     }
    // )
}

exports.createComment = (req, res, next) => {

    const data = {
        comment: req.body.comment,
        article_id: req.params._id,
        user_id: req.body.userId,
        created_at: new Date()
    };


    //save the article details to db 
    pool.connect((err, client, done) => {
        let query = 'INSERT INTO comments (comment, article_id, user_id, created_at) VALUES($1,$2,$3,$4) RETURNING *';
        let values = [data.comment, data.article_id, data.user_id, data.created_at];
        client.query(query, values).then((result) => {
            done();
            client
                .query('SELECT * FROM articles WHERE id=$1', [result.rows[0].article_id])
                .then((resp) => {
                    const re = {
                        message: 'Comment successfully created',
                        ArticleTitle: resp.rows[0].title,
                        createdOn: result.rows[0].created_at,
                        comment: result.rows[0].comment

                    };

                    return res.status(201).json({
                        status: 'success',
                        data: re,


                    });
                }).catch(err => {
                    return res.status(400).json({ err });
                });
        }).catch(error => {
            return res.status(400).json({ error });
        });
    });
}
        