const pool = require('../../db/connection').pool;

const cloudinary = require("cloudinary").v2;



//Enter your credentials below 
cloudinary.config({
    cloud_name: "edexy",
    api_key: "963324511418973",
    api_secret: "4Ubi5w1ef_hQXMajhhBCyz0PRTM"
});

exports.createGif = (req, res, next) => {

    let filename = req.files.image.path;
    let user_id = req.body.userId;

    cloudinary.uploader.upload(filename, { tags: "gifs", resource_type: "auto" })
        .then(function (file) {
            //console.log(file);

            //save the uploaded item details to db 
            pool.connect((err, client, done) => {
                let query = 'INSERT INTO gifs (title, url, user_id, public_id, created_at) VALUES($1,$2,$3,$4,$5) RETURNING *';
                let values = [req.body.title, file.secure_url, user_id, file.public_id, file.created_at];
                client.query(query, values, (error, result) => {
                    done();
                    if (error) {
                       return res.status(400).json({ error });
                    } else {
                        const resp = {
                            message: 'User Gif successfully created',
                            gifID: parseInt(result.rows[0].id),
                            title: result.rows[0].title,
                            createdOn: result.rows[0].created_at,
                            imageUrl: result.rows[0].url,
                            userId: user_id

                        };

                        return res.status(201).json({
                            status: 'success',
                            data: resp


                        });
                    }

                });
            });
        })
        .catch(function (err) {
            if (err) {
                console.log(err);
               return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
        });


    
}

exports.createComment = (req, res, next) => {

    const data = {
        comment: req.body.comment,
        gif_id: req.params._id,
        user_id: req.body.userId,
        created_at: new Date()
    };


    //save the article details to db 
    pool.connect((err, client, done) => {
        let query = 'INSERT INTO comments (comment, gif_id, user_id, created_at) VALUES($1,$2,$3,$4) RETURNING *';
        let values = [data.comment, data.gif_id, data.user_id, data.created_at];
        client.query(query, values).then((result) => {
            done();
            client
                .query('SELECT * FROM gifs WHERE id=$1', [result.rows[0].gif_id])
                .then((resp) => {
                    const re = {
                        message: 'Comment successfully created',
                        gifTitle: resp.rows[0].title,
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

exports.getOneGif = (req, res, next) => {

    //save the article details to db 
    let _id = req.params._id;
    pool.connect((err, client, done) => {
        client.query('SELECT * FROM gifs WHERE id=$1', [_id]).then((result) => {
            done();
            client
                .query('SELECT id as comment_id, comment, user_id as author_id FROM comments WHERE gif_id=$1', [result.rows[0].id])
                .then((resp) => {

                    let gifs = result.rows[0];
                    gifs.comments = resp.rows;

                    return res.status(200).json({
                        status: 'success',
                        data: gifs,


                    });
                }).catch(err => {
                    return res.status(400).json({ err });
                });
        }).catch(error => {
            return res.status(400).json({ error });
        });
    });
}


exports.deleteGif = (req, res, next) => {

    let gifID = req.params._id;

//check database for the
    pool.connect((err, client, done) => {
        client.query('DELETE FROM gifs WHERE id = $1 RETURNING *', [gifID], (error, result) => {
            done();
            if (result.rowCount < 1) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Gif Not Found'
                });
            }
        
            if (error) {
                return res.status(400).json({ error });
            }

            cloudinary.uploader.destroy(result.rows[0].public_id)
            .then(result => {
                return res.status(204).json({
                    status: result,
                    message: 'Gif Deleted Successfully'
                });
            }).catch(error => {
                return res.status(400).json({ error });
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