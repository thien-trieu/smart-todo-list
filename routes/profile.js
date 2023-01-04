
const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { getUserByEmail, getUserById, editUser } = require('../db/queries/users');

// PROFILE get request:
router.get('/', (req, res) => {

  // If user is not logged in, they will be redirected to login
  const userId = req.session.userID;
  if (!userId) {
    return res.redirect("/login");
  }

  // Get user, to display user info on PROFILE page.
  getUserById(userId).then((user) => {

    const templateVars = {
      user,
      errors: null
    };
    return res.render('profile', templateVars);
  });

});

// PROFILE Post Request: Express Validator to check inputs (user's 'email' or 'city' update)
router.post('/', [
  body("email")
    .custom((value) => {
      // Check the database to see if the updated 'email' already exist in the datebase
      const result = getUserByEmail(value)
        .then((data) => {
          const user = data[0];

          // if the email already exist in database then profile can not be updated
          if (user) {

            // checking the existing user details
            console.log('Email update request for PROFILE...Can not use this email. User email exist: ', user);

            throw new Error("The email already exist.");
          }
          return Promise.resolve(true);
        });
      return result;
    }),
  body("city").trim().toLowerCase()

], (req, res) => {

  const userId = req.session.userID;

  // receive any error from express validator
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    // if any errors, render the PROFILE page and display the errors
    getUserById(userId).then((result) => {
      return result;
    }).then((user) => {
      const templateVars = {
        user,
        errors: errors.array()
      };
      res.render('profile', templateVars);
    });

  } else {

    // User's profile update request
    const email = req.body.email;
    const city = req.body.city;

    const profileUpdates = {
      email,
      city,
    };

    console.log('Profile Update Request. Item(s) being updated: ', profileUpdates);

    // profile updates sent to database
    editUser(profileUpdates, userId).then(() => {
      res.redirect('profile');
    });

  }

});

module.exports = router;
