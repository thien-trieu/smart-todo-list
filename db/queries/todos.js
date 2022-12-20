const db = require('../connection');

const getTodos = (searchStr, userId) => {
  const queryParams = [userId];
  let queryString = `
    SELECT todo_items.*, categories.name AS category_name
    FROM todo_items
    JOIN categories ON categories.id = category_id
    JOIN users ON users.id = user_id
    WHERE users.id = $1
  `;

  if (searchStr) {
    queryParams.push(searchStr.toLowerCase());
    queryString += `
      AND LOWER(memo_details) LIKE '%' || $${queryParams.length} || '%'
      OR LOWER(categories.name) LIKE '%' || $${queryParams.length} || '%'`;
  }

  return db.query(queryString, queryParams)
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addTodo = (newTask) => {
  const values = [
    newTask.memo_details,
    newTask.userId,
    newTask.categoryId
  ];

  const queryString = `
    INSERT INTO todo_items (memo_details, user_id, category_id)
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

module.exports = { getTodos, addTodo };
