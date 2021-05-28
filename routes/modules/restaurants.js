const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

/* Route setting */
//Search page
router.get('/search', (req, res) => {
  const { keyword } = req.query
  const trimmedKeyword = keyword.trim()

  // search by name or category
  return Restaurant.find({
    $and: [
      {
        $or: [
          { name: { $regex: trimmedKeyword, $options: 'i' } }, // i: case-insensitive
          { name_en: { $regex: trimmedKeyword, $options: 'i' } },
          { category: { $regex: trimmedKeyword, $options: 'i' } }
        ]
      },
      { userId: { $eq: req.user._id } }
    ]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

// Sort
router.get('/sort', (req, res) => {
  const userId = req.user._id
  const { select } = req.query

  Restaurant.find({ userId })
    .lean()
    .sort(select)
    .then(restaurants => res.render('index', { restaurants, select }))
    .catch(error => console.log(error))
})

// Create
router.get('/new', (req, res) => {
  res.render('new')
})

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('location').trim().notEmpty().withMessage('location is required'),
    body('phone').trim().notEmpty().withMessage('phone is required')
  ],
  (req, res) => {
    const errors = validationResult(req)
    const userId = req.user._id
    const restaurant = req.body

    if (!errors.isEmpty()) res.render('new', { errors: errors.mapped(), restaurant })

    return Restaurant.create({ ...restaurant, userId })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  }
)

// Read
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// Update
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('location').trim().notEmpty().withMessage('location is required'),
    body('phone').trim().notEmpty().withMessage('phone is required')
  ],
  (req, res) => {
    const errors = validationResult(req)
    const userId = req.user._id
    const _id = req.params.id

    if (!errors.isEmpty()) res.render('edit', { errors: errors.mapped(), restaurant: req.body })

    return Restaurant.findOne({ _id, userId })
      .then(restaurant => {
        restaurant = Object.assign(restaurant, req.body)
        return restaurant.save()
      })
      .then(() => res.redirect(`/restaurants/${_id}`))
      .catch(error => console.log(error))
  }
)

// Delete
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
