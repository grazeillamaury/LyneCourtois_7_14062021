const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const paramCtrl = require('../controllers/param');

router.get('/:id', auth, paramCtrl.getOneUserParam);
router.put('/:id', auth, multer, paramCtrl.modifyParam);
/*router.put('/:id', auth, multer, paramCtrl.modifyPassword);
router.delete('/:id', auth, paramCtrl.deleteUser);*/

module.exports = router;