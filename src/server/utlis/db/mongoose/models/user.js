const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const user = {
  // 用户名
  username: {
    type: String,
    require: true
  },
  // 个性签名
  signature: {
    type: String,
    require: true
  },
  // 头像
  avatar: {
    type: String,
    require: true
  },
  // 邮箱
  email: {
    type: String,
    required: true
  },
  // 密码
  password: {
    type: String,
    required: true
  },
  // 角色
  role: {
    type: String,
    required: true
  },
  // 时间协作数据
  freeTimeList: {
    type: Array,
    require: true
  },
  // 创建时间
  createTime: {
    type: Date,
    required: true,
    default: Date.now()
  }
}
const userSchema = new mongoose.Schema(user, { minimize: false })
userSchema.plugin(mongoosePaginate)
const User = mongoose.model('user', userSchema, 'user')
module.exports = {
  User
}
