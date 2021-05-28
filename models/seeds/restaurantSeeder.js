if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const bcrypt = require('bcryptjs')
const Restaurant = require('../restaurant') // 載入 restaurant model
const User = require('../user')
const restaurantList = require('./restaurant.json')
const userList = require('./user.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  userList.results.forEach((user, index) => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash => User.create({ name: user.name, email: user.email, password: hash }))
      .then(async user => {
        // user[0]: restaurant[0~2]; user[1]: restaurant[3~5];
        const restaurants = index ? restaurantList.results.slice(3, 6) : restaurantList.results.slice(0, 3)

        restaurants.map(restaurant => {
          restaurant['userId'] = user._id
        })

        await Restaurant.create(restaurants)
      })
      .then(() => {
        console.log('done')
        process.exit()
      })
  })
})
