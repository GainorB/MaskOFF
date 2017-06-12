const bcrypt = require('bcryptjs');
const User = require('../../models/user');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function loginRedirect(req, res, next) {
  if (req.user) res.redirect('/dashboard');

  return next();
}

function createNewUser(req, res) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return User.create({
    username: req.body.username,
    password: hash,
    email: req.body.email,
    state: req.body.state,
    city: req.body.city,
    gender: req.body.gender,
    age: req.body.age
  });
}

function loginRequired(req, res, next) {
  if (!req.user) res.redirect('/auth/login');

  return next();
}

module.exports = {
  comparePass,
  loginRedirect,
  loginRequired,
  createNewUser
}