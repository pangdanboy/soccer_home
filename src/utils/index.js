import moment from 'moment'

// 获取日期所处周的时间
export const getWeekDays = () => {
  const weekDays = []
  for (let i = 1; i <= 7; i++) {
    weekDays.push(moment().weekday(i).format('YYYY/MM/DD'))
  }
  return weekDays
}
