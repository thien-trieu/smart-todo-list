const express = require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs')
const { body, check, validationResult } = require("express-validator");
const { addUser } = require('../db/queries/users');

router.get('/', (req, res) => {

  res.render('register');
});


router.post('/', [
  body('name')
    .trim()
    .notEmpty().withMessage("The email field cannot be empty!"),
  body('email')
    .trim()
    .notEmpty()
    .withMessage("The email field cannot be empty!")
    .normalizeEmail()
    .toLowerCase(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage("The password field cannot be empty!")
], (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()){
    console.log(errors)
    // display the errors

    const templateVars = {
      errors: errors.array()
    }

    res.render('register', templateVars)
    return
  }


  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  }

  // If registration is successful, add user info to
  addUser(newUser)

  res.redirect('/')
})

module.exports = router;
