const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const { select } = req.query

  Restaurant.find()
    .lean()
    .sort(select)
    .then(restaurants => res.render('index', { restaurants, select }))
    .catch(error => console.log(error))
})

// module.exports = router
