const db = require('../connection');

const getTodos = (options, userId) => {
  console.log('OPTIONS', options)
  const queryParams = [userId];
  let queryString = `
    SELECT todo_items.*, categories.name AS category_name
    FROM todo_items
    JOIN categories ON categories.id = category_id
    JOIN users ON users.id = user_id
    WHERE users.id = $1
  `;

  if (options.searchStr) {
    queryParams.push(options.searchStr.toLowerCase());
    queryString += `
      AND LOWER(memo_details) LIKE '%' || $${queryParams.length} || '%'
      OR LOWER(categories.name) LIKE '%' || $${queryParams.length} || '%'
      `;
  }

  if (options.categoryId) {
    queryParams.push(options.categoryId);
    queryString += `
      AND categories.id = $${queryParams.length}
      `;
  }

  console.log('queryParams', queryParams)
  console.log('queryString', queryString)

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
