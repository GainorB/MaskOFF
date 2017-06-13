var express = require('express');
var router = express.Router();
var db = require('../models/queries');

router.get('/', function(req, res, next) {
  res.render('Dashboard', { user_profile: req.user });
});

router.get('/accepted', function(req, res, next) {
  res.render('AcceptedListings');
});

router.get('/create', function(req, res, next) {
  res.render('CreateListing');
});

router.post('/create', function(req, res, next) {
  db.createListing(req, res, next);
  req.flash('success', 'Your item has successfully been created.');
});

module.exports = router;