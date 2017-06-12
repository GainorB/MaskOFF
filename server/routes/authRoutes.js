const express = require('express');
const router = express.Router();

const passport = require('../services/auth/local');
const authHelpers = require('../services/auth/auth-helpers');
var errors;

router.get('/login', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/login');
});

router.get('/register', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/register', { errors: errors });
});

router.post('/register', (req, res, next)  => {
   
  // IDENTITY
  var username = req.body.username;
  var email = req.body.email;
  var gender = req.body.gender;
  var age = req.body.age;

  // PASSWORD
  var password = req.body.password;
  var password2 = req.body.password2;

  // ADDRESS
  var location = req.body.state;
  var city = req.body.city;

  // VALIDATION
  req.checkBody('username', 'User Name is required.').notEmpty();
  req.checkBody('email', 'Email is required.').isEmail();
  req.checkBody('age', 'Age is required').isInt();
  req.checkBody('gender', 'Gender is required').notEmpty();

  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(password);

  req.checkBody('city', 'City is required.').notEmpty();
  req.checkBody('state', 'State is required.').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    req.flash('error', "There was a problem during Registration, please fix the errors below:");
    res.render('auth/register', { errors: errors });
  } else {
    req.flash('success', "You have successfully registered, enjoy!");
    authHelpers.createNewUser(req, res).then((user) => {
        req.login(user, (err) => {
      
        if(err) return next(err);

        res.redirect('/dashboard');
      });
    }).catch((err) => { res.status(500).json({ status: 'Registration Error: Username or Email already in use.' }); });
  }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out.');
  res.redirect('/auth/login');
});

module.exports = router;