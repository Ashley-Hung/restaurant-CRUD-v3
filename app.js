/* Require package used in the project */
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')
const app = express()
const port = 3000
const db = mongoose.connection

/* Database connection and statement */
mongoose.connect('mongodb://localhost/restaurants', {
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

/* Setting static files */
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

/* Route setting */
// home page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// Create
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//search page
app.get('/search', (req, res) => {
  const { keyword } = req.query
  const trimmedKeyword = keyword.trim().toLowerCase()
  // search by name or category
  const restaurants = restaurantList.filter(restaurant => {
    return (
      restaurant.name.toLowerCase().includes(trimmedKeyword) ||
      restaurant.name_en.toLowerCase().includes(trimmedKeyword) ||
      restaurant.category.toLowerCase().includes(trimmedKeyword)
    )
  })

  res.render('index', { restaurants, keyword })
})

// show page
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.find(restaurant => restaurant.id === Number(req.params.restaurant_id))

  res.render('show', { restaurant })
})

/* Start and Listen on the server */
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
