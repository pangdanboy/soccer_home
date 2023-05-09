const moment = require('moment')
const { DATE } = require('./../../global/config')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const { Match } = require('./../../utlis/db/mongoose/models/match')
const { commonThrow } = require('../../utlis/throw')

router.get('/systemInfo', passport.authenticate('jwt', { session: false }), (req, res) => {
  const nowDate = moment(Date.now()).format('YYYY-MM-DD')
  const queryDate = new Date(nowDate)
  const findArr = []
  // 查询今日比赛数量和参赛人数
  const nowDateMatchCount = Match.find({ matchDate: queryDate }).count()
  const nowDateMatchGamerList = Match.find({ matchDate: queryDate }, { matchGamerList: 1 })
  // 查询比赛总数量和总参赛人数
  const TotalMatchCount = Match.find().count()
  const TotalMatchGamerList = Match.find({}, { matchGamerList: 1 })
  findArr.push(nowDateMatchCount)
  findArr.push(nowDateMatchGamerList)
  findArr.push(TotalMatchCount)
  findArr.push(TotalMatchGamerList)
  const systemInfo = {}
  // 计算今天是这周的第几天
  const weekOfDay = DATE[parseInt(moment(Date.now()).format('E'))]
  // 当天日期与所处周的第一天
  systemInfo.nowDate = moment(Date.now()).format('YYYY-MM-DD')
  systemInfo.weekDay = weekOfDay
  Promise.all(findArr).then(info => {
    // 当天比赛数量
    systemInfo.nowDateMatchCount = info[0]
    let matchCount = 0
    let totalMatchCount = 0
    info[1].forEach(item => {
      matchCount += item.matchGamerList.length
    })
    // 当天比赛人数
    systemInfo.nowDateMatchGamerCount = matchCount
    // 历史比赛数量
    systemInfo.totalMatchCount = info[2]
    info[3].forEach(item => {
      totalMatchCount += item.matchGamerList.length
    })
    // 历史比赛人数
    systemInfo.totalMatchGamerCount = totalMatchCount
    return res.json({
      code: 200,
      data: systemInfo,
      success: true,
      message: '查询成功'
    })
  }).catch(err => {
    commonThrow(err, res)
  })
})

module.exports = router
