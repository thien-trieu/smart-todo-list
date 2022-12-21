const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, check, validationResult } = require("express-validator");

const { addUser, getUserByEmail } = require('../db/queries/users');

router.get('/', (req, res) => {
  const userId = req.session.userID;

  if (userId) {
    return res.redirect("/");
  }

  const templateVars = {
    user: undefined,
    errors: null
  };

  res.render('register', templateVars);

});

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
      const result = getUserByEmail(value)
        .then((data) => {
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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('ERRORS!', errors);

    const templateVars = {
      user: undefined,
      errors: errors.array()
    };

    console.log('TEMPLATEVARS', templateVars);

    // display the errors
    return res.render('register', templateVars);
  }
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    location: req.body.location
  };

  // if registration is successful, add user info to db
  addUser(newUser)
    .then(getUserByEmail(req.body.email))
    .then((user) => {

      req.session.userID = user.id;
      res.redirect('/');
      return;
    });
});

module.exports = router;
