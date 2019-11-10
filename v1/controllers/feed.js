const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../db/connection');


exports.getFeed = (req, res, next) => {
    let email = req.body.email;
    pool.connect((err, client, done) => {
        client.query('(SELECT * FROM articles) UNION ALL (SELECT * FROM gifs)', (error, result) => {
            done();
            if (result.rowCount < 1) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Feeds found'
                });
            }

            if (error) {
                return res.status(400).json({ error });
            }
    
            res.status(200).json({
                status: 'success',
                data: result.rows
            })

            // bcrypt.compare(req.body.password, result.rows[0].password).then(
            //     (valid) => {
            //         if (!valid) {
            //             return res.status(401).json({
            //                 status: 'failed',
            //                 message: 'Incorrect Password'
            //             });
            //         }
            //         const token = jwt.sign({ userId: result.rows[0].id, userType: result.rows[0].user_type },
            //             'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
            //         const resp = {
            //             token: token,
            //             UserID:  result.rows[0].id
            //         };    
            //         res.status(200).json({
            //             status: 'success',
            //             data: resp
            //         })
            //     }
            // ).catch(
            //     (error) => {
            //         res.status(500).json({
            //             error: error
            //         })
            //     }
            // )

        });
    });

}