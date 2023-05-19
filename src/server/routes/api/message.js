const express = require('express')
const router = express.Router()
const passport = require('passport')
const { Message } = require('./../../utlis/db/mongoose/models/message')
const moment = require('moment')
const { commonThrow } = require('../../utlis/throw')
router.post('/queryMessage', passport.authenticate('jwt', { session: false }), (req, res) => {
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    sort: { _id: -1 },
    lean: true
  }
  const nowDate = moment(Date.now()).format('yyyy-mm-dd')
  const query = { $gte: new Date(nowDate) }
  Message.paginate(query, options).then(messageList => {
    return res.json({
      code: 200,
      count: messageList.totalDocs,
      data: messageList.docs,
      message: '查询成功',
      success: true
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

module.exports = router
