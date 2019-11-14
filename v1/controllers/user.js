const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../db/connection').pool;



exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const data = {
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                email: req.body.email,
                password: hash,
                gender: req.body.gender,
                jobrole: req.body.jobRole,
                department: req.body.department,
                address: req.body.address,
                created_at: new Date()


            };
            console.log(data);

            // pool.connect((err, client, done) => {
                let query = 'INSERT INTO users (first_name, last_name, email, password, gender, job_role, department, address, created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *';
                let values = [data.firstname, data.lastname, data.email, data.password, data.gender, data.jobrole, data.department, data.address, data.created_at];
                pool.query(query, values, (error, result) => {
                    // done();
                    if (error) {
                        res.status(400).json({ error });
                    } else {
                        const resp = {
                            message: 'User account successfully created',
                            userID: parseInt(result.rows[0].id)
                        };
                        
                        res.status(201).json({
                            status: 'success',
                            data: resp,
                           

                        });
                    }

                });
            // });
        }
    )
}


exports.signin = (req, res, next) => {
    let email = req.body.email;
    // pool.connect((err, client, done) => {
        pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email], (error, result) => {
            // done();
            if (result.rowCount < 1) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'No User information found'
                });
            }

            if (error) {
                return res.status(400).json({ error });
            }

            bcrypt.compare(req.body.password, result.rows[0].password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            status: 'failed',
                            message: 'Incorrect Password'
                        });
                    }
                    const token = jwt.sign({ userId: result.rows[0].id, userType: result.rows[0].user_type },
                        'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
                    const resp = {
                        token: token,
                        UserID:  result.rows[0].id
                    };    
                    res.status(200).json({
                        status: 'success',
                        data: resp
                    })
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    })
                }
            )

        });
    // });

}