/* Require package used in the project */
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Restaurant = require('./models/restaurant')
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

/* Route setting */
// home page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

//search page
app.get('/search', (req, res) => {
  const { keyword } = req.query
  const trimmedKeyword = keyword.trim()

  // search by name or category
  return Restaurant.find({
    $or: [
      { name: { $regex: trimmedKeyword, $options: 'i' } }, // i: case-insensitive
      { name_en: { $regex: trimmedKeyword, $options: 'i' } },
      { category: { $regex: trimmedKeyword, $options: 'i' } }
    ]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

// Create
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Read
app.get('/restaurants/:restaurant_id', (req, res) => {
  const { restaurant_id } = req.params

  return Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// Update
app.get('/restaurants/:id/edit', (req, res) => {
  const { id } = req.params
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
  const { id } = req.params

  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// Delete
app.delete('/restaurants/:id', (req, res) => {
  const { id } = req.params
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

/* Start and Listen on the server */
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
