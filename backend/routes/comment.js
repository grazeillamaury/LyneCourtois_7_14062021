const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const commentCtrl = require('../controllers/comment');

router.post('/:post_id', auth, multer, commentCtrl.createComment);

module.exports = router;