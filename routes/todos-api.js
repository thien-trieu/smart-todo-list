/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const router  = express.Router();
const todoQueries = require('../db/queries/todos');

router.get('/', (req, res) => {
  console.log('TODOS API');
  todoQueries.getTodos()
    .then(todos => {
      console.log('TODOS API');
      res.json({ todos });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post

module.exports = router;
