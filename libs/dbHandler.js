const mongoose = require('mongoose')

module.exports = {
  initialize: function () {
    mongoose.Promise = global.Promise
    var mongoDB = 'mongodb://Mehdi22:ImmerBereit23@ds139690.mlab.com:39690/mehdidatabasea2'
    mongoose.connect(mongoDB, { useNewUrlParser: true })
    var db = mongoose.connection
    db.on('connected', function () { console.log('Mongoose connection open.') })
    db.on('error', console.error.bind(console, 'MongoDB connection error!!'))
    db.on('disconnected', function () { console.log('Mongoose connection disconnected.') })

    process.on('SIGINT', function () {
      db.close(function () {
        console.log('Database connection terminated')
        process.exit(0)
      })
    })
  }
}
