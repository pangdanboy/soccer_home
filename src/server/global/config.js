// MongoDB信息
const MongoDB = {
  MongoDBAddress: 'mongodb://localhost:27017/',
  MongoDBDatabase: 'soccer_home',
  MongoDBUserName: 'root',
  MongoDBPassword: ''
}
// 后端服务信息
const serverInfo = {
  url: 'http://localhost',
  port: process.env.PORT || 5000
}
// 用户头像
const userAvatar = [
  '/public/userAvatar/user_avatar_c.png',
  '/public/userAvatar/user_avatar_mx.png',
  '/public/userAvatar/user_avatar_amf.png',
  '/public/userAvatar/user_avatar_cb.png',
  '/public/userAvatar/user_avatar_cmf.png',
  '/public/userAvatar/user_avatar_gk.png',
  '/public/userAvatar/user_avatar_lw.png',
  '/public/userAvatar/user_avatar_nme.png'
]
// 用户角色定义
const USER_PERMISSIONS = {
  SUPER_ADMIN: '2',
  ADMIN: '1',
  COMMON_USER: '0'
}
// 通用访问路由(所有登录用户都可以访问的路由)
const routes = ['pageHome', 'pageLogin', 'pageMessageCenter', 'pageNews', 'pageCommunity', 'pageUserCenter', 'overview']
// 用户角色权限访问路由限制
// const userRoleToRoute = {
//   SUPER_ADMIN: {
//     // 前后端统一的匹配key值
//     key: USER_PERMISSIONS.SUPER_ADMIN,
//     // 用户可以访问的路由
//     routes: [...commonRoutes, 'pageAdmin']
//   },
//   ADMIN: {
//     key: USER_PERMISSIONS.ADMIN,
//     routes: [...commonRoutes]
//   },
//   COMMON_USER: {
//     key: USER_PERMISSIONS.COMMON_USER,
//     routes: [...commonRoutes]
//   }
// }

// 日期
const DATE = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日'
}
// 这些比赛字段变动之后，将向参赛用户发送系统通知
const MATCH_CHANGE_COLUMN = {
  MATCH_TYPE: 'matchType',
  MATCH_DATE: 'matchDate',
  MATCH_CLASS_TIME: 'matchClassTime',
  MATCH_AREA: 'matchArea'
}

// 这些比赛字段中文
const MATCH_CHANGE_COLUMN_STR = {
  [MATCH_CHANGE_COLUMN.MATCH_TYPE]: '比赛类型',
  [MATCH_CHANGE_COLUMN.MATCH_DATE]: '比赛日期',
  [MATCH_CHANGE_COLUMN.MATCH_CLASS_TIME]: '比赛时间',
  [MATCH_CHANGE_COLUMN.MATCH_AREA]: '比赛场地'
}

const secretOrKey = 'secret'
module.exports = {
  MongoDB,
  serverInfo,
  secretOrKey,
  userAvatar,
  routes,
  USER_PERMISSIONS,
  DATE,
  MATCH_CHANGE_COLUMN,
  MATCH_CHANGE_COLUMN_STR
}
