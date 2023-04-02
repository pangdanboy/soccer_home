const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { secretOrKey } = require('./../global/config')
const passport = require('passport')
const { commonThrow } = require('./../utlis/throw')
const { sendEmail } = require('./../utlis/tools')

const { User } = require('./../utlis/db/mongoose/models/user')

/**
 * path: api/user/register
 * des: 用户注册接口
 * return: {
 *   // 状态码
 *   code: '',
 *   // 数据
 *   data: {},
 *   // 提示信息
 *   message: '',
 *   // 是否成功标志
 *   success: true||false
 * }
 */
router.post('/register', (req, res) => {
  const userEmail = req.body.email
  // 判断用户输入邮箱是否已经注册
  User.findOne({ email: userEmail }).then(user => {
    if (user) {
      return res.json({
        code: 400,
        data: {},
        message: '邮箱已被注册！',
        success: false
      })
    } else {
      // 创建新用户，加密密码
      const newUser = new User({
        username: res.body.username,
        signature: '中国足球的未来',
        email: res.body.email,
        password: res.body.password,
        role: res.body.role || 0,
        freeTimeList: res.body.freeTimeList
      })
      // eslint-disable-next-line node/handle-callback-err
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) throw err
          newUser.password = hash
          // 保存加密后的用户
          newUser.save().then(user => {
            return res.json({
              code: 200,
              data: user,
              message: '注册成功！',
              success: true
            })
          }).catch(err => {
            console.log(err)
            commonThrow(res, err)
          })
        })
      })
    }
  }).catch(err => {
    console.log(err)
    commonThrow(res, err)
  })
})

/**
 * path: api/user/login
 * des: 用户登录接口
 * return: {
 *   // 状态码
 *   code: '',
 *   // 数据
 *   data: {},
 *   // 提示信息
 *   message: '',
 *   // 是否成功标志
 *   success: true||false
 * }
 */
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  // 查询数据库
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.json({
        code: 404,
        data: {},
        message: '用户不存在！'
      })
    }
    // 匹配密码，当前前端传入密码与找到用户的密码进行匹配
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // jwt.sign('规则','加密名字','过期时间','回调函数')
        const rule = { id: user.id, name: user.username }
        // eslint-disable-next-line node/handle-callback-err
        jwt.sign(rule, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err
          res.json({
            code: 200,
            success: true,
            data: {
              token: 'Bearer ' + token
            },
            message: '登录成功！'
          })
        })
      } else {
        return res.json({ code: 400, password: '密码错误！' })
      }
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * path: api/user/verify
 * des: 发送邮箱验证码接口
 * return: {
 *   // 状态码
 *   code: '',
 *   // 数据
 *   data: {},
 *   // 提示信息
 *   message: '',
 *   // 是否成功标志
 *   success: true||false
 * }
 */
router.get('/verify', (req, res) => {
  const verifyCode = Math.floor(Math.random() * 1000000)
  const code = sendEmail(req.query.email, verifyCode)
  if (code) {
    return res.json({
      code: 200,
      data: {
        email: req.query.email,
        verifyCode: verifyCode
      },
      message: '发送验证码成功！',
      success: true
    })
  }
  return res.json({
    code: 404,
    data: {},
    message: '邮箱不存在！',
    success: false
  })
})

/**
 * path: api/user/current
 * des: 返回当前登录用户信息接口
 * return: {
 *   // 状态码
 *   code: '',
 *   // 数据
 *   data: {},
 *   // 提示信息
 *   message: '',
 *   // 是否成功标志
 *   success: true||false
 * }
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    code: 200,
    success: true,
    data: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      email: req.user.email,
      freeTimeList: req.user.freeTimeList
    },
    message: '查询成功！'
  })
})

/**
 * path: api/user/edit
 * des: 修改用户信息接口, 基础信息修改 || 绑定邮箱修改 || 密码修改 || 时间协作数据修改
 * return: {
 *   // 状态码
 *   code: '',
 *   // 数据
 *   data: {},
 *   // 提示信息
 *   message: '',
 *   // 是否成功标志
 *   success: true||false
 * }
 */
router.put('/edit', passport.authenticate('jwt', { session: false }), (req, res) => {
  // 当前需要修改信息的用户
  const user = req.user
  const type = req.body.type
  switch (type) {
    case '0':
      break
    case '1':
      break
    case '2':
      break
    case '3':
      break
  }
  user.username = req.body.username
  user.user_info = req.body.user_info
  user.user_web = req.body.user_web
  user.save()
  return res.json({ code: 200 })
})

/**
 * path: api/user/editEmail
 * des: 修改绑定邮箱接口
 * return: {
 *   // 状态码
 *   code: '',
 *   // 数据
 *   data: {},
 *   // 提示信息
 *   message: '',
 *   // 是否成功标志
 *   success: true||false
 * }
 */
router.put('/editEmail', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.body.email)
  // 修改之后的邮箱
  const email = req.body.email
  // 当前需要修改邮箱的用户
  const currentUser = req.user
  // 查找用户表中是否存在当前需要绑定的邮箱
  User.findOne({ email }).then(user => {
    if (user) {
      return res.json({ code: 400, email: '邮箱已被绑定' })
    }
    currentUser.email = req.body.email
    currentUser.save()
    return res.json({ code: 200 })
  })
})

/**
 * path: api/user/getUserById
 * des: 根据id查询用户信息
 * return: {
 *   // 状态码
 *   code: '',
 *   // 数据
 *   data: {},
 *   // 提示信息
 *   message: '',
 *   // 是否成功标志
 *   success: true||false
 * }
 */
router.get('/getUserById', (req, res) => {
  // eslint-disable-next-line camelcase
  const user_id = req.query.user_id
  User.findOne({ _id: user_id }).then(user => {
    console.log(user)
    res.json({
      user_name: user.name,
      user_avatar: user.avatar,
      user_info: user.user_info,
      user_web: user.user_web
    })
  }).catch(err => {
    console.log(err)
  })
})
