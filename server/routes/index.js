var express = require('express');
var router = express.Router();
var db = require('../models/queries');

const authHelpers = require('../services/auth/auth-helpers');

// LANDING PAGE
// RENDERS LOGIN, THEN REDIRECTS TO DASHBOARD ONCE AUTHENTICATED
// CAN NAVIGATE TO LEARN MORE AND BROWSE ITEMS
router.get('/', function (req, res, next) {
  res.redirect('auth/login');
});

// LEARN MORE
router.get('/learnmore', function (req, res, next) {
  res.render('LearnMore', { title: "Learn More" });
});

// RETURN ALL LISTINGS AND RENDER DATA ON BROWSE PAGE
router.get('/browse', db.getAllListings);

router.put('/updateProfile', db.updateProfile);
router.delete('/deleteAccount', db.deleteAccount);

// A SINGLE ITEM
router.get('/browse/:id', authHelpers.loginRequired, function (req, res, next) {
  let id = req.params.id;
  db.getAListing(id, req, res, next);
});

// ACCEPT A LISTING
router.post('/browse/accept/:id', authHelpers.loginRequired, function (req, res, next) {
  let id = req.params.id;
  db.acceptListing(id, req, res, next);
});

module.exports = router;