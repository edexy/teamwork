
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const adminAuth = require('../../middleware/auth/admin');


router.post('/create-user', adminAuth, userCtrl.signup);
router.post('/signin', userCtrl.signin);

module.exports = router;