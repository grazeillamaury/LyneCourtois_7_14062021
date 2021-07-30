const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const commentCtrl = require('../controllers/comment');

router.get('/:id', /*auth,*/ commentCtrl.getOneComment);
router.post('/:post_id', auth, multer, commentCtrl.createComment);
router.put('/:id', auth, multer, commentCtrl.modifyComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;