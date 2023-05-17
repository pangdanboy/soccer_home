const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const message = {
  // 接收消息的用户id，指定为ObjectId类型与用户_id匹配
  userId: {
    type: mongoose.Types.ObjectId,
    require: true
  },
  // 比赛类型
  messageType: {
    type: String,
    require: true
  },
  // 比赛名称
  matchName: {
    type: String,
    require: true
  },
  // 比赛最新日期
  matchDate: {
    type: Date,
    required: true
  },
  // 变动字段
  changeColumn: {
    type: String,
    required: true
  },
  // 创建时间
  createTime: {
    type: Date,
    required: true,
    default: Date.now()
  }
}
const messageSchema = new mongoose.Schema(message, { minimize: false })
messageSchema.plugin(mongoosePaginate)
const Message = mongoose.model('message', messageSchema, 'message')
module.exports = {
  Message
}
