const mongoose = require('mongoose')
const user = {
  name: {
    type: String,
    require: true
  },
  age: {
    type: Number,
    required: true
  },
  createTime: {
    type: Date,
    required: true,
    default: Date.now()
  }
}
const userSchema = new mongoose.Schema(user, { minimize: false })
const userModel = mongoose.model('userModel', userSchema, 'user')
module.exports = {
  userModel
}
