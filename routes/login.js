const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require("express-validator");
const bcrypt = require('bcrypt')
const { getUserByEmail } = require('../db/queries/users')

router.get('/', (req, res) => {
  res.render('login');
});

let user ;

// express validotor
const validator = [
  check("email").notEmpty().withMessage("The email field cannot be empty!"),
  body("password")
    .custom((value, { req }) => {
      const email = req.body.email;
      console.log('password', value)
      console.log(email)
      // need to implement a call to db to get user

     user = getUserByEmail(email).then((user)=>{
      console.log('obj', user[0])

      //  if (user.email === null) {
      //    throw new Error("The email entered does not exist.");
      //  }
       // check the password in to db
      //  const passwordMatch = bcrypt.compareSync(value, user.password);

      //  if (!passwordMatch) {
      //    throw new Error("Passwords do not match.");
      //  }

       return true;
     })
    })
];

router.post('/', validator, (req, res) => {
  const errors = validationResult(req);
  console.log('error', errors)
  if (!errors.isEmpty()) {
    const templateVars = {
      user: user[req.session.userID],
      errors: errors.array()
    };
    res.status(403);
    return res.render("login", templateVars);
  }

  const email = req.body.email;
    req.session.userID = user.id;


  res.redirect('/');
});


module.exports = router;
