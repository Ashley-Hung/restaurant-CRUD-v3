const express = require('express')
const Restaurant = require('../../models/restaurant')
const router = express.Router()

//search page
router.get('/', (req, res) => {
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

// module.exports = router
