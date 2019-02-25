let router = require('express').Router()
let Snippet = require('../models/Snippet')

router.route('/snippet')
  .get(function (req, res) {
    Snippet.find({}, function (error, data) {
      if (error) {
        req.session.flash = {
          type: 'failure card-panel',
          message: 'Retrieval Unsuccessful'
        }
        throw new Error('Unknown database error')
      }
      let created = {
        snippets: data.map(function (snipp) {
          return {
            title: snipp.title,
            code: snipp.code,
            createdBy: snipp.createdBy,
            updatedAt: snipp.updatedAt,
            id: snipp._id,
            yours: req.session.user == snipp.createdBy
          }
        }),
        csrfToken: req.csrfToken(),
      }
      if (!req.session.user) { res.render('snippet/unknowUser', created) } else { res.render('snippet/myUser', created) }
    })
  })

router.route('/snippet/create')
  .get(authorize, function (req, res) { res.render('snippet/create', { csrfToken: req.csrfToken() }) })
  .post(function (req, res) {
    let description = req.body.snippetTitle
    let snippbody = req.body.snippetCode

    if (!description || snippbody.length === 0) {
      req.session.flash = {
        type: 'failure card-panel',
        message: 'Unsuccessful Snippet! Info missing'
      }
      res.redirect('#')
    } else {
      let snippet = new Snippet({
        title: description,
        code: snippbody,
        createdBy: req.session.user
      })
      snippet.save().then(function () {
        req.session.flash = {
          type: 'success card-panel',
          message: 'Your snippet was created successfully!'
        }
        res.redirect('/snippet')
      }).catch(function (err) { console.error(err) })
    }
  })

router.route('/snippet/delete/:id')
  .get(authorize, function (req, res) { res.render('snippet/delete', { id: req.params.id, csrfToken: req.csrfToken() }) })
  .post(function (req, res) {
    Snippet.findOneAndDelete({ _id: req.params.id }, function (err) {
      if (err) {
        req.session.flash = {
          type: 'failure card-panel',
          message: 'Could not delete snippet from the database'
        }
        throw new Error('Something went wrong while deleting the snippet')
      }
      req.session.flash = {
        type: 'success card-panel',
        message: 'Snippet deleted from repo'
      }
      res.redirect('/')
    })
  })

router.route('/snippet/edit/:id')
  .get(authorize, function (req, res) { 
    Snippet.findOne({ _id: req.params.id }, function (err, item) {
      if (err) { throw err }
      res.render('snippet/edit', { id: req.params.id, valueTitle: item.title ,valueCode: item.code ,csrfToken: req.csrfToken() }) })
   })
  .post(function (req, res) {
    let description = req.body.snippetTitle
    let snippbody = req.body.snippetCode
    let userUpdate = req.session.user
    if (!description || snippbody.length === 0 || userUpdate.length === 0) {
      req.session.flash = {
        type: 'failure card-panel',
        message: 'Update not Possible, Please fill in all the fields'
      }
      res.redirect('/snippet')
    } else {
      Snippet.findOneAndUpdate({ _id: req.params.id }, {
        title: description,
        code: snippbody,
        createdBy: userUpdate,
        updatedAt: Date.now()
      }, function (err) {
        if (err) {
          req.session.flash = {
            type: 'failure card-panel',
            message: 'Update Unsuccessful'
          }
          throw new Error('Something went wrong while editing the snippet' + '\n' + err)
        }
        req.session.flash = {
          type: 'success card-panel',
          message: 'Successful update'
        }
        res.redirect('/')
      })
    }
  })

function authorize (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.session.flash = {
      type: 'failure card-panel',
      message: '403: - Forbidden -Verboten- Prohibido'
    }
    res.redirect('/')
  }
}

module.exports = router
