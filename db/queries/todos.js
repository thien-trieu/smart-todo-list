const db = require('../connection');

// This pulls all of the existing todo memo data
const getTodos = (options, userId) => {
  console.log('OPTIONS', options);
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
  if (options.categoryId) {
    queryParams.push(options.categoryId);
    queryString += `
      AND categories.id = $${queryParams.length}
      `;
  }

  console.log('queryParams', queryParams);
  console.log('queryString', queryString);

  return db.query(queryString, queryParams)
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};

const categoryCall = function(catName) {

  console.log(`catName is ${catName}`);

  const queryString = `
  SELECT *
  FROM categories
  WHERE name = $1;
  `;

  console.log(`querystring is ${queryString}`);

  return db
    .query(queryString, [catName])
    .then((result) => {
      console.log(`Result is ${JSON.stringify(result.rows)}`);
      console.log(`Result.rows is ${result.rows[0].id}`);
      return result.rows[0].id;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};




// This creates variables to store what's being added into the query string below
const addTodo = (newTask) => {
  const values = [
    newTask.memo_details,
    newTask.userId
  ];

  return categoryCall(newTask.categoryName)
    .then((catID) => {
      values.push(catID);

      // Inserts updated todo memo data into the database
      const queryString = `
      INSERT INTO todo_items (memo_details, user_id, category_id)
      VALUES ($1, $2, $3)
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
    });
};



const updateTodoItem = (options) => {
//{ completion_status: 'true', todoId: '3' }

  const queryParams = [];
  //get userId from the cookie
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
