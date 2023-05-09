const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const area = {
  // 场地名称
  areaName: {
    type: String,
    required: true
  },
  // 场地位置
  areaPosition: {
    type: String,
    required: true
  },
  // 场地状态
  areaStatus: {
    type: String,
    required: true
  },
  // 场地图像
  areaCover: {
    type: String,
    required: true
  },
  // 创建时间
  createTime: {
    type: Date,
    required: true,
    default: Date.now()
  }
}
const areaSchema = new mongoose.Schema(area, { minimize: false })
areaSchema.plugin(mongoosePaginate)
const Area = mongoose.model('area', areaSchema, 'area')
module.exports = {
  Area
}
