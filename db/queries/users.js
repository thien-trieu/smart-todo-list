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

const getUserById = (id) => {
  return db.query('SELECT * FROM users WHERE id = $1;', [id])
    .then(data => {
      return data.rows[0];
    });
};

const addUser = function(user) {

  const values = [user.name, user.email, user.password];

  const queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`;

  return db
    .query(queryString, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });


};

const editUserEmail = (newEmail, userID) => {

  const queryString = `
     UPDATE users
     SET email = $1
     WHERE ID = $2
     RETURNING *;
    `

    return db
    .query(queryString, [newEmail, userID])
    .then((result) => {

      console.log('result rows', result.rows)

      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });

}

module.exports = { getUsers, getUserByEmail, addUser, getUserById, editUserEmail };
