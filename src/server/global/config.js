// MongoDB信息
const MongoDB = {
  MongoDBAddress: 'mongodb://localhost:27017',
  MongoDBDatabase: 'test',
  MongoDBUserName: 'root',
  MongoDBPassword: ''
}
// 后端服务信息
const serverInfo = {
  port: process.env.PORT || 5000
}

module.exports = {
  MongoDB,
  serverInfo
}
