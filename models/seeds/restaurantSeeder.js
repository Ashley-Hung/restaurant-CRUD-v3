const mongoose = require('mongoose')
const Restaurant = require('../restaurant') // 載入 restaurant model
const restaurantList = require('./restaurant.json')

/* Database connection and statement */
mongoose.connect('mongodb://localhost/restaurant-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection // 取得資料庫連線狀態

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  Restaurant.create(...restaurantList.results)
  console.log('done')
})
