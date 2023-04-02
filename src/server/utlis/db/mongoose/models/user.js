const mongoose = require('mongoose')
const user = {
  username: {
    type: String,
    require: true
  },
  signature: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  freeTimeList: {
    type: Array,
    required: true
  },
  createTime: {
    type: Date,
    required: true,
    default: Date.now()
  }
}
const userSchema = new mongoose.Schema(user, { minimize: false })
const User = mongoose.model('user', userSchema, 'user')
module.exports = {
  User
}
