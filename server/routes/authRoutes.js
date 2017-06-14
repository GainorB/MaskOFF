const express = require('express');
const router = express.Router();

const passport = require('../services/auth/local');
const authHelpers = require('../services/auth/auth-helpers');
let errors;

router.get('/login', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/login', { title: "Login" });
});

router.get('/register', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/register', { errors, title: "Registration" });
});

router.post('/register', (req, res, next)  => {
   
  const { username, password, email, state, city, age } = req.body;

  // VALIDATION
  req.checkBody('username', 'User Name is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(password);
  req.checkBody('email', 'Email is required.').isEmail();
  req.checkBody('state', 'State is required.').notEmpty();
  req.checkBody('city', 'City is required.').notEmpty();
  req.checkBody('age', 'Age is required').isInt();

  // VALIDATION ERRORS
  let errors = req.validationErrors();

  // HANDLE VALIDATION ERRORS
  if(errors){
    req.flash('error', "There was a problem during registration, please fix the errors below:");
    res.render('auth/register', { errors, title: "Registration" });
  } else {
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