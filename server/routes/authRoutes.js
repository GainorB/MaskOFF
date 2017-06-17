const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const passport = require('../services/auth/local');
const authHelpers = require('../services/auth/auth-helpers');
let errors;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: process.env.ACCESS_TOKEN
    },
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

        var mailOptions = {
          from: 'MaskOFF <noresponse@gmail.com>',
          to: req.user.email,
          subject: 'Welcome to MaskOFF',
          html: `Hey, thanks for registering at MaskOFF, below is the information you need to login, along with links to get you started!<br>
                <br>
                <b>Login Here:</b> http://maskoff.herokuapp.com/auth/login<br>
                <br><b>With this information:</b><br>
                <b>Username:</b> ${req.user.username}<br>
                <b>Password:</b> ${req.body.password}<br>
                <br>
                <b>Quick Links to Get Started!</b><br>
                Why MaskOFF? http://maskoff.herokuapp.com/learnmore<br>
                Create your first listing: http://maskoff.herokuapp.com/dashboard/create<br>
                Browse our listings: http://maskoff.herokuapp.com/browse<br>
                <br>
                See you soon! :)`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

      });
    }).catch((err) => { res.status(500).json({ status: 'Registration Error: Username or Email already in use.' }); });
  }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid username or password.'
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out.');
  res.redirect('/auth/login');
});

module.exports = router;