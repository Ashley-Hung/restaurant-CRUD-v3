/* Require package used in the project */
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes') // 引用路由器
const app = express()
const port = 3000
const db = mongoose.connection

/* Database connection and statement */
mongoose.connect('mongodb://localhost/restaurant-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

/* Setting view engine */
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public')) // setting static files
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes) // 將 request 導入路由器

/* Start and Listen on the server */
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
