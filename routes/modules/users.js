const express = require('express')
const User = require('../../models/user')
const router = express.Router()

// Login
router.get('/login', (req, res) => {
  res.render('login')
})

// Register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ email }).then(user => {
    if (user) {
      console.log('User already exists.')
      res.render('register', { name, email, password, confirmPassword })
    } else {
      return User.create({ name, email, password, confirmPassword })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
})
module.exports = router
