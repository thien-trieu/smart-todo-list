/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const router = express.Router();
const { getTodos, addTodo, updateTodoItem, deleteToDo } = require('../db/queries/todos');
const { selectCategoryWithApi } = require('../services/select_category');


router.get('/', (req, res) => {
  const searchStr = req.query.search;
  const categoryName = req.query.categoryName;
  const userId = req.session.userID;
  if (!userId) return res.redirect("/login");

  const options = {searchStr, categoryName};

  getTodos(options, userId)
    .then(todos => {
      res.json({ todos });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/update', (req, res) => {
  console.log('TODO UPDATED 1', req.body);

  updateTodoItem(req.body)
    .then((task)=> {
      res.json(task);
      return;
    });
});

router.post('/delete', (req, res) => {
  // sends delete query to database
  deleteToDo(req.body.todoId)
    .then((task)=> {
      res.json('Task deleted!');
      return;
    });
});


router.post('/', (req, res) => {
  const userId = req.session.userID;
  const results = selectCategoryWithApi(req.body.newTodo, userId);

  console.log('RESULTS: ', results);

  results.then(categoryName => {
    console.log('Got the category name back from the selectCategoryWithApi:', categoryName);
    const newTask = {
      'memo_details': req.body.newTodo,
      userId,
      categoryName
    };

    addTodo(newTask)
      .then((task)=> {
        res.json(task);
        return;
      });
  });
});

module.exports = router;
