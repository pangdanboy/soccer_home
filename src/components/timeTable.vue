<template>
  <div id="time_table">
    <v-container fluid style="background-color: rgba(255, 255, 255, 0.5);">
      <v-row v-for="weekItem in timeData" :key="weekItem.id">
        <v-col style="border: 1px solid #ccc; font-size: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center">
          <span>{{ weekItem.name }}</span>
          <span>{{ weekItem.date }}</span>
        </v-col>
        <v-col v-for="(day, index) in weekItem.timeList" :key="day.id" style="border: 1px solid #ccc">
          <v-card outlined style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <v-card-title style="padding: 8px">{{ `第${index + 1}讲` }}</v-card-title>
            <v-card-text style="display: flex; align-items: center; justify-content: center; padding: 0px 8px 8px 8px">
              <v-icon v-show="day.free" size="36">mdi-soccer-field</v-icon>
              <v-icon v-show="!day.free" size="36">mdi-book-open-variant</v-icon>
            </v-card-text>
            <v-card-actions v-show="timeTableType === 'operation'">
              <v-btn color="error" v-show="day.free" @click="setBusy(day)">设为繁忙</v-btn>
              <v-btn color="primary" v-show="!day.free" @click="setFree(day)">设为空闲</v-btn>
            </v-card-actions>
            <v-card-actions v-show="timeTableType === 'check'">
              <v-btn color="primary" @click="checkMatch(weekItem.date, day.id)" v-show="day.haveMatch">查看比赛</v-btn>
              <v-btn color="primary" v-show="!day.haveMatch" disabled>暂无比赛</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row style="display: flex; align-items: center; justify-content: center; padding: 20px 0px 10px 0px">
        <v-btn class="primary" style="width: 100px; height: 45px;" :disabled="saveBtn" v-show="timeTableType === 'operation'" @click="saveFreeTimeList">保存</v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { createTimeTableData } from '@/utils'

export default {
  name: 'timeTable',
  data: () => ({
    timeData: createTimeTableData(),
    saveBtn: true,
    // 待修改的用户空闲时间列表
    UserFreeTimeList: []
  }),
  props: {
    // 用户空闲时间列表
    freeTimeList: {
      type: Array,
      required: false,
      default: () => ([])
    },
    // 当前周的比赛列表
    weekMatchList: {
      type: Array,
      required: false,
      default: () => ([])
    },
    // 当前周的日期
    weekDayDate: {
      type: Array,
      required: false,
      default: () => ([])
    },
    // 当前时间表类型: 用户查看比赛(check)||用户设置时间协作数据
    timeTableType: {
      type: String,
      required: true,
      default: ''
    }
  },
  beforeMount () {
    // 根据用户当前的空闲时间在课表上标记用户空闲时间
    // 根据比赛列表时间标记
  },
  methods: {
    setBusy (day) {
      console.log(day.id)
      // 把当前时间从用户空闲时间列表中移除
      this.UserFreeTimeList.forEach((item, index) => {
        if (item === day.id) {
          this.UserFreeTimeList.splice(index, 1)
        }
      })
      this.saveBtn = false
      day.free = false
    },
    setFree (day) {
      console.log(day.id)
      this.saveBtn = false
      day.free = true
      // 将当前时间添加到用户空闲时间列表中
      this.UserFreeTimeList.push(day.id)
    },
    saveFreeTimeList () {
      this.$emit('freeTimeListEdit', this.UserFreeTimeList)
      this.saveBtn = true
    },
    // 查看点击该天该讲的比赛
    checkMatch (date, classTime) {
      this.$emit('openWeekMatchList', date, classTime)
    }
  },
  watch: {
    weekDayDate: function () {
      console.log('当周日期')
      // 为每天添加日期
      this.timeData.forEach((weekItem, index) => {
        weekItem.date = this.weekDayDate[index]
      })
    },
    freeTimeList: function (newVal, oldVal) {
      console.log('标记用户空闲时间')
      // 初始化待修改的用户空闲时间列表
      this.UserFreeTimeList = newVal
      this.timeData.forEach((weekItem) => {
        weekItem.timeList.forEach((classItem) => {
          if (this.freeTimeList.includes(classItem.id)) {
            classItem.free = true
          }
        })
      })
    },
    weekMatchList: function () {
      const haveMatchTimeList = []
      // 处理比赛列表数据
      this.weekMatchList.forEach(item => {
        // 比赛的日期处于当周第几天
        const weekDay = this.weekDayDate.indexOf(item.matchDate.split('T')[0]) + 1
        // 拼接日期和时间 类似与: 1-1(星期一第一讲)...
        const weekDayAndClass = weekDay + '-' + item.matchClassTime
        item.weekDayAndClass = weekDayAndClass
        haveMatchTimeList.push(weekDayAndClass)
      })
      console.log(haveMatchTimeList)
      console.log('标记有比赛的时间')
      this.timeData.forEach((weekItem) => {
        weekItem.timeList.forEach((day) => {
          if (haveMatchTimeList.includes(day.id)) {
            day.haveMatch = true
          } else {
            day.haveMatch = false
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #time_table{
    padding: 15px;
    background-image: url('./../static/images/timeTable.jpg');
    background-size: cover;
    width: 100%;
  }
</style>
