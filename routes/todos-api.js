/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const router  = express.Router();
const { getTodos, addTodo } = require('../db/queries/todos');

router.get('/', (req, res) => {
  const searchStr = req.query.string;
  const userId = req.session.userID;
  if (!userId) return res.redirect("/login");

  getTodos(searchStr, userId)
    .then(todos => {
      res.json({ todos });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

<<<<<<< HEAD

=======
router.post('/', (req, res) => {

  //** Use APIs HERE to get the category name */

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
>>>>>>> bff630fc5d218135493f7bdb787d9574d8af01b4

module.exports = router;
