const express = require('express')
const router = express.Router()
const passport = require('passport')
const { Comment } = require('./../../utlis/db/mongoose/models/comment')
const { commonThrow } = require('../../utlis/throw')

/**
 * 添加评论
 */
router.post('/addComment', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userId = req.body.userId
  const matchId = req.body.matchId
  const content = req.body.content
  const nowTime = new Date().valueOf()
  const comment = new Comment({
    userId: userId,
    matchId: matchId,
    content: content,
    createTime: nowTime
  })
  comment.save().then(newComment => {
    return res.json({
      code: 200,
      data: newComment,
      success: true,
      message: '发表成功！'
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 查询比赛评论
 */
router.post('/query', (req, res) => {
  const matchId = req.body.matchId
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    sort: { _id: -1 },
    lean: true
  }
  const queryCommentUser = Comment.aggregate([
    {
      $lookup: {
        // 关联的表
        from: 'user',
        // 当前表关联的字段
        localField: 'userId',
        // 关联的表的字段
        foreignField: '_id',
        // 查询出来的关联数据
        as: 'user'
      }
    },
    {
      $project: {
        // user中返回的字段
        user: {
          username: 1,
          avatar: 1
        },
        // comment中返回的字段
        userId: 1,
        content: 1,
        matchId: 1,
        _id: 1,
        createTime: 1
      }
    },
    {
      // 查询条件
      $match: {
        matchId: matchId
      }
    }
  ])
  Comment.aggregatePaginate(queryCommentUser, options).then(comment => {
    return res.json({
      code: 200,
      data: comment.docs,
      count: comment.totalDocs,
      success: true,
      message: '查询成功！'
    })
  }).catch(err => {
    console.log(err)
    commonThrow(res, err)
  })
})

module.exports = router
