var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('Dashboard', { user_profile: req.user })
});

module.exports = router;