const express = require('express');
const app = express();
const router = express.Router();
const { body, check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../db/queries/users');
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


app.use(cookieSession({
  name: 'session',
  keys: ["justOneRandomString"]
}));

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
