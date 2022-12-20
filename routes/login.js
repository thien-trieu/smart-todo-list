const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const { getUserByEmail, getUserById } = require('../db/queries/users');
const cookieSession = require('cookie-session');

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
    res.render('login', templateVars);
  });
});

let user;

// express validotor
const validator = [
  check("email").notEmpty().withMessage("The email field cannot be empty!"),
  body("password")
    .custom((value, { req }) => {
      const email = req.body.email;
      const result = getUserByEmail(email).then((data)=>{
        user = data[0];
        if (user === undefined) {
          throw new Error("The user does not exist.");
        }
        const passwordMatch = bcrypt.compareSync(value, user.password);
        if (!passwordMatch) {
          throw new Error("Passwords do not match.");
        }
        return Promise.resolve(true);
      });
      return result;
    })
];

router.post('/', validator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const templateVars = {
      // user: user[req.session.userID],
      errors: errors.array()
    };
    res.status(403);
    return res.render("login", templateVars);
  }

  req.session.userID = user.id;


  res.redirect('/');
});


module.exports = router;
