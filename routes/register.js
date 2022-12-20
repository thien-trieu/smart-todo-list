const express = require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs');
const { body, check, validationResult } = require("express-validator");

router.get('/', (req, res) => {

  res.render('register');
});


router.post('/', (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);

    const templateVars = {
      errors: errors.array(),
      user: undefined
    };
    // display the errors
    return res.render('register', templateVars);
  }

  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };

  // if registration is successful, add user info to db
  addUser(newUser)
    .then(getUserByEmail(req.body.email))
    .then((user)=> {
      console.log('user object', user);
      console.log('user.id', user.id);


      req.session.userID = user.id;
      res.redirect('/');
      return;
    });

});

module.exports = router;
