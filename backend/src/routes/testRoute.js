const express = require('express');
const router = express.Router();
const { home } = require('../controllers/testController');

router.get('/', home);

module.exports = router;
