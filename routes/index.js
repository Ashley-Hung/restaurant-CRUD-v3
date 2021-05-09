const express = require('express')
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
// const search = require('./modules/search')
// const sort = require('./modules/sort')
const router = express.Router()

router.use('/', home)
router.use('/restaurants', restaurants)
// router.use('/search', search)
// router.use('/sort', sort)

module.exports = router
