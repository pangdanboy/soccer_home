const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const upload = multer({ dest: 'public/areaCover' })
const { saveImg } = require('./../../utlis/tools')
const { commonThrow } = require('../../utlis/throw')
router.post('/areaCover', upload.single('file'), passport.authenticate('jwt', { session: false }), (req, res) => {
  saveImg(req.file, req.user._id).then(imgUrl => {
    return res.json({
      code: 200,
      data: { imgUrl: imgUrl },
      success: true,
      message: '上传成功！'
    })
  }).catch(err => {
    commonThrow(res, err)
  })
})

module.exports = router
