// 系统执行错误统一返回
const commonThrow = (res, err) => {
  res.json({
    code: -1,
    data: {
      error: err
    },
    message: '系统异常！',
    success: false
  })
}
module.exports = {
  commonThrow
}
