/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const router  = express.Router();
const { getTodos, addTodo } = require('../db/queries/todos');
const { callWolfram } = require('../services/apis/wolfram');

router.get('/', (req, res) => {
  const searchStr = req.query.search;
  const categoryId = req.query.categoryId;
  const userId = req.session.userID;
  if (!userId) return res.redirect("/login");

  const options = {searchStr, categoryId};

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

router.post('/', (req, res) => {

  //** Use APIs HERE to get the category name */

  const wolframRes = callWolfram(req.body.newTodo)
    .then(response => {

      console.log('JSON FROM WOLFRAM', response);
    });

  console.log(req.body.newTodo);
  const userId = req.session.userID;
  const catname = 'Film / Series'; //**** Category name from API helper functions ***/

  const categoriesId = {
    'Film / Series': 1,
    'Restaurants, cafes, etc.': 2,
    'Books': 3,
    'Products': 4
  };

  const catId = categoriesId[catname];
  const newTask = {
    memo_details: req.body.newTodo,
    userId,
    categoryId: catId
  };

  addTodo(newTask)
    .then((task)=> {
      console.log('NEW TASK', task);
      res.json(task);
      return;
    });
});

module.exports = router;
