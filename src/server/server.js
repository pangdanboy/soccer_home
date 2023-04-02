const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const { corsOptions } = require('./utlis/cors')
const { serverInfo } = require('./global/config')
const { defaultMongoDBConnection } = require('./utlis/db/mongoose/mongooseConnection')

// 解决跨域
app.use(cors(corsOptions))

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 连接数据库
defaultMongoDBConnection()

app.get('/', (req, res) => {
  res.end('hello world')
})

// 响应请求路由

// 开启请求监听
app.listen(serverInfo.port, () => {
  console.log('server running at ' + serverInfo.port)
})
