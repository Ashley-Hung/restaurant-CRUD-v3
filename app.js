/* Require package used in the project */
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const routes = require('./routes') // 引用路由器
const usePassport = require('./config/passport') // 要在 express-session 以後
require('./config/mongoose')
const app = express()
const port = 3000

/* Setting view engine */
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: {
      ifEquals: function (select, selectValue) {
        return select === selectValue ? 'selected' : ''
      }
    }
  })
)
app.set('view engine', 'handlebars')

app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true
  })
)
app.use(express.static('public')) // setting static files
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app) // 寫在路由前
app.use(routes)

/* Start and Listen on the server */
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
