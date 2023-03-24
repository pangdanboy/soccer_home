<template>
  <div id="home">
    <div class="match-list"></div>
    <time-table :free-time-list="freeTimeList" :week-day-date="weekDayDate" :match-time-list="matchTimeList"></time-table>
  </div>
</template>

<script>
import timeTable from '@/components/timeTable.vue'
import { getWeekDays } from '@/utils'
export default {
  name: 'pageHome',
  components: {
    timeTable
  },
  data: () => ({
    // 用户每周空闲时间列表
    freeTimeList: ['1-1', '4-3', '7-1'],
    // 当前周比赛时间列表
    matchTimeList: ['1-1', '4-3'],
    // 当前时间所处周日期
    weekDayDate: []
  }),
  mounted () {
    this.weekDayDate = getWeekDays()
  }
}
</script>

<style scoped lang="scss">
  #chat_home{
    width: 100%;
  }
</style>
