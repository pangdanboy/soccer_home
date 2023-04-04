import moment from 'moment'

// 获取日期所处周的时间
export const getWeekDays = () => {
  // 计算今天是这周的第几天
  const weekOfDay = parseInt(moment().format('E'))
  const weekDays = []
  for (let i = 1; i <= 7; i++) {
    weekDays.push(moment().startOf('day').subtract(weekOfDay - i, 'days').format('YYYY/MM/DD'))
  }
  return weekDays
}
// 生成指定范围内的随机数
export const random = (Min, Max) => {
  const Range = Max - Min
  const Rand = Math.random()
  const num = Min + Math.round(Rand * Range)
  return num
}
