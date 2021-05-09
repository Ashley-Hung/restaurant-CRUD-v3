const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

/* Route setting */
//Search page
router.get('/search', (req, res) => {
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

// Sort
router.get('/sort', (req, res) => {
  const { select } = req.query

  Restaurant.find()
    .lean()
    .sort(select)
    .then(restaurants => res.render('index', { restaurants, select }))
    .catch(error => console.log(error))
})

// Create
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Read
router.get('/:restaurant_id', (req, res) => {
  const { restaurant_id } = req.params

  return Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// Update
router.get('/:id/edit', (req, res) => {
  const { id } = req.params
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const { id } = req.params
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
