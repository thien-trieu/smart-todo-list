const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

const getUserByEmail = (email) => {

  return db.query('SELECT * FROM users WHERE email = $1;', [email])
    .then(data => {
      return data.rows;
    });
    
};


module.exports = { getUsers, getUserByEmail };
