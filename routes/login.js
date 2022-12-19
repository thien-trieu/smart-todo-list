const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});


router.post('/', (req, res) => {
  const userEmail = req.body.email
  const userPassword = req.body.password

  console.log(req.body)

  res.redirect('/')
})


module.exports = router;
