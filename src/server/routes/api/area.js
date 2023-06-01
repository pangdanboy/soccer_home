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
    console.log(err)
    commonThrow(res, err)
  })
})

/**
 * 查询场地信息列表
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

/**
 * 修改场地状态
 */
router.post('/changeStatus', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userRole = req.user.role
  const areaId = req.body.areaId
  const status = req.body.areaStatus
  if (!verifyUserRole(userRole, USER_PERMISSIONS.SUPER_ADMIN)) {
    return authThrow(res)
  }
  Area.updateOne({ _id: areaId }, { areaStatus: status }).then(updateRes => {
    return res.json({
      code: 200,
      data: [],
      success: true,
      message: '修改成功！'
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 删除场地
 */
router.post('/deleteArea', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userRole = req.user.role
  const areaId = req.body.areaId
  if (!verifyUserRole(userRole, USER_PERMISSIONS.SUPER_ADMIN)) {
    return authThrow(res)
  }
  Area.deleteOne({ _id: areaId }).then(deleteRes => {
    return res.json({
      code: 200,
      data: [],
      success: true,
      message: '修改成功！'
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 编辑场地信息
 */
router.post('/editArea', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userRole = req.user.role
  const areaId = req.body.areaId
  if (!verifyUserRole(userRole, USER_PERMISSIONS.SUPER_ADMIN)) {
    return authThrow(res)
  }
  const updateColumns = {
    areaName: req.body.areaName,
    areaPosition: req.body.areaPosition,
    areaStatus: req.body.areaStatus,
    areaCover: req.body.areaCover
  }
  Area.updateOne({ _id: areaId }, updateColumns).then(deleteRes => {
    return res.json({
      code: 200,
      data: [],
      success: true,
      message: '修改成功！'
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

module.exports = router
