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

  const values = [user.name, user.email, user.password, user.location];

  const queryString = `
    INSERT INTO users (name, email, password, location)
    VALUES ($1, $2, $3, $4)
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

const editUser = (options, userID)  =>  {

  const values = [];

  let queryString = `
  UPDATE users
  SET
  `;

  if (options.email)  {
    values.push(options.email);
    queryString += `
    email = $${values.length}
    `;
  }

  if (options.city) {
    if (values.length === 1)  {
      queryString += `, `;
    }
    values.push(options.city);
    queryString += `
    location = $${values.length}
    `;
  }

  values.push(userID);
  queryString += `
  WHERE ID = $${values.length}
  RETURNING *;`;

  // This returns the fresh provided data back into the database to be saved
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


module.exports = { getUsers, getUserByEmail, addUser, getUserById, editUser };
