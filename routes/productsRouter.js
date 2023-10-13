'use strict';

let express = require('express');
let router = express.Router();
let controller = require('../controllers/productsController');

router.get('/', controller.show);

module.exports = router