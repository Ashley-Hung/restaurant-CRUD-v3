/* Require package used in the project */
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production ') require('dotenv').config()

const routes = require('./routes') // 引用路由器
require('./config/mongoose')
const usePassport = require('./config/passport') // 要在 express-session 以後
const app = express()
const PORT = process.env.PORT

/* Setting view engine */
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: {
      ifEquals: (select, selectValue, options) => {
        'use strict'
        return select === selectValue ? 'selected' : ''
      },
      checkLength: (restaurants, options) => {
        'use strict'
        return restaurants.length < 2 ? options.fn(this) : options.inverse(this)
      }
    }
  })
)
app.set('view engine', 'handlebars')

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(express.static('public')) // setting static files
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app) // 寫在路由前
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.use(routes)

/* Start and Listen on the server */
app.listen(PORT, () => {
  console.log(`App is listening on localhost:${PORT}`)
})
