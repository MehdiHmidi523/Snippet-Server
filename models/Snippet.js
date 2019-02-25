
const mongoose = require('mongoose')
const snippetDB = mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  createdBy: { type: String, required: true },
  updatedAt: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Snippet', snippetDB)
