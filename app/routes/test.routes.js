const express = require('express');
const router = express.Router();
const TestController = require('../controllers/test.controller');

router.get('/', TestController.get);

module.exports = router;