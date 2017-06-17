const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const passport = require('../services/auth/local');
const authHelpers = require('../services/auth/auth-helpers');
let errors;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPW
  }
});

router.get('/login', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/login', { title: "Login" });
});

router.get('/register', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/register', { errors, title: "Registration" });
});

router.post('/register', (req, res, next)  => {
   
  const { username, password, email, state, city } = req.body;

  // VALIDATION
  req.checkBody('username', 'User Name is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(password);
  req.checkBody('email', 'Email is required.').isEmail();
  req.checkBody('state', 'State is required.').notEmpty();
  req.checkBody('city', 'City is required.').notEmpty();

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

        /*var mailOptions = {
          from: process.env.EMAILUSER,
          to: req.body.email,
          subject: 'Welcome to MaskOFF',
          html: `Hey, thanks for registering at MaskOFF, below is the information you need to login<br>
                <b>Link:</b> http://maskoff.herokuapp.com/auth/login<br>
                <b>Username:</b> ${req.body.username}<br>
                <b>Password:</b> ${req.body.password}<br>
                <br>
                See you soon!`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });*/

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