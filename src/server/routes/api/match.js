const express = require('express')
const router = express.Router()
const passport = require('passport')
const { Match } = require('./../../utlis/db/mongoose/models/match')
const { commonThrow } = require('../../utlis/throw')
// const { verifyUserRole } = require('./../../utlis/tools')
// const { USER_PERMISSIONS } = require('./../../global/config')

/**
 * 比赛创建
 */
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  // 校验用户角色
  // if (verifyUserRole(req.user.role, USER_PERMISSIONS.COMMON_USER)) {
  //   authThrow(res)
  // }
  // 创建比赛
  const newMatch = new Match({
    createMatchUserId: req.body.userId,
    matchName: req.body.matchName,
    matchDate: req.body.matchDate,
    matchClassTime: req.body.matchClassTime,
    matchArea: req.body.matchArea,
    matchType: req.body.matchType,
    matchDescription: req.body.matchDescription,
    matchGamerList: req.body.matchGamerList
  })
  newMatch.save().then(match => {
    return res.json({
      code: 200,
      data: match,
      message: '创建成功！',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 比赛列表查询
 * 查询参数： matchDate(比赛日期),matchSearch(比赛名称),matchType(比赛类型)
 */
router.post('/queryMatch', (req, res) => {
  // 处理查询参数
  const query = {
    matchName: { $regex: req.body.matchSearch || '' }
  }
  if (req.body.matchType) query.matchType = req.body.matchType
  if (req.body.matchDate && req.body.matchDate.length !== 0) query.matchDate = { $gte: new Date(req.body.matchDate[0]), $lte: req.body.matchDate[1] ? new Date(req.body.matchDate[1]) : new Date(req.body.matchDate[0]) }
  // 需要分页查询
  if (req.body.page && req.body.limit) {
    const options = {
      page: req.body.page,
      limit: req.body.limit,
      sort: { _id: -1 },
      lean: true
    }
    Match.paginate(query, options).then(matchList => {
      return res.json({
        code: 200,
        count: matchList.totalDocs,
        data: matchList.docs,
        message: '查询成功',
        success: true
      })
    }).catch(err => {
      commonThrow(res, err)
    })
  } else { // 不要分页查询
    Match.find(query).then(matchList => {
      return res.json({
        code: 200,
        data: matchList,
        message: '查询成功',
        success: true
      })
    }).catch(err => {
      commonThrow(res, err)
    })
  }
})

/**
 * 用户参加比赛
 */
router.post('/joinMatch', passport.authenticate('jwt', { session: false }), (req, res) => {
  const joinUserId = req.user._id.toString()
  const joinMatchId = req.body.matchId
  Match.updateOne({ _id: joinMatchId }, { $push: { matchGamerList: joinUserId } }).then(match => {
    return res.json({
      code: 200,
      data: {},
      message: '参加成功',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 用户退出比赛
 */
router.post('/quitMatch', passport.authenticate('jwt', { session: false }), (req, res) => {
  const quitUserId = req.user._id.toString()
  const quitMatchId = req.body.matchId
  Match.updateOne({ _id: quitMatchId }, { $pull: { matchGamerList: quitUserId } }).then(match => {
    return res.json({
      code: 200,
      data: {},
      message: '退出成功',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 查询用户参加的比赛列表
 */
router.post('/userJoinMatch', passport.authenticate('jwt', { session: false }), (req, res) => {
  const joinUserId = req.user._id.toString()
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    sort: { _id: -1 },
    lean: true
  }
  const query = {
    matchGamerList: { $elemMatch: { $eq: joinUserId } }
  }
  Match.paginate(query, options).then(matchList => {
    return res.json({
      code: 200,
      count: matchList.totalDocs,
      data: matchList.docs,
      message: '查询成功',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 根据id查询比赛信息
 */
router.get('/getMatchById', (req, res) => {
  const matchId = req.query.matchId
  Match.findOne({ _id: matchId }).then(match => {
    return res.json({
      code: 200,
      data: match,
      message: '查询成功',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})
/**
 * 比赛api，用于比赛创建及管理
 * @type {Router}
 */
module.exports = router
