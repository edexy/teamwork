
const express = require('express');
const router = express.Router();
const gifCtrl = require('../controllers/gif');
const userAuth = require('../../middleware/auth/user');


router.post('/gifs', userAuth, gifCtrl.createGif);
//router.post('/auth/signin', userCtrl.signin);

module.exports = router;