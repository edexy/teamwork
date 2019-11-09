
const express = require('express');
const router = express.Router();
const gifCtrl = require('../controllers/gif');
const userAuth = require('../../middleware/auth/user');
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();


router.post('/', multipartMiddleware, userAuth, gifCtrl.createGif);
router.delete('/:_id', userAuth, gifCtrl.deleteGif);
//router.post('/auth/signin', userCtrl.signin);

module.exports = router;