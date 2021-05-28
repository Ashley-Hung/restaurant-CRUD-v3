if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const Restaurant = require('../restaurant') // 載入 restaurant model
const restaurantList = require('./restaurant.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  Restaurant.create(...restaurantList.results)
  console.log('done')
})
