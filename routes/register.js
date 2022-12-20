const express = require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs')
const { body, check, validationResult } = require("express-validator");
const { addUser, getUserByEmail, getUserById } = require('../db/queries/users');

router.get('/', (req, res) => {
  const userId = req.session.userID;
  if (userId) return res.redirect("/");

  console.log('USER ID', req.session.userID);

  getUserById(userId).then((user)=>{
    console.log('USER', user);
    const templateVars = {
      user,
      errors: null
    };
    res.render('register', templateVars);
  });
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

    const templateVars = {
      errors: errors.array(),
      user: undefined
    }
    // display the errors
    return res.render('register', templateVars)
  }

  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  }

  // if registration is successful, add user info to db
  addUser(newUser)
    .then(getUserByEmail(req.body.email))
    .then((user)=> {
      console.log('user object', user)
      console.log('user.id', user.id)


      req.session.userID = user.id
      res.redirect('/')
      return
    })

})

module.exports = router;
