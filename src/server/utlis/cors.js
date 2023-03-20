// 解决跨域
const whiteList = ['http://localhost:8080']
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('not allow by cors'))
    }
  }
}
module.exports = {
  corsOptions
}
