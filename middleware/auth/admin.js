const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodeToken.userId;
        const userType = decodeToken.userType;

        //check if user have a valid id and admin priviledges
        if(!req.body.userId || req.body.userId != userId || userType != 1){
            throw 'Invalid user';
        }else{
            next();
        }
    }catch{
        const resp = {
            message: "Unauthorized request",

        }
        res.status(403).json({
            status: 'failed',
            data: resp
        });
    };
}