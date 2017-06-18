var express = require('express');
/*var multer  = require('multer');
var upload = multer();*/
var router = express.Router();
var db = require('../models/queries');

const authHelpers = require('../services/auth/auth-helpers');

router.get('/', authHelpers.loginRequired, function(req, res, next) {
  res.render('Dashboard', { user_profile: req.user, title: "Dashboard" });
});

router.get('/trades', authHelpers.loginRequired, db.getAcceptedListings, function(req, res, next) {
  res.render('AcceptedTrades', { title: "My Trades" });
});

router.get('/create', authHelpers.loginRequired, function(req, res, next) {
  res.render('CreateTrade', { title: "Create a Trade" });
});

router.post('/create/trade', authHelpers.loginRequired, function(req, res, next) {
  db.createListing(req, res, next);
  req.flash('success', 'Your item has successfully been created.');
});

module.exports = router;