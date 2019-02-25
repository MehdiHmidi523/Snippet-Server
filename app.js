const express = require('express')
const bodyParser = require('body-parser')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const app = express()
const helmet = require('helmet')
require('./libs/dbHandler').initialize()

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('port', process.env.PORT || 3000)
app.set('view engine', '.hbs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  name: 'snippetsession',
  secret: '7uQO2KX5IEGWxN+rhE',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 23
  }
}))

app.use(cookieParser())
app.use(csurf({ cookie: true }))

app.use(helmet.xssFilter())
app.use(helmet.noSniff())
app.use(helmet.noCache())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.ieNoOpen())
app.use(helmet.hsts({ maxAge: 90 * 24 * 60 * 60 * 1000 }))
app.use(helmet.dnsPrefetchControl())
app.disable('strict-transport-security')
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(function (req, res, next) {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  next()
})

app.use('/', require('./routes/home.js'))
app.use('/', require('./routes/snippet.js'))
app.use('/login', require('./routes/login.js'))
app.use('/register', require('./routes/register.js'))
app.use('/logout', function (req, res) { req.session.destroy(function () { res.redirect('/') }) })

app.use(function (err, request, response, next) {
  if (err.status !== 404) { return next(err) }
  console.log(err.stack)
  response.render('error/404')
})

app.use(function (err, req, res, next) {
  if (err.status !== 500) { return next(err) }
  console.error(err.stack)
  res.status(500).render('error/500')
})

app.use(function (err, req, res, next) {
  if (err.status !== 403) { return console.error(err) }
  console.error(err.stack)
  res.status(403).render('error/403')
})

// --------------- Start the server ----------------
app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.')
})
