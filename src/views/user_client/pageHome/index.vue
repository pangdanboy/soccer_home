<template>
  <div id="home">
    <div class="match">
      <!-- 比赛列表过滤，查看所有比赛时用户可自定义条件过滤比赛列表；按周查看比赛列表时，显示切换周的按钮过滤比赛列表 -->
      <div class="filter-header">
        <filter-header :filter-config="filterConfig" @toggleWeekShow="toggleWeekShow" @toggleAllShow="toggleAllShow"></filter-header>
      </div>
      <!-- 比赛列表 -->
      <div class="match-list">
        <!-- 所有比赛列表，分页显示 -->
        <div class="all-match-list" v-show="showAllMatchList">
        </div>
        <!-- 按一周展示比赛列表，可切换周 -->
        <div class="week-match-list" v-show="!showAllMatchList">
          <time-table :free-time-list="freeTimeList" :week-day-date="weekDayDate" :match-time-list="matchTimeList"></time-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import timeTable from '@/components/timeTable.vue'
import { getWeekDays } from '@/utils'
import { MATCH_TYPE } from '@/constant'
import filterHeader from './components/filterHeader.vue'
// import moment from 'moment'

export default {
  name: 'pageHome',
  components: {
    timeTable,
    filterHeader
  },
  data: () => ({
    // 用户每周空闲时间列表
    freeTimeList: ['1-1', '4-3', '7-1'],
    // 当前周比赛时间列表
    matchTimeList: ['1-1', '4-3'],
    // 当前时间所处周日期，可切换为未来时间的周
    weekDayDate: [],
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
            text: '查看下一周',
            event: 'getNextWeekData',
            icon: 'mdi'
          }
        ]
      }
    ],
    // 过滤组件配置，默认显示全部比赛列表
    filterConfig: {
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
          label: '比赛时间类型',
          key: 'matchTimeType',
          value: '',
          selectItem: [MATCH_TYPE.FREE_MATCH, MATCH_TYPE.CLASS_MATCH, MATCH_TYPE.LEAGUE_MATCH]
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
    this.weekDayDate = getWeekDays()
    // 初始化过滤条件中日期范围为当周初末
    this.filterConfig.filterList.forEach((item) => {
      if (item.type === 'dateRange') {
        item.value.push(this.weekDayDate[0])
        item.value.push(this.weekDayDate[this.weekDayDate.length - 1])
      }
    })
  },
  computed: {
  },
  methods: {
    toggleWeekShow () {
      this.showAllMatchList = false
      this.filterConfig.filterList = this.showWeekFilterList
    },
    toggleAllShow () {
      this.showAllMatchList = true
      this.filterConfig.filterList = this.showAllFilterList
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
      display: flex;
      flex-direction: column;
    }
  }
</style>
