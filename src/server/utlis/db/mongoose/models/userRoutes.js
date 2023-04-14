const mongoose = require('mongoose')
const userRoute = {
  key: {
    type: String,
    require: true
  },
  routes: {
    type: Array,
    require: true
  }
}
const userRouteSchema = new mongoose.Schema(userRoute, { minimize: false })
const UserRoute = mongoose.model('userRoute', userRouteSchema, 'userRoute')
module.exports = {
  UserRoute
}
