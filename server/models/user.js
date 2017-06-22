var db = require('../models/config');

const User = {};

function capitalizeFirstLetter(string){
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

User.findByUserName = userName => {
  return db.oneOrNone('SELECT * FROM users WHERE username = $1', userName);
};

User.create = user => {
  return db.one(
    `
      INSERT INTO users
      (username, password, email, state, city)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
    [user.username, user.password, user.email, capitalizeFirstLetter(user.state), capitalizeFirstLetter(user.city)]
  )
};

module.exports = User;