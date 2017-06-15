var express = require('express');
var router = express.Router();
var db = require('../models/queries');

const authHelpers = require('../services/auth/auth-helpers');

router.get('/', authHelpers.loginRequired, function(req, res, next) {
  res.render('Dashboard', { user_profile: req.user, title: "Dashboard" });
});

router.get('/accepted', authHelpers.loginRequired, db.getAcceptedListings, function(req, res, next) {
  res.render('AcceptedListings', { title: "Accepted Listings" });
});

router.get('/create', authHelpers.loginRequired, function(req, res, next) {
  res.render('CreateListing', { title: "Create A Listing" });
});

router.post('/create', authHelpers.loginRequired, function(req, res, next) {
  db.createListing(req, res, next);
  req.flash('success', 'Your item has successfully been created.');
});

module.exports = router;