const router = require('express').Router()
const User = require('../models/User.js')

router.route('/')
  .get(function (req, res) { res.render('authentication/registration', { csrfToken: req.csrfToken() }) })
  .post(function (req, res) {
    let newUsername = req.body.username
    let newPassword = req.body.password
    let user = new User({
      username: newUsername,
      password: newPassword
    })
    user.save().then(function () {
      req.session.flash = {
        type: 'success card-panel',
        message: 'Account created successfully!'
      }
      res.redirect('/login')
    }).catch(function (err) {
      if (err) {
        req.session.flash = {
          type: 'failure card-panel',
          message: 'Account not created! fill in unique username and a password with 6 characters'
        }
        res.redirect('/register')
      }
    })
  })

module.exports = router
