/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const router  = express.Router();
const { getTodos, addTodo,  updateTodoItem, deleteToDo} = require('../db/queries/todos');
const { selectCategory } = require('../services/select_category');

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
      console.log('UPDATED TASK', task);
      res.json(task);
      return;
    });
});

router.post('/delete', (req, res) => {

  deleteToDo(req.body.todoId).then(() => {
    res.redirect('/');
  });
});

router.post('/', (req, res) => {
  console.log('called too');
  //** Use APIs HERE to get the category name */

  const categoryName = selectCategory(req.body.newTodo);
  console.log(`Category Name is ${categoryName}`);


  console.log(req.body.newTodo);
  const userId = req.session.userID;
  const newTask = {
    memo_details: req.body.newTodo,
    userId,
    categoryName
  };

  addTodo(newTask)
    .then((task)=> {
      console.log('NEW TASK', task);
      res.json(task);
      return;
    });
});



module.exports = router;
