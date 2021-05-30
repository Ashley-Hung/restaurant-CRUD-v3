const express = require('express')
const { body, validationResult } = require('express-validator')
const restaurant = require('../../models/restaurant')
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

router.post('/',
  [
    body('name').trim().escape().notEmpty().withMessage('name is required'),
    body('name_en').trim().escape().matches(/^[0-9a-zA-Z_ ]*$/).optional({checkFalsy: true}).withMessage('Name(EN): English or number'),
    body('category').trim().escape().optional({checkFalsy: true}),
    body('image').trim().isURL().optional({checkFalsy: true}).withMessage('please enter URL of any image.'),
    body('location').trim().escape().notEmpty().withMessage('location is required'),
    body('phone').trim().notEmpty().withMessage('phone is required').bail().isInt().withMessage('please enter phone number without space and character'),
    body('google_map').trim().matches(/https:\/\/goo\.gl\/maps\/[a-zA-Z0-9]+/).optional({checkFalsy: true}).withMessage('請使用 Google Map 分享功能裡的連結。'),
    body('rating').trim().escape().isFloat({ min: 1, max: 5 }).optional({checkFalsy: true}).withMessage('rating: please enter a valid number between 1-5.'),
    body('description').trim().escape().optional({checkFalsy: true})
  ],
  (req, res) => {
    const errors = validationResult(req)
    const userId = req.user._id
    const restaurant = req.body

    if (!errors.isEmpty()) return res.render('new', { errors: errors.mapped(), restaurant })

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

router.put('/:id',
  [
    body('name').trim().escape().notEmpty().withMessage('name is required'),
    body('name_en').trim().escape().matches(/^[0-9a-zA-Z_ ]*$/).optional({checkFalsy: true}).withMessage('Name(EN): English or number'),
    body('category').trim().escape().optional({checkFalsy: true}),
    body('image').trim().isURL().optional({checkFalsy: true}).withMessage('please enter URL of any image.'),
    body('location').trim().escape().notEmpty().withMessage('location is required'),
    body('phone').trim().notEmpty().withMessage('phone is required').bail().isInt().withMessage('please enter phone number without space and character'),
    body('google_map').trim().matches(/https:\/\/goo\.gl\/maps\/[a-zA-Z0-9]+/).optional({checkFalsy: true}).withMessage('請使用 Google Map 分享功能裡的連結。'),
    body('rating').trim().escape().isFloat({ min: 1, max: 5 }).optional({checkFalsy: true}).withMessage('rating: please enter a valid number between 1-5.'),
    body('description').trim().escape().optional({checkFalsy: true})
  ],
  (req, res) => {
    const errors = validationResult(req)
    const userId = req.user._id
    const _id = req.params.id

    // FIXME: bug 出現第一次錯誤後，無法取得餐廳的 id
    req.body._id = req.path.slice(1)

    if (!errors.isEmpty()) return res.render('edit', { errors: errors.mapped(), restaurant: req.body })

    return Restaurant.findOneAndUpdate({ _id, userId }, req.body)
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
