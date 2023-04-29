import moment from 'moment'
import { DATE } from '@/constant'
// 获取当前日期所处周的时间
export const getWeekDays = (date) => {
  // 计算今天是这周的第几天
  const weekOfDay = parseInt(moment(date).format('E'))
  const weekDays = []
  for (let i = 1; i <= 7; i++) {
    weekDays.push(moment(date).startOf('day').subtract(weekOfDay - i, 'days').format('YYYY-MM-DD'))
  }
  return weekDays
}
// 获取指定日期所处周的时间

// 生成指定范围内的随机数
export const random = (Min, Max) => {
  const Range = Max - Min
  const Rand = Math.random()
  const num = Min + Math.round(Rand * Range)
  return num
}

export const createTimeTableData = () => {
  const timeTableData = []
  for (let i = 1; i <= 7; i++) {
    const weekItemData = {}
    weekItemData.name = DATE[i]
    weekItemData.date = ''
    weekItemData.id = i + ''
    weekItemData.timeList = []
    for (let j = 1; j <= 6; j++) {
      const classItemData = {}
      classItemData.id = i + '-' + j
      classItemData.free = false
      classItemData.haveMatch = false
      weekItemData.timeList.push(classItemData)
    }
    timeTableData.push(weekItemData)
  }
  return timeTableData
}
