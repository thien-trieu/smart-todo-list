const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {

  res.render('register');
});


router.post('/', (req, res) => {

  const {name, email, password} = req.body

  const userName = req.body.name
  const userEmail = req.body.email
  const userPassword = req.body.password

  console.log(req.body)

  res.redirect('/')
})

module.exports = router;
