<template>
  <div id="home">
    <div class="match">
      <!-- 比赛列表过滤，查看所有比赛时用户可自定义条件过滤比赛列表；按周查看比赛列表时，显示切换周的按钮过滤比赛列表 -->
      <div class="filter-header">
        <filter-header
          :filter-config="filterConfig"
          @toggleWeekShow="toggleWeekShow"
          @toggleAllShow="toggleAllShow"
          @getDataList="getDataList"
          @changeWeekData="changeWeekData"
        ></filter-header>
      </div>
      <!-- 比赛列表 -->
      <div class="match-list">
        <!-- 所有比赛列表，分页显示 -->
        <div class="all-match-list" v-show="showAllMatchList">
          <match-item></match-item>
          <match-item></match-item>
          <match-item></match-item>
          <match-item></match-item>
        </div>
        <!-- 按一周展示比赛列表，可切换周 -->
        <div class="week-match-list" v-show="!showAllMatchList">
          <time-table
            :free-time-list="freeTimeList"
            :week-day-date="weekDayDate"
            :match-time-list="matchTimeList"
            :time-table-type="timeTableType"
          ></time-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import timeTable from '@/components/timeTable.vue'
import { getWeekDays } from '@/utils'
import { MATCH_TYPE, MATCH_TYPE_PARAMS } from '@/constant'
import filterHeader from './components/filterHeader.vue'
import matchItem from '@/views/user_client/pageHome/components/matchItem.vue'
import moment from 'moment'

export default {
  name: 'pageHome',
  components: {
    timeTable,
    filterHeader,
    matchItem
  },
  data: () => ({
    // 用户每周空闲时间列表
    freeTimeList: ['1-1', '4-3', '7-1'],
    // 当前周比赛时间列表
    matchTimeList: ['1-1', '4-3'],
    // 当前时间所处周日期，可切换为未来时间的周
    weekDayDate: [],
    // 时间表类型
    timeTableType: 'check',
    // 是否显示所有比赛列表
    showAllMatchList: true,
    // 显示所有比赛列表时过滤头的配置
    showAllFilterList: [
      {
        type: 'text',
        label: '搜索比赛',
        key: 'matchSearch',
        value: ''
      },
      {
        type: 'dateRange',
        label: '比赛日期',
        key: 'matchDate',
        value: []
      },
      {
        type: 'select',
        label: '比赛类型',
        key: 'matchType',
        value: '',
        selectItem: [MATCH_TYPE.FREE_MATCH, MATCH_TYPE.CLASS_MATCH, MATCH_TYPE.LEAGUE_MATCH]
      },
      {
        type: 'button',
        label: '比赛数据操作',
        key: 'matchOperation',
        operationList: [
          {
            text: '按周查看',
            event: 'toggleWeekShow',
            icon: 'mdi'
          }
        ]
      }
    ],
    // 显示周比赛列表时过滤头的配置
    showWeekFilterList: [
      {
        type: 'select',
        label: '比赛类型',
        key: 'matchType',
        value: '',
        selectItem: [MATCH_TYPE.FREE_MATCH, MATCH_TYPE.CLASS_MATCH, MATCH_TYPE.LEAGUE_MATCH]
      },
      {
        type: 'button',
        label: '比赛数据操作',
        key: 'matchOperation',
        operationList: [
          {
            text: '查看全部',
            event: 'toggleAllShow',
            icon: 'mdi'
          },
          {
            text: '查看上一周',
            event: 'changeWeekData',
            type: 'last',
            icon: 'mdi'
          },
          {
            text: '查看下一周',
            event: 'changeWeekData',
            type: 'next',
            icon: 'mdi'
          }
        ]
      }
    ],
    // 过滤组件配置，默认显示全部比赛列表
    filterConfig: {
      // 是否查看所有比赛列表
      all: true,
      // 过滤条件
      filterList: [
        {
          type: 'text',
          label: '搜索比赛',
          key: 'matchSearch',
          value: ''
        },
        {
          type: 'dateRange',
          label: '比赛日期',
          key: 'matchDate',
          value: []
        },
        {
          type: 'select',
          label: '比赛类型',
          key: 'matchType',
          value: '',
          selectItem: [MATCH_TYPE.FREE_MATCH, MATCH_TYPE.CLASS_MATCH, MATCH_TYPE.LEAGUE_MATCH]
        },
        {
          type: 'button',
          label: '比赛数据操作',
          key: 'matchOperation',
          operationList: [
            {
              text: '按周查看',
              event: 'toggleWeekShow',
              icon: 'mdi'
            }
          ]
        }
      ]
    }
  }),
  mounted () {
    // 获取当前日期所处周
    this.weekDayDate = getWeekDays(new Date())
    // 初始化过滤条件中日期范围为当周初末
    this.filterConfig.filterList.forEach((item) => {
      if (item.type === 'dateRange') {
        item.value.push(this.weekDayDate[0])
        item.value.push(this.weekDayDate[this.weekDayDate.length - 1])
      }
    })
    this.getDataList()
  },
  computed: {
  },
  methods: {
    // 按周查看比赛
    toggleWeekShow () {
      this.showAllMatchList = false
      this.filterConfig.filterList = this.showWeekFilterList
      this.filterConfig.all = false
    },
    // 查看全部比赛
    toggleAllShow () {
      this.showAllMatchList = true
      this.filterConfig.filterList = this.showAllFilterList
      this.filterConfig.all = true
    },
    // 获取比赛列表
    getDataList () {
      const query = {}
      this.filterConfig.filterList.forEach((item) => {
        if (item.type !== 'button') query[item.key] = item.value
      })
      // 处理比赛时间类型和比赛类型参数
      if (query.matchType) query.matchType = MATCH_TYPE_PARAMS[query.matchType]
      // 如果当前是按周查看，添加日期范围参数
      if (!this.showAllMatchList) query.matchDate = [this.weekDayDate[0], this.weekDayDate[this.weekDayDate.length - 1]]
      console.log(query)
    },
    // 获取下一周的比赛数据
    changeWeekData (type) {
      console.log(type)
      if (type === 'last') {
        // 修改周日期weekDayDate为上一周
        this.weekDayDate = getWeekDays(moment(this.weekDayDate[0]).subtract(7, 'days'))
        console.log(this.weekDayDate)
      } else {
        // 修改周日期weekDayDate为下一周
        this.weekDayDate = getWeekDays(moment(this.weekDayDate[0]).add(7, 'days'))
        console.log(this.weekDayDate)
      }
      this.getDataList()
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
  #home{
    width: 100%;
    .match{
      .filter-header{
        border-bottom: 1px solid #cccccc;
      }
      display: flex;
      flex-direction: column;
      .match-list{
        .all-match-list{
          padding: 10px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
      }
    }
  }
</style>
