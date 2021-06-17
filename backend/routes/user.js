const express = require('express');
const router = express.Router();

const limiter = require('../middleware/limiter');

const userCtrl = require('../controllers/user');

router.post('/signup', limiter, userCtrl.signup);

module.exports = router;