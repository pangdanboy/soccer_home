const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const match = {
  // 创建比赛用户id，指定为ObjectId类型与用户_id匹配
  createMatchUserId: {
    type: mongoose.Types.ObjectId,
    require: true
  },
  // 比赛名称
  matchName: {
    type: String,
    require: true
  },
  // 比赛日期
  matchDate: {
    type: Date,
    require: true
  },
  // 比赛时间(基于课表)
  matchClassTime: {
    type: String,
    require: true
  },
  // 比赛场地Id
  matchAreaId: {
    type: mongoose.Types.ObjectId,
    require: true
  },
  // 比赛类型
  matchType: {
    type: String,
    require: true
  },
  // 比赛描述
  matchDescription: {
    type: String,
    require: true
  },
  // 比赛参赛人员列表(绿色方)
  matchGamerListGreen: {
    type: Array,
    require: true
  },
  // 比赛参赛人员列表(橙色方)
  matchGamerListOrange: {
    type: Array,
    require: true
  },
  // 绿色方进球数
  GreenScore: {
    type: Number,
    require: true
  },
  // 绿色方支持数
  GreenSupport: {
    type: Number,
    require: true
  },
  // 橙色方进球数
  OrangeScore: {
    type: Number,
    require: true
  },
  // 橙色方支持数
  OrangeSupport: {
    type: Number,
    require: true
  },
  // 创建时间
  createTime: {
    type: Date,
    required: true,
    default: Date.now()
  },
  // 更新时间
  updateTime: {
    type: Date,
    required: true
  }
}
const matchSchema = new mongoose.Schema(match, { minimize: false })
matchSchema.plugin(mongoosePaginate)
const Match = mongoose.model('match', matchSchema, 'match')
module.exports = {
  Match
}
