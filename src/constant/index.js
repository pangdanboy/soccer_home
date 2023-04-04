// 用户角色权限
export const USER_PERMISSIONS = {
  SUPER_ADMIN: '2',
  ADMIN: '1',
  COMMON_USER: '0'
}
// 日期中文
export const DATE = {
  Monday: '周一',
  Tuesday: '周二',
  Wednesday: '周三',
  Thursday: '周四',
  Friday: '周五',
  Saturday: '周六',
  weekday: '周日'
}
// 不显示导航栏的页面
export const NOT_SHOW_NAV_PAGES = ['pageLogin', 'pageMessageCenter', 'pageUserCenter', 'pageAdmin', 'page401']
// 用户信息编辑类型
export const EDIT_TYPE = {
  // 基础信息编辑(用户名||个性签名)
  BASE_INFO_EDIT: 0,
  // 绑定邮箱编辑
  EMAIL_EDIT: 1,
  // 密码修改
  PASSWORD_EDIT: 2,
  // 用户时间协作数据上传
  FREE_TIME_TABLE_EDIT: 3
}
