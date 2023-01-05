const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, check, validationResult } = require("express-validator");

const { addUser, getUserByEmail } = require('../db/queries/users');

router.get('/', (req, res) => {

  // If user is already logged in, they will redirected to main index page
  const userId = req.session.userID;
  if (userId) {
    return res.redirect("/");
  }

  // 'user' and 'error' variables required to render REGISTER page.
  // data is 'null' as user is not registered yet and no error.
  const templateVars = {
    user: null,
    errors: null
  };
  res.render('register', templateVars);
});

// REGISTER Post request: Express Validator will check user's inputs
router.post('/', [
  check('name')
    .trim()
    .notEmpty().withMessage(" Please enter your name "),
  check('email')
    .trim()
    .notEmpty()
    .withMessage(" Please enter your email ")
    .normalizeEmail()
    .toLowerCase(),
  body("email")
    .custom((value) => {
      // Check if any user comes up with the email that the user is trying to register with
      const result = getUserByEmail(value)
        .then((data) => {
          // if a user exist with email, new user can not register with the same email.
          const user = data[0];
          if (user) {
            throw new Error("The email already exist.");
          }
          return Promise.resolve(true);
        });
      return result;
    }),
  check('password')
    .trim()
    .notEmpty()
    .withMessage(" Please create a strong password "),
  check('location')
    .trim()
    .notEmpty()
    .withMessage(" Please enter your city ")
    .toLowerCase()
], (req, res) => {
  // receive any error from express validator
  const errors = validationResult(req);

  // if any errors, render the REGISTER page and display the errors
  if (!errors.isEmpty()) {
    const templateVars = {
      user: null,
      errors: errors.array()
    };
    return res.render('register', templateVars);
  }

  // if no error, newUser object is passed into addUser function to store user in database.
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    location: req.body.location
  };

  // Add user, create cookie with USER ID and user gets redirected to index to start.
  addUser(newUser)
    .then(getUserByEmail(newUser.email))
    .then((user) => {

      req.session.userID = user.id;
      res.redirect('/');
      return;
    });
});

module.exports = router;
