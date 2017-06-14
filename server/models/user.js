var db = require('../models/config');

const User = {};

User.findByUserName = userName => {
  return db.oneOrNone('SELECT * FROM users WHERE username = $1', [userName]);
};

User.create = user => {
  return db.one(
    `
      INSERT INTO users
      (username, password, email, state, city, age)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `,
    [user.username, user.password, user.email, user.state, user.city, user.age]
  )
};

module.exports = User;