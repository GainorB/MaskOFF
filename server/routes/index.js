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

// RETURN ALL LISTINGS FROM A PARTICULAR USER
router.get('/my/:username', function(req, res, next){
  let username = req.params.username;
  db.getMyListings(username, req, res, next)
});

// UPDATE A USERS PROFILE
router.put('/updateProfile', authHelpers.loginRequired, db.updateProfile);

// DELETE A USERS ACCOUNT
router.delete('/deleteAccount', authHelpers.loginRequired, db.deleteAccount);

// A SINGLE ITEM
router.get('/browse/:id', authHelpers.loginRequired, function (req, res, next) {
  let id = req.params.id;
  db.getAListing(id, req, res, next);
});

// DELETE A LISTING
router.get('/browse/delete/:id', authHelpers.loginRequired, function (req, res, next) {
  let id = req.params.id;
  db.deleteListing(id, req, res, next);
});

// ACCEPT A LISTING
router.get('/browse/accept/:id', authHelpers.loginRequired, function (req, res, next) {
  let id = req.params.id;
  db.acceptListing(id, req, res, next);
});

// CANCEL A TRADE
router.get('/trade/cancel/:id', authHelpers.loginRequired, function (req, res, next) {
  let id = req.params.id;
  db.cancelTrade(id, req, res, next);
});

// COMPLETE A TRADE
router.get('/trade/completed/:id', authHelpers.loginRequired, function (req, res, next) {
  let id = req.params.id;
  db.completedTrade(id, req, res, next);
});

// FILTER
router.post('/browse/filter', function (req, res, next) {
  let category = req.body.category;
  let brand = req.body.brand;
  db.filterCategory(category, brand, req, res, next);
});

// SEARCH
router.post('/browse/search', function (req, res, next) {
  let query = req.body.query;
  db.searchDatabase(query, req, res, next);
})

module.exports = router;