const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { secretOrKey, userAvatar, serverInfo } = require('../../global/config')
const passport = require('passport')
const { commonThrow, authThrow } = require('../../utlis/throw')
const { sendEmail, random } = require('../../utlis/tools')
const { verifyUserRole } = require('./../../utlis/tools')
const { USER_PERMISSIONS } = require('./../../global/config')
const { User } = require('../../utlis/db/mongoose/models/user')

/**
 * 用户注册接口
 */
router.post('/register', (req, res) => {
  const userEmail = req.body.email
  const userAvatarUrl = userAvatar[random(0, 7)]
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
 * 用户列表查询
 */
router.post('/queryUser', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userRole = req.user.role
  console.log(userRole)
  // 校验用户角色是否为超级管理员
  if (!verifyUserRole(userRole, USER_PERMISSIONS.SUPER_ADMIN)) {
    authThrow(res)
    return
  }
  // 处理查询参数
  const query = {
    username: { $regex: req.body.username || '' }
  }
  if (req.body.userRole) query.role = req.body.userRole
  // 分页查询配置
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    sort: { _id: -1 },
    lean: true
  }
  User.paginate(query, options).then(userList => {
    return res.json({
      code: 200,
      count: userList.totalDocs,
      data: userList.docs,
      message: '查询成功',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 重置用户密码
 */
router.post('/resetPassword', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userRole = req.user.role
  // 校验用户角色是否为超级管理员
  if (!verifyUserRole(userRole, USER_PERMISSIONS.SUPER_ADMIN)) {
    authThrow(res)
    return
  }
  // 系统默认密码
  const defaultPassword = '123456'
  // 当前用户
  const user = req.user
  // 加密密码
  // eslint-disable-next-line node/handle-callback-err
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(defaultPassword, salt, function (err, hash) {
      if (err) commonThrow(res, err)
      user.password = hash
      user.save().then(saveRes => {
        return res.json({
          code: 200,
          data: {},
          message: '重置成功！',
          success: true
        })
      }).catch(saveError => {
        commonThrow(res, saveError)
      })
    })
  })
})

/**
 * 修改用户权限
 */
router.post('/changeUserAuth', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userRole = req.user.role
  // 校验用户角色是否为超级管理员
  if (!verifyUserRole(userRole, USER_PERMISSIONS.SUPER_ADMIN)) {
    authThrow(res)
    return
  }
  const changeUserRole = req.body.role
  const userId = req.body.userId
  // 修改用户权限
  User.updateOne({ _id: userId }, { role: changeUserRole }).then(updateRes => {
    return res.json({
      code: 200,
      data: {},
      message: '修改成功！',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

/**
 * 用户登录接口
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
 * 发送邮箱验证码接口
 */
router.get('/verify', (req, res) => {
  const verifyCode = Math.floor(Math.random() * 1000000)
  sendEmail(req.query.email, verifyCode).then(res => {
    return res.json({
      code: 200,
      data: {
        email: req.query.email,
        verifyCode: verifyCode
      },
      message: res,
      success: true
    })
  }).catch(err => {
    return res.json({
      code: 404,
      data: {
        err
      },
      message: '邮箱不存在！',
      success: false
    })
  })
})

/**
 * des: 返回当前登录用户信息接口
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
      email: req.user.email,
      freeTimeList: req.user.freeTimeList
    },
    message: '查询成功！'
  })
})

/**
 * 修改用户信息接口, 基础信息修改和绑定邮箱修改(base) || 密码修改(pwd) || 时间协作数据修改(freeTimeList)
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
    case 'base':
      // 传参存在用户修改邮箱，先判断邮箱是否已被绑定，然后修改用户对应信息
      if (req.body.email) {
        // 查找用户表中是否存在当前需要绑定的邮箱，单独返回数据
        // eslint-disable-next-line no-case-declarations
        const email = req.body.email
        returnInfo.data.email = req.body.email
        User.findOne({ email }).then(user => {
          if (user) {
            returnInfo.data.code = 400
            returnInfo.data.success = false
            returnInfo.message = '邮箱已被绑定！'
            return res.json(returnInfo)
          }
          user.email = req.body.email
          user.username = req.body.username
          user.signature = req.body.signature
          returnInfo.message = '修改成功！'
          user.save().then(saveRes => {
            return res.json(returnInfo)
          }).catch(saveError => {
            commonThrow(res, saveError)
          })
        })
      } else {
        // 用户为修改邮箱，修改基本信息保存即可
        user.username = req.body.username
        user.signature = req.body.signature
        user.save().then(saveRes => {
          returnInfo.message = '修改成功'
          returnInfo.data.username = req.body.username
          returnInfo.data.signature = req.body.signature
          return res.json(returnInfo)
        }).catch(saveError => {
          commonThrow(res, saveError)
        })
      }
      break
    case 'pwd':
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
    case 'freeTimeList':
      user.freeTimeList = req.body.freeTimeList
      // 返回修改结果(基础信息，时间协作数据)
      user.save().then(saveRes => {
        returnInfo.message = '修改成功'
        returnInfo.data = req.body.freeTimeList
        return res.json(returnInfo)
      }).catch(err => {
        commonThrow(res, err)
      })
      break
  }
})

/**
 * 根据id查询用户信息
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

/**
 * 根据id批量查询用户信息(max=10)
 */
router.get('/getUserByIds', (req, res) => {
  const userIds = req.query.userIds
  if (!userIds) {
    return res.json({
      code: 200,
      data: [],
      message: '查询成功！',
      success: true
    })
  }
  console.log(userIds)
  User.find({ _id: { $in: userIds } }, { _id: 1, username: 1 }).then(userList => {
    return res.json({
      code: 200,
      data: userList,
      message: '查询成功！',
      success: true
    })
  })
})

/**
 * 根据用户输入查询用户信息，返回id和username
 */
router.get('/getUserByInput', (req, res) => {
  const userInput = req.query.userInput
  console.log(req.query)
  User.find({ username: { $regex: userInput } }, { _id: 1, username: 1 }).then(user => {
    res.json({
      code: 200,
      success: true,
      data: user,
      message: '查询成功！'
    })
  }).catch(err => {
    console.log(err)
    commonThrow(res, err)
  })
})
/**
 * 用户api，用于用户的登录注册和信息修改
 * @type {Router}
 */
module.exports = router
