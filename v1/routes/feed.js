
const express = require('express');
const router = express.Router();
const feedCtrl = require('../controllers/feed');
const userAuth = require('../../middleware/auth/user');
// const multipart = require("connect-multiparty");
// const multipartMiddleware = multipart();


router.get('/', userAuth, feedCtrl.getFeed);
//router.delete('/:_id', userAuth, gifCtrl.deleteGif);
//router.post('/auth/signin', userCtrl.signin);

module.exports = router;