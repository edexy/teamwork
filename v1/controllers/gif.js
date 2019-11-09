const pool = require('../../db/connection');

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
                        res.status(400).json({ error });
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
                            data: resp,


                        });
                    }

                });
            });
        })
        .catch(function (err) {
            if (err) {
                res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
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
                return res.status(404).json({
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