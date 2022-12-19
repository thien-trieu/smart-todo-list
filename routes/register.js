const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {

  res.render('register');
});

router.post('/', (req, res) => {
  const userName = req.body.name
  const userEmail = req.body.email
  const userPassword = req.body.password

  res.redirect('/')
})

module.exports = router;
