const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const comment = {
  // 评论用户id
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  // 评论比赛id
  matchId: {
    type: String,
    required: true
  },
  // 评论内容
  content: {
    type: String,
    required: true
  },
  // 创建时间
  createTime: {
    type: String,
    required: true
  }
}
const commentSchema = new mongoose.Schema(comment, { minimize: false })
commentSchema.plugin(aggregatePaginate)
const Comment = mongoose.model('comment', commentSchema, 'comment')
module.exports = {
  Comment
}
