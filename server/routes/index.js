var express = require('express');
var router = express.Router();
var db = require('../models/queries');

const authHelpers = require('../services/auth/auth-helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;