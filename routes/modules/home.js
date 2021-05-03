const express = require('express')
const Restaurant = require('../../models/restaurant')

const router = express.Router()

// home page
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

module.exports = router
