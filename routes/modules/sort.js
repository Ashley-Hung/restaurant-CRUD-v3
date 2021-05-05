const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/:select/:sorting', (req, res) => {
  const { select, sorting } = req.params

  Restaurant.find()
    .lean()
    .sort({ [select]: sorting })
    .then(restaurants => res.render('index', { restaurants, select, sorting }))
    .catch(error => console.log(error))
})

module.exports = router
