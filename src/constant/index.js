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
// 课程时间参数映射
const CLASS_TIME = {
  第一讲: '1',
  第二讲: '2',
  第三讲: '3',
  第四讲: '4',
  第五讲: '5',
  第六讲: '6'
}
// 课程时间参数
const CLASS_TIME_MAP = {
  first: '1',
  second: '2',
  third: '3',
  fourth: '4',
  fifth: '5',
  sixth: '6'
}
// 课程时间参数与中文映射
const CLASS_TIME_PARAMS_MAP = {
  [CLASS_TIME_MAP.first]: {
    name: '第一讲',
    time: 'AM 8:00 ~ 9:40'
  },
  [CLASS_TIME_MAP.second]: {
    name: '第二讲',
    time: 'AM 10:00 ~ 11:40'
  },
  [CLASS_TIME_MAP.third]: {
    name: '第三讲',
    time: 'PM 14:00 ~ 15:40'
  },
  [CLASS_TIME_MAP.fourth]: {
    name: '第四讲',
    time: 'PM 16:00 ~ 17:40'
  },
  [CLASS_TIME_MAP.fifth]: {
    name: '第五讲',
    time: 'PM 19:00 ~ 20:40'
  },
  [CLASS_TIME_MAP.sixth]: {
    name: '第六讲',
    time: 'PM 20:40 ~ 22:00'
  }
}
// 不显示导航栏的页面
const NOT_SHOW_NAV_PAGES = ['pageLogin', 'pageMessageCenter', 'pageUserCenter', 'page401', 'pageMatch', 'pageMatchDetail', 'overview', 'matchManage', 'areaManage', 'userManage', 'authManage', 'communityManage']
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
// 足球比赛类型与参数映射
const MATCH_TYPE_MAP = {
  FREE_MATCH: '1',
  CLASS_MATCH: '2',
  LEAGUE_MATCH: '3'
}
// 足球比赛类型参数与中文映射
const MATCH_TYPE_PARAMS_MAP = {
  [MATCH_TYPE_MAP.FREE_MATCH]: MATCH_TYPE.FREE_MATCH,
  [MATCH_TYPE_MAP.CLASS_MATCH]: MATCH_TYPE.CLASS_MATCH,
  [MATCH_TYPE_MAP.LEAGUE_MATCH]: MATCH_TYPE.LEAGUE_MATCH
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
  MATCH_TYPE_PARAMS_MAP,
  USER_LEVEL,
  CLASS_TIME,
  CLASS_TIME_PARAMS_MAP
}
