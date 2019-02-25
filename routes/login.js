
const router = require('express').Router()
const User = require('../models/User')

router.route('/')
  .get(function (req, res) { res.render('authentication/login', { csrfToken: req.csrfToken() }) })
  .post(function (req, res) {
    let newUsername = req.body.username
    let newPassword = req.body.password

    let user = new User({
      username: newUsername,
      password: newPassword
    })

    User.findOne({ 'username': user.username }, function (err, user) {
      if (err) { console.log(err) }
      if (user) {
        user.comparePassword(newPassword, function (err, isMatch) {
          if (err) { console.log(err) }
          if (isMatch) {
            req.session.regenerate(function () {
              req.session.flash = {
                type: 'success card-panel',
                message: `Welcome ${user.username} you are logged in !`
              }
              req.session.user = user.username
              res.redirect('/snippet')
            })
          } else {
            req.session.flash = {
              type: 'failure card-panel',
              message: 'Password is incorrect'
            }
            res.redirect('/login')
          }
        })
      } else {
        req.session.flash = {
          type: 'failure card-panel',
          message: 'Username is not isMatch'
        }
        res.redirect('/login')
      }
    })
  })

module.exports = router
