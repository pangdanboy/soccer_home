const mongoose = require('mongoose')
const { MongoDB } = require('./../../../global/config')
// 默认连接
const defaultMongoDBConnection = () => {
  mongoose.set('strictQuery', true)
  mongoose.connect(MongoDB.MongoDBAddress).then(res => {
    console.log('MongoDB connected')
    mongoose.connection.useDb(MongoDB.MongoDBDatabase)
  }).catch(err => {
    console.log('MongoDB connect failed', err)
  })
}
// 单个独立的连接
const signalMongoDBConnection = mongoose.createConnection(MongoDB.MongoDBAddress, {
  useNewUrlParser: true,
  retryWrites: true,
  useUnifiedTopology: true
}, (error, result) => {
  if (error) console.log('MongoDB connect failed', error)
})
module.exports = {
  defaultMongoDBConnection,
  signalMongoDBConnection
}
