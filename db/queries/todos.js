const db = require('../connection');

// This pulls all of the existing todo memo data
const getTodos = (options, userId) => {
  // console.log('OPTIONS', options);
  const queryParams = [userId];
  let queryString = `
    SELECT todo_items.*, categories.name AS category_name
    FROM todo_items
    JOIN categories ON categories.id = category_id
    JOIN users ON users.id = user_id
    WHERE users.id = $1
  `;

  // This reveals only todos matching search bar strings
  if (options.searchStr) {
    queryParams.push(options.searchStr.toLowerCase());
    queryString += `
      AND LOWER(memo_details) LIKE '%' || $${queryParams.length} || '%'
      OR LOWER(categories.name) LIKE '%' || $${queryParams.length} || '%'
      `;
  }

  // This filters memo items by category type
  if (options.categoryName) {
    queryParams.push(options.categoryName);
    queryString += `
      AND categories.id = (SELECT id FROM categories WHERE name = $${queryParams.length})
      `;
  }

  queryString += ` ORDER BY date_added`;

  return db.query(queryString, queryParams)
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};

// This creates variables to store what's being added into the query string below
const addTodo = (newTask) => {
  const values = [
    newTask.memo_details,
    newTask.userId,
    newTask.categoryName
  ];

  // Inserts updated todo memo data into the database
  const queryString = `
      INSERT INTO todo_items (memo_details, user_id, category_id)
      VALUES ($1, $2, (SELECT id FROM categories WHERE name = $3))
      RETURNING *;`;

  return db
    .query(queryString, values)
    .then((result) => {
      console.log("RESULT FROM DB", result.rows[0]);

      const newTodo = result.rows[0];
      newTodo['category_name'] = newTask.categoryName;
      return newTodo;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

const updateTodoItem = (options) => {
  const queryParams = [];
  let queryString = `
    UPDATE todo_items
    `;

  if (options.memo_details) {
    queryParams.push(options.memo_details);
    queryString += `
        SET memo_details = $${queryParams.length}
        `;
  }

  if (options.completion_status) {
    queryParams.push(options.completion_status);
    queryString += `
      SET completion_status = $${queryParams.length}
    `;
  }

  if (options.category_name) {
    queryParams.push(options.category_name);
    queryString += `
      SET category_id = (SELECT id FROM categories WHERE name = $${queryParams.length})
    `;
  }

  queryParams.push(options.todoId);
  queryString += `
  WHERE id = $${queryParams.length}
  RETURNING *;
  `;

  return db
    .query(queryString, queryParams)
    .then((result) => {

      console.log('result rows', result.rows);

      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });

};

const deleteToDo = (todoId) => {

  console.log('TODO TASK ID', todoId);
  const queryString = `DELETE FROM todo_items
  WHERE ID = $1;`;

  return db
    .query(queryString, [todoId])
    .then((result) => {

      console.log('result rows', result.rows);

      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });


};

module.exports = { getTodos, addTodo, updateTodoItem, deleteToDo };
