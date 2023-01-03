const db = require('../connection');
// routes/todo-apis.js for routes
// public/scripts/todo_edits.js for event listeners


// Shows TODO item(s) based on SEARCH BAR option or CATEGORY ICON FILTER option
const getTodosByOptions = (options, userId) => {

  const queryParams = [userId];
  let queryString = `
    SELECT todo_items.*, categories.name AS category_name
    FROM todo_items
    JOIN categories ON categories.id = category_id
    JOIN users ON users.id = user_id
    WHERE users.id = $1
  `;

  // This reveals only TODO items matching search bar strings
  if (options.searchStr) {
    queryParams.push(options.searchStr.toLowerCase());
    queryString += `
      AND LOWER(memo_details) LIKE '%' || $${queryParams.length} || '%'
      OR LOWER(categories.name) LIKE '%' || $${queryParams.length} || '%'
      `;
  }

  // This filters TODO items by category type
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

// Adds new TODO item to the database
const addTodo = (options) => {
  const queryParams = [
    options.memo_details,
    options.userId,
    options.categoryName
  ];

  const queryString = `
      INSERT INTO todo_items (memo_details, user_id, category_id)
      VALUES ($1, $2, (SELECT id FROM categories WHERE name = $3))
      RETURNING *;`;

  return db
    .query(queryString, queryParams)
    .then((result) => {
      console.log("RESULT FROM DB", result.rows[0]);

      const newTodo = result.rows[0];
      newTodo['category_name'] = options.categoryName;
      return newTodo;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

// Edit an existing TODO item's memo text, completion status or category
// through SINGLE edit fields(input field, circle icon or category dropdown) or 'Pencil' Edit Form
const updateTodoItem = (options) => {

  const queryParams = [];
  let queryString = `
    UPDATE todo_items
    SET
    `;

  if (options.memo_details) {
    queryParams.push(options.memo_details);
    queryString += `
        memo_details = $${queryParams.length}
        `;
  }

  if (options.completion_status) {
    if (queryParams.length >= 1) {
      queryString += `, `;
    }
    queryParams.push(options.completion_status);
    queryString += `
      completion_status = $${queryParams.length}
    `;
  }

  if (options.category_name) {
    if (queryParams.length >= 1) {
      queryString += `, `;
    }
    queryParams.push(options.category_name);
    queryString += `
      category_id = (SELECT id FROM categories WHERE name = $${queryParams.length})
    `;
  }

  queryParams.push(options.todoId);
  queryString += `
  WHERE id = $${queryParams.length}
  RETURNING *
  `;

  return db
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });

};

// This handles deletion of existing TODO item when the trash can button is clicked
const deleteToDo = (todoId) => {

  console.log('TODO TASK ID', todoId);
  const queryString = `DELETE FROM todo_items
  WHERE ID = $1;`;

  return db
    .query(queryString, [todoId])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

module.exports = { getTodos: getTodosByOptions, addTodo, updateTodoItem, deleteToDo };
