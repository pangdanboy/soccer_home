const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const app = express()
const { corsOptions } = require('./utlis/cors')
const { serverInfo } = require('./global/config')
const { defaultMongoDBConnection } = require('./utlis/db/mongoose/mongooseConnection')

// 解决跨域
app.use(cors(corsOptions))

// 连接数据库
defaultMongoDBConnection()

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 配置静态托管，将用户上传的静态资源暴露出去
app.use('/public/userAvatar', express.static('./public/userAvatar'))
app.use('/public/areaCover', express.static('./public/areaCover'))

// 初始化passport
app.use(passport.initialize())
// 配置passport
require('./config/passport')(passport)

// 引入路由
const user = require('./routes/api/user')
const match = require('./routes/api/match')
const system = require('./routes/api/system')
const upload = require('./routes/api/upload')
const area = require('./routes/api/area')
// 使用路由
app.use('/api/user', user)
app.use('/api/match', match)
app.use('/api/system', system)
app.use('/api/upload', upload)
app.use('/api/area', area)

// 开启请求监听
app.listen(serverInfo.port, () => {
  console.log('server running at ' + serverInfo.port)
})
