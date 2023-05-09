const express = require('express')
const router = express.Router()
const passport = require('passport')
const { Area } = require('./../../utlis/db/mongoose/models/area')
const { commonThrow, authThrow } = require('../../utlis/throw')
const { verifyUserRole } = require('./../../utlis/tools')
const { USER_PERMISSIONS } = require('./../../global/config')

/**
 * 添加场地
 */
router.post('/addArea', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userRole = req.user.role
  if (!verifyUserRole(userRole, USER_PERMISSIONS.SUPER_ADMIN)) {
    return authThrow(res)
  }
  const newArea = new Area({
    areaName: req.body.areaName,
    areaPosition: req.body.areaPosition,
    areaStatus: req.body.areaStatus,
    areaCover: req.body.areaCover
  })
  newArea.save().then(area => {
    return res.json({
      code: 200,
      data: area,
      success: true,
      message: '添加成功！'
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 查询场地信息
 */
router.post('/queryArea', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userRole = req.user.role
  if (!verifyUserRole(userRole, USER_PERMISSIONS.SUPER_ADMIN)) {
    return authThrow(res)
  }
  const query = {}
  if (req.body.areaSearch) query.areaName = req.body.areaSearch
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    sort: { _id: -1 },
    lean: true
  }
  Area.paginate(query, options).then(areaList => {
    return res.json({
      code: 200,
      count: areaList.totalDocs,
      data: areaList.docs,
      message: '查询成功',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

module.exports = router
