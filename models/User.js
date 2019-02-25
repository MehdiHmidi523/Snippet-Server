const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const UserDB = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Password validation
UserDB.path('password').validate(function (password) {
  return password.length > 5
}, 'password must be at least 6 characters')

// hash the password before saving in the database
UserDB.pre('save', function (next) {
  let user = this

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err)
    }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash

      next()
    })
  })
})

UserDB.methods.comparePassword = function (inputPassword, callback) {
  const user = this
  bcrypt.compare(inputPassword, user.password, function (err, isMatch) {
    if (err) { return callback(err) }
    callback(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserDB)
