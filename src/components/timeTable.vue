<template>
  <div id="time_table">
    <v-container fluid style="background-color: rgba(255, 255, 255, 0.5);">
      <v-row v-for="weekItem in timeData" :key="weekItem.id">
        <v-col style="border: 1px solid #ccc; font-size: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center">
          <span>{{ DATE[weekItem.name] }}</span>
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
              <v-btn color="primary" @click="setBusy(day)" v-show="day.free">查看比赛</v-btn>
              <v-btn color="primary" @click="setFree(day)" v-show="!day.free" disabled>暂无比赛</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row style="display: flex; align-items: center; justify-content: center; padding: 20px 0px 10px 0px">
        <v-btn class="primary" style="width: 100px; height: 45px;" :disabled="saveBtn" v-show="timeTableType === 'operation'">保存</v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { DATE } from '@/constant'
export default {
  name: 'timeTable',
  data: () => ({
    timeData: [
      {
        name: 'Monday',
        date: '',
        id: '1',
        timeList: [
          {
            id: '1-1',
            free: true,
            haveMatch: false
          },
          {
            id: '1-2',
            free: true,
            haveMatch: false
          },
          {
            id: '1-3',
            free: true,
            haveMatch: false
          },
          {
            id: '1-4',
            free: true,
            haveMatch: false
          },
          {
            id: '1-5',
            free: true,
            haveMatch: false
          },
          {
            id: '1-6',
            free: true,
            haveMatch: false
          }
        ]
      },
      {
        name: 'Tuesday',
        date: '',
        id: '2',
        timeList: [
          {
            id: '2-1',
            free: true,
            haveMatch: false
          },
          {
            id: '2-2',
            free: true,
            haveMatch: false
          },
          {
            id: '2-3',
            free: true,
            haveMatch: false
          },
          {
            id: '2-4',
            free: true,
            haveMatch: false
          },
          {
            id: '2-5',
            free: true,
            haveMatch: false
          },
          {
            id: '2-6',
            free: true,
            haveMatch: false
          }
        ]
      },
      {
        name: 'Wednesday',
        date: '',
        id: '3',
        timeList: [
          {
            id: '3-1',
            free: true,
            haveMatch: false
          },
          {
            id: '3-2',
            free: true,
            haveMatch: false
          },
          {
            id: '3-3',
            free: true,
            haveMatch: false
          },
          {
            id: '3-4',
            free: true,
            haveMatch: false
          },
          {
            id: '3-5',
            free: true,
            haveMatch: false
          },
          {
            id: '3-6',
            free: true,
            haveMatch: false
          }
        ]
      },
      {
        name: 'Thursday',
        date: '',
        id: '4',
        timeList: [
          {
            id: '4-1',
            free: true,
            haveMatch: false
          },
          {
            id: '4-2',
            free: true,
            haveMatch: false
          },
          {
            id: '4-3',
            free: true,
            haveMatch: false
          },
          {
            id: '4-4',
            free: true,
            haveMatch: false
          },
          {
            id: '4-5',
            free: true,
            haveMatch: false
          },
          {
            id: '4-6',
            free: true,
            haveMatch: false
          }
        ]
      },
      {
        name: 'Friday',
        date: '',
        id: '5',
        timeList: [
          {
            id: '5-1',
            free: true,
            haveMatch: false
          },
          {
            id: '5-2',
            free: true,
            haveMatch: false
          },
          {
            id: '5-3',
            free: true,
            haveMatch: false
          },
          {
            id: '5-4',
            free: true,
            haveMatch: false
          },
          {
            id: '5-5',
            free: true,
            haveMatch: false
          },
          {
            id: '5-6',
            free: true,
            haveMatch: false
          }
        ]
      },
      {
        name: 'Saturday',
        date: '',
        id: '6',
        timeList: [
          {
            id: '6-1',
            free: true,
            haveMatch: false
          },
          {
            id: '6-2',
            free: true,
            haveMatch: false
          },
          {
            id: '6-3',
            free: true,
            haveMatch: false
          },
          {
            id: '6-4',
            free: true,
            haveMatch: false
          },
          {
            id: '6-5',
            free: true,
            haveMatch: false
          },
          {
            id: '6-6',
            free: true,
            haveMatch: false
          }
        ]
      },
      {
        name: 'weekday',
        date: '',
        id: '7',
        timeList: [
          {
            id: '7-1',
            free: true,
            haveMatch: false
          },
          {
            id: '7-2',
            free: true,
            haveMatch: false
          },
          {
            id: '7-3',
            free: true,
            haveMatch: false
          },
          {
            id: '7-4',
            free: true,
            haveMatch: false
          },
          {
            id: '7-5',
            free: true,
            haveMatch: false
          },
          {
            id: '7-6',
            free: true,
            haveMatch: false
          }
        ]
      }
    ],
    saveBtn: true,
    // 用户可以参加比赛列表
    canJoinMatchList: [],
    DATE
  }),
  props: {
    // 用户空闲时间
    freeTimeList: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    // 比赛时间列表
    matchTimeList: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    // 当前周的日期
    weekDayDate: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    // 当前时间表类型: 用户查看比赛(check)||用户设置时间协作数据
    timeTableType: {
      type: String,
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
      this.saveBtn = false
      day.free = false
    },
    setFree (day) {
      console.log(day.id)
      this.saveBtn = false
      day.free = true
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
    freeTimeList: function () {
      console.log('标记用户空闲时间')
      this.timeData.forEach((weekItem) => {
        weekItem.timeList.forEach((day) => {
          if (!this.freeTimeList.includes(day.id)) {
            day.free = false
          }
        })
      })
    },
    matchTimeList: function () {
      console.log('标记比赛时间')
      this.timeData.forEach((weekItem) => {
        weekItem.timeList.forEach((day) => {
          if (this.matchTimeList.includes(day.id)) {
            day.haveMatch = true
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
