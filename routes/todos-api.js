const express = require('express');
const router = express.Router();
const { getTodos: getTodosByOptions, addTodo, updateTodoItem, deleteToDo } = require('../db/queries/todos');
const { selectCategoryWithApi } = require('../services/select_category');


router.get('/', (req, res) => {
  const searchStr = req.query.search;
  const categoryName = req.query.categoryName;
  const userId = req.session.userID;

  if (!userId) {
    return res.redirect("/login");
  }

  const options = {
    searchStr,
    categoryName
  };

  // Shows TODO item(s) based on SEARCH BAR option or CATEGORY ICON FILTER option
  getTodosByOptions(options, userId)
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

  const options = req.body;
  console.log('OPTIONS for updating the TODO item:', options);

  /*
  Edit an existing TODO item's memo text, completion status or category through SINGLE edit fields(input field, circle icon or category dropdown) or 'Pencil' Edit Form
 */

  updateTodoItem(options)
    .then((details) => {
      console.log('NEW updated TODO item details:', details);
      res.json(details);
      return;
    });
});

router.post('/delete', (req, res) => {
  // This handles deletion of existing TODO item when the trash can button is clicked
  deleteToDo(req.body.todoId);
});


router.post('/', (req, res) => {
  const userId = req.session.userID;
  const memo_details = req.body.newTodo;

  // Sends NEW TODO item's memo details to get categorized
  selectCategoryWithApi(memo_details, userId)
    .then(categoryName => {

      console.log('CATEGORY NAME RESULTS from selectCategoryWithApi call:', categoryName);

      const newTodoItem = {
        memo_details,
        userId,
        categoryName
      };

      // Once a category has been determined, details of the NEW TODO item is added to the database
      addTodo(newTodoItem)
        .then((task) => {
          res.json(task);
          return;
        });
    });
});

module.exports = router;
