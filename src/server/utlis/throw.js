// 系统执行错误统一返回
const commonThrow = (res, err) => {
  return res.json({
    code: -1,
    data: {
      error: err
    },
    message: '系统异常！',
    success: false
  })
}

// 用户越权统一返回
const authThrow = (res) => {
  return res.json({
    code: 403,
    data: {
      error: '无权访问！'
    },
    message: '无权访问！',
    success: false
  })
}
module.exports = {
  commonThrow,
  authThrow
}
