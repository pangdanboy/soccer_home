const express = require('express')
const router = express.Router()
const passport = require('passport')
// const { commonThrow } = require('../../utlis/throw')

router.post('/verifyRole', passport.authenticate('jwt', { session: false }), (req, res) => {
})
// 验证用户是否有权限访问指定路由
module.exports = router
