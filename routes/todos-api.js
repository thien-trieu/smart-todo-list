/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const router = express.Router();
const { getUserById } = require('../db/queries/users');
const { getTodos, addTodo, updateTodoItem, deleteToDo } = require('../db/queries/todos');
const { selectCategory, selectCategoryWithApi } = require('../services/select_category');

router.get('/', (req, res) => {
  const searchStr = req.query.search;
  const categoryId = req.query.categoryId;
  const userId = req.session.userID;
  if (!userId) return res.redirect("/login");

  const options = { searchStr, categoryId };

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
    .then((task) => {
      console.log('UPDATED TASK', task);
      res.json(task);
      return;
    });
});

router.post('/delete', (req, res) => {
  // sends delete query to database
  deleteToDo(req.body.todoId);
});


router.post('/', (req, res) => {
  const userId = req.session.userID;

  getUserById(userId)
    .then(user => {
      
      async function task() {
        const categoryName = await selectCategoryWithApi(req.body.newTodo, user);
        const newTask = {
          memo_details: req.body.newTodo,
          userId,
          categoryName
        };
        console.log(categoryName);
        return newTask;

      }

      task()
        .then(newTask => addTodo(newTask))
        .then((task) => {
          console.log('NEW TASK', task);
          res.json(task);
          return;
        })
        .catch((err) => {
          console.error(err);
        });

    })
    .catch((err) => {
      console.error(err);
    });






});



module.exports = router;
