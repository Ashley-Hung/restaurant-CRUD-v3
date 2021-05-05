/* Require package used in the project */
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes') // 引用路由器
require('./config/mongoose')
const app = express()
const port = 3000

/* Setting view engine */
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    helpers: {
      ifEquals: function (select, selectValue, sorting, sortingValue) {
        return (select === selectValue && sorting === sortingValue) ? 'selected' : ''
      }
    }
  })
)
app.set('view engine', 'handlebars')

app.use(express.static('public')) // setting static files
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes) // 將 request 導入路由器

/* Start and Listen on the server */
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
