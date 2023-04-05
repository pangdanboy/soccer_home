const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { secretOrKey, userAvatar, serverInfo } = require('../../global/config')
const passport = require('passport')
const { commonThrow } = require('../../utlis/throw')
const { sendEmail, random } = require('../../utlis/tools')

const { User } = require('../../utlis/db/mongoose/models/user')

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
  const userAvatarUrl = userAvatar[random(0, 1)]
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
        username: req.body.username,
        signature: '中国足球的未来',
        avatar: serverInfo.url + ':' + serverInfo.port + userAvatarUrl,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || 0,
        freeTimeList: []
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
        return res.json({
          code: 400,
          data: {
            password: '密码错误！'
          },
          success: false,
          message: '密码错误！'
        })
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
      signature: req.user.signature,
      avatar: req.user.avatar,
      role: req.user.role,
      email: req.user.email
    },
    message: '查询成功！'
  })
})

/**
 * path: api/user/edit
 * des: 修改用户信息接口, 基础信息修改(0) || 绑定邮箱修改(1) || 密码修改(2) || 时间协作数据修改(3)
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
  // 信息修改的类型
  const type = req.body.type
  // 定义统一返回信息
  const returnInfo = {
    code: 200,
    success: true,
    data: {},
    message: ''
  }
  switch (type) {
    case '0':
      user.username = req.body.username
      user.signature = req.body.signature
      returnInfo.data.username = req.body.username
      returnInfo.data.signature = req.body.signature
      break
    case '1':
      // 查找用户表中是否存在当前需要绑定的邮箱，单独返回数据
      // eslint-disable-next-line no-case-declarations
      const email = req.body.email
      returnInfo.data.email = req.body.email
      User.findOne({ email }).then(user => {
        if (user) {
          returnInfo.data.code = 400
          returnInfo.data.success = false
          returnInfo.data.message = '邮箱已被绑定！'
          return res.json(returnInfo)
        }
        user.email = req.body.email
        returnInfo.data.message = '修改成功！'
        user.save().then(saveRes => {
          return res.json(returnInfo)
        }).catch(saveError => {
          commonThrow(res, saveError)
        })
      })
      break
    case '2':
      // 校验用户密码是否与原来一致，该过程为异步，所以单独返回数据
      bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
          returnInfo.code = 400
          returnInfo.success = false
          returnInfo.message = '密码未修改，取消保存！'
          return res.json(returnInfo)
        } else {
          // 密码不一致，加密新修改的密码
          // eslint-disable-next-line node/handle-callback-err
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
              if (err) commonThrow(res, err)
              user.password = hash
              returnInfo.message = '修改成功'
              user.save().then(saveRes => {
                return res.json(returnInfo)
              }).catch(saveError => {
                commonThrow(res, saveError)
              })
            })
          })
        }
      })
      break
    case '3':
      user.freeTimeList = req.body.freeTimeList
      break
  }
  // 统一返回修改结果(基础信息，时间协作数据)
  user.save().then(saveRes => {
    returnInfo.message = '修改成功'
    return res.json(returnInfo)
  }).catch(err => {
    commonThrow(res, err)
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
      code: 200,
      success: true,
      data: {
        id: req.user.id,
        username: req.user.username,
        signature: req.user.signature,
        avatar: req.user.avatar,
        role: req.user.role,
        email: req.user.email
      },
      message: '查询成功！'
    })
  }).catch(err => {
    console.log(err)
    commonThrow(res, err)
  })
})

module.exports = router