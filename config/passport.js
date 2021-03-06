const passport = require('passport')
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化 passport
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      (req, email, password, done) => {
        User.findOne({ email })
          .then(user => {
            if (!user) {
              return done(null, false, req.flash('warning_msg', 'That email is not registered!'))
            }
            return bcrypt.compare(password, user.password).then(isMatch => {
              if (!isMatch)
                return done(null, false, req.flash('warning_msg', 'Email or Password incorrect.'))
              return done(null, user)
            })
          })
          .catch(err => done(err, false))
      }
    )
  )

  // Facebook
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({ email }).then(user => {
          if (user) return done(null, user)

          const randomPassword = Math.random().toString(32).slice(-8)
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({ name, email, password: hash }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
      }
    )
  )

  // 設定序列化與返序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
