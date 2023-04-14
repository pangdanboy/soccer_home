const mongoose = require('mongoose')
const freeTimeList = {
  userId: {
    type: String,
    require: true
  },
  freeTimeList: {
    type: Array,
    require: true
  }
}
const freeTimeListSchema = new mongoose.Schema(freeTimeList, { minimize: false })
const FreeTimeList = mongoose.model('freeTimeList', freeTimeListSchema, 'freeTimeList')
module.exports = {
  FreeTimeList
}
