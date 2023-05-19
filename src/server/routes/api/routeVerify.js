const express = require('express')
const router = express.Router()
const passport = require('passport')
const { USER_PERMISSIONS, USER_ROLE_ROUTES } = require('./../../global/config')
// const { commonThrow } = require('../../utlis/throw')

router.post('/verifyRole', passport.authenticate('jwt', { session: false }), (req, res) => {
  // 用户角色
  const userRole = req.user.role
  // 用户访问的路由名称
  const viewRoute = req.body.viewRoute
  let userIn = true
  // 校验用户访问路由是否在对应角色可以访问的路由中
  switch (userRole) {
    case USER_PERMISSIONS.SUPER_ADMIN:
      userIn = USER_ROLE_ROUTES.SUPER_ADMIN.routes.includes(viewRoute)
      break
    case USER_PERMISSIONS.ADMIN:
      userIn = USER_ROLE_ROUTES.ADMIN.routes.includes(viewRoute)
      break
    case USER_PERMISSIONS.COMMON_USER:
      userIn = USER_ROLE_ROUTES.COMMON_USER.routes.includes(viewRoute)
      break
  }
  return res.json({
    code: 200,
    data: {
      userIn: userIn
    },
    success: true,
    message: userIn ? '鉴权通过' : '无权访问'
  })
})
// 验证用户是否有权限访问指定路由
module.exports = router
