// 用户角色权限
const USER_PERMISSIONS = {
  SUPER_ADMIN: '2',
  ADMIN: '1',
  COMMON_USER: '0'
}
const USER_LEVEL = {
  [USER_PERMISSIONS.COMMON_USER]: '普通用户',
  [USER_PERMISSIONS.ADMIN]: '管理员',
  [USER_PERMISSIONS.SUPER_ADMIN]: '超级管理员'
}
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
// 不显示导航栏的页面
const NOT_SHOW_NAV_PAGES = ['pageLogin', 'pageMessageCenter', 'pageUserCenter', 'pageAdmin', 'page401', 'pageMatch']
// 用户信息编辑类型
const EDIT_TYPE = {
  // 基础信息编辑(用户名||个性签名)
  BASE_INFO_EDIT: 0,
  // 绑定邮箱编辑
  EMAIL_EDIT: 1,
  // 密码修改
  PASSWORD_EDIT: 2,
  // 用户时间协作数据上传
  FREE_TIME_TABLE_EDIT: 3
}
// 足球比赛类型
const MATCH_TYPE = {
  FREE_MATCH: '自由比赛',
  CLASS_MATCH: '课程比赛',
  LEAGUE_MATCH: '联盟比赛'
}
// 查询数据时足球比赛类型对应参数
const MATCH_TYPE_PARAMS = {
  [MATCH_TYPE.FREE_MATCH]: '1',
  [MATCH_TYPE.CLASS_MATCH]: '2',
  [MATCH_TYPE.LEAGUE_MATCH]: '3'
}

export {
  USER_PERMISSIONS,
  DATE,
  NOT_SHOW_NAV_PAGES,
  EDIT_TYPE,
  MATCH_TYPE,
  MATCH_TYPE_PARAMS,
  USER_LEVEL
}
