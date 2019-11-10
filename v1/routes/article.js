
const express = require('express');
const router = express.Router();
const articleCtrl = require('../controllers/article');
const userAuth = require('../../middleware/auth/user');


router.post('/', userAuth, articleCtrl.createArticle);
router.get('/:_id', userAuth, articleCtrl.getOneArticle);
router.patch('/:_id', userAuth, articleCtrl.updateArticle);
router.delete('/:_id', userAuth, articleCtrl.deleteArticle);
router.post('/:_id/comment', userAuth, articleCtrl.createComment);
//router.post('/auth/signin', userCtrl.signin);

module.exports = router;