const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { secretOrKey } = require('./../global/config')
const { User } = require('./../utlis/db/mongoose/models/user')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secretOrKey

module.exports = passport => {
  // eslint-disable-next-line camelcase
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload)
    User.findById(jwt_payload.id).then((user) => {
      if (user) {
        return done(null, user)
      }
      return done(null, false)
    }).catch((err) => {
      console.log(err)
    })
  })
  )
}
