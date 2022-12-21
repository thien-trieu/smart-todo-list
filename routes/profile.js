const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, check, validationResult } = require("express-validator");
const { getUserByEmail, getUserById, editUserEmail } = require('../db/queries/users');


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
  check("email").notEmpty().withMessage("The email field cannot be empty!"),
  body("email")
    .custom((value) => {
      const result = getUserByEmail(value)
        .then((data) => {
          user = data[0];

          if (user) {
            throw new Error("The email already exist.");
          }
          return Promise.resolve(true);
        });
      return result;
    })
], (req, res) => {

  const userId = req.session.userID;
  const newEmail = req.body.email;

  const errors = validationResult(req);

  // if errors, display them
  if (!errors.isEmpty()) {

    getUserById(userId).then((result) => {
      // console.log('RESULTS', result);

      return result;
    }).then((user) => {

      const templateVars = {
        user: user,
        errors: errors.array()
      };

      res.render('profile', templateVars);
    });

  } else {


    // if no errors we can edit user's email in db
    editUserEmail(newEmail, userId).then(() => {
      console.log(user);
      res.redirect('profile');
    });
  }

});


module.exports = router;
