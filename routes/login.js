const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../db/queries/users');

// LOGIN Get request:
router.get('/', (req, res) => {

  // If user is already logged in, they will redirected to main index page
  const userId = req.session.userID;
  if (userId) {
    return res.redirect("/");
  }

  // 'user' and 'error' variables required to render LOGIN page.
  // data is 'null' as user is not logged yet and no error.
  const templateVars = {
    user: null,
    errors: null
  };
  res.render('login', templateVars);
});

// LOGIN Post request: Express Validator will check user email and password
router.post('/', [
  check("email").notEmpty().withMessage("The email field cannot be empty!"),
  body("password")
    .custom((value, { req }) => {
      const email = req.body.email;
      // Get user from database to check credentials
      const result = getUserByEmail(email)
        .then((data) => {
          const user = data[0];
          // check if the user exist
          if (user === undefined) {
            throw new Error("Invalid credentials.");
          }
          // check if user password matches
          const passwordMatch = bcrypt.compareSync(value, user.password);

          if (!passwordMatch) {
            throw new Error("Invalid credentials.");
          }
          return Promise.resolve(true);
        });
      // return result from express validator
      return result;
    })
], (req, res) => {
  const email = req.body.email;

  // receive any error from express validator
  const errors = validationResult(req);

  // if any errors, render the LOGIN page and display the errors
  if (!errors.isEmpty()) {
    const templateVars = {
      errors: errors.array(),
      user: null
    };
    res.status(403);
    return res.render("login", templateVars);
  }

  // if no errors, get user info
  getUserByEmail(email).then((data) => {
    return data[0];
  }) // then create cookie with user ID
    .then((user) => {
      req.session.userID = user.id;
      res.redirect('/');
    });
});


module.exports = router;
