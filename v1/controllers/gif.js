exports.createGif = (req, res, next) => {
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

            pool.connect((err, client, done) => {
                let query = 'INSERT INTO users (first_name, last_name, email, password, gender, job_role, department, address, created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *';
                let values = [data.firstname, data.lastname, data.email, data.password, data.gender, data.jobrole, data.department, data.address, data.created_at];
                client.query(query, values, (error, result) => {
                    done();
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
            });
        }
    )
}