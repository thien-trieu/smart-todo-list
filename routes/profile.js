
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const { getUserByEmail, getUserById, editUser } = require('../db/queries/users');

router.get('/', (req, res) => {

  const userId = req.session.userID;

  if (!userId) {
    return res.redirect("/login");
  }

  getUserById(userId).then((user) => {

    const templateVars = {
      user,
      errors: null
    };
    return res.render('profile', templateVars);
  });

});

// update profile email
router.post('/', [

  body("email")
    .custom((value) => {
      const result = getUserByEmail(value)
        .then((data) => {
          const user = data[0];

          console.log('USER EXIST?', user);

          if (user) {
            throw new Error("The email already exist.");
          }
          return Promise.resolve(true);
        });
      return result;
    }),
  body("city").trim().toLowerCase()

], (req, res) => {

  const userId = req.session.userID;
  const email = req.body.email;
  const city = req.body.city;

  const profileUpdates = {
    email,
    city,
  };
  // receive any error from express validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    getUserById(userId).then((result) => {

      return result;
    }).then((user) => {

      const templateVars = {
        user: user,
        errors: errors.array()
      };

      // ensure correct errors and user info is passed through to template vars after checking for errors
      console.log('TEMPLATE', templateVars);

      res.render('profile', templateVars);
    });

  } else {

    editUser(profileUpdates, userId).then(() =>  {

      res.redirect('profile');
    });

  }

});

module.exports = router;
