const express = require('express')
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const search = require('./modules/search')
const router = express.Router()

router.use('/', home)
router.use('/restaurants', restaurants)
router.use('/search', search)

module.exports = router
