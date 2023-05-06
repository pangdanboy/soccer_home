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
          <template v-for="(item, index) in matchList">
            <match-item :key="item._id" :match-data="item" :class="{'no-margin': (index + 1) % 3 === 0}"></match-item>
          </template>
        </div>
        <div class="page text-center" v-show="showAllMatchList">
          <v-pagination
            v-model="page"
            @input="pageChange"
            :length="Math.ceil(totalCount/limit)"
          ></v-pagination>
        </div>
        <!-- 按一周展示比赛列表，可切换周 -->
        <div class="week-match-list" v-show="!showAllMatchList">
          <time-table
            :free-time-list="freeTimeList"
            :week-day-date="weekDayDate"
            :week-match-list="weekMatchList"
            :time-table-type="timeTableType"
            @openWeekMatchList="openWeekMatchList"
          ></time-table>
        </div>
      </div>
    </div>
    <week-match-list :week-match-list-config="weekMatchListConfig" @close="closeWeekDayDialog" @pageChange="weekDayMatchListPageChange"></week-match-list>
  </div>
</template>

<script>
import timeTable from '@/components/timeTable.vue'
import { getWeekDays } from '@/utils'
import { MATCH_TYPE, MATCH_TYPE_PARAMS, CLASS_TIME_PARAMS_MAP } from '@/constant'
import filterHeader from './components/filterHeader.vue'
import matchItem from '@/views/user_client/pageHome/components/matchItem.vue'
import weekMatchList from '@/views/user_client/pageHome/components/weekMatchList.vue'
import moment from 'moment'
import { queryMatch, getMatchByDateAndTime } from '@/http/match'
import { mapMutations } from 'vuex'

export default {
  name: 'pageHome',
  components: {
    timeTable,
    filterHeader,
    matchItem,
    weekMatchList
  },
  data: () => ({
    // 用户每周空闲时间列表
    freeTimeList: ['1-1', '4-3', '7-1'],
    // 按周查看比赛列表数据
    weekMatchList: [],
    // 当前时间所处周日期，可切换为未来时间的周
    weekDayDate: [],
    // 比赛列表数据
    matchList: [],
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
    },
    // 比赛列表分页相关
    page: 1,
    limit: 9,
    totalCount: 0,
    // 查看指定日期指定讲的比赛弹框配置
    weekMatchListConfig: {
      status: false,
      title: '比赛列表',
      time: '',
      matchList: [],
      date: '',
      classTime: '',
      // 分页相关
      page: 1,
      limit: 5,
      totalCount: 0
    }
  }),
  mounted () {
    // 获取当前日期所处周
    this.weekDayDate = getWeekDays(new Date())
    this.getDataList()
  },
  computed: {
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    // 按周查看比赛
    toggleWeekShow () {
      this.showAllMatchList = false
      this.filterConfig.filterList = this.showWeekFilterList
      this.filterConfig.all = false
      this.getDataList('not')
    },
    // 查看全部比赛
    toggleAllShow () {
      this.showAllMatchList = true
      this.filterConfig.filterList = this.showAllFilterList
      this.filterConfig.all = true
      this.getDataList(1)
    },
    // 获取比赛列表
    getDataList (page) {
      const query = {}
      // 这里重置页码是因为，当筛选条件发生变化之后，分页查询应该从第一页开始
      if (page && page !== 'not') this.page = page
      // 按周查看时不需要分页
      if (page !== 'not') {
        // 添加分页相关参数
        query.page = this.page
        query.limit = this.limit
      }
      this.filterConfig.filterList.forEach((item) => {
        if (item.type !== 'button') query[item.key] = item.value
      })
      // 处理比赛类型参数
      if (query.matchType) query.matchType = MATCH_TYPE_PARAMS[query.matchType]
      // 如果当前是按周查看，添加日期范围参数
      if (!this.showAllMatchList) query.matchDate = [this.weekDayDate[0], this.weekDayDate[this.weekDayDate.length - 1]]
      queryMatch(query).then(res => {
        console.log(res)
        if (!res.success) {
          this.OPEN_MESSAGE({
            content: res.message,
            type: 'error',
            timeout: 3000
          })
        } else {
          this.matchList = res.data
          this.totalCount = res.count
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取上或下一周的比赛数据
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
      // 按周查看时不需要分页查询参数
      this.getDataList('not')
    },
    // 页数变化
    pageChange () {
      this.getDataList()
    },
    // 按周查看时点击存在比赛的天，查询该天的比赛列表
    openWeekMatchList (date, classTime) {
      console.log('查询该天该讲比赛列表', date, classTime)
      this.weekMatchListConfig.status = true
      this.weekMatchListConfig.date = date
      this.weekMatchListConfig.classTime = classTime
      this.weekMatchListConfig.time = date + '-' + CLASS_TIME_PARAMS_MAP[classTime.split('-')[1]].name + '-' + CLASS_TIME_PARAMS_MAP[classTime.split('-')[1]].time
      // 查询该天该讲比赛列表
      this.getWeekDayMatchList()
    },
    getWeekDayMatchList () {
      // 查询该天该讲比赛列表
      getMatchByDateAndTime({
        matchDate: this.weekMatchListConfig.date,
        time: this.weekMatchListConfig.classTime.split('-')[1],
        page: this.weekMatchListConfig.page,
        limit: this.weekMatchListConfig.limit
      }).then(res => {
        this.weekMatchListConfig.matchList = res.data
        this.weekMatchListConfig.totalCount = res.count
      }).catch(err => {
        console.log(err)
      })
    },
    // 改天该讲比赛列表分页发生变化时，重新查询比赛列表
    weekDayMatchListPageChange (page) {
      this.weekMatchListConfig.page = page
      this.getWeekDayMatchList()
    },
    closeWeekDayDialog () {
      this.weekMatchListConfig.status = false
    }
  },
  watch: {
    matchList: function (newVal) {
      // 如果当前是按周查看比赛列表数据，处理
      if (!this.showAllMatchList) {
        this.weekMatchList = newVal
      }
    }
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
        display: flex;
        flex-direction: column;
        align-items: center;
        .all-match-list{
          width: 100%;
          padding: 10px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .no-margin{
            margin-right: 0;
          }
        }
      }
      .page{
        width: 32%;
      }
      .week-match-list{
        width: 100%;
      }
    }
  }
</style>
