<template>
  <div id="match_manage">
    <detail :detail-config="detailConfig">
      <template #content>
        <filter-header :filter-config="filterConfig" @getDataList="getMatchList" @addMatch="addMatch"></filter-header>
        <v-data-table
          :headers="matchListHeaders"
          :items="matchList"
          :options.sync="matchListOptions"
          :server-items-length="matchTotalCount"
          :footer-props="{'items-per-page-options':[5, 10]}"
          class="elevation-1"
          disable-sort
          style="box-shadow: none !important;"
        >
          <template v-slot:item.operate="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="checkMatchDetail(item)"
                  style="cursor: pointer; margin-right: 10px;"
                  v-bind="attrs" v-on="on"
                >mdi-text-search-variant</v-icon>
              </template>
              <span>查看详情</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="openDeleteDialog(item)"
                  style="cursor: pointer; margin-right: 10px;"
                  v-bind="attrs" v-on="on"
                >mdi-trash-can-outline</v-icon>
              </template>
              <span>删除比赛</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="editMatch(item)"
                  style="cursor: pointer;"
                  v-bind="attrs" v-on="on"
                >mdi-square-edit-outline</v-icon>
              </template>
              <span>编辑比赛</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </template>
    </detail>
    <!-- 删除比赛二次确认弹框 -->
    <common-dialog :dialog-config="deleteDialogConfig" @close="closeDeleteDialog" @delete="deleteMatch"></common-dialog>
  </div>
</template>

<script>
import detail from '@/components/detail'
import filterHeader from '@/components/filterHeader'
import { CLASS_TIME_PARAMS_MAP, MATCH_TYPE, MATCH_TYPE_PARAMS, MATCH_TYPE_PARAMS_MAP } from '@/constant'
import { deleteMatch, queryMatch } from '@/http/match'
import commonDialog from '@/components/commonDialog'
import { mapMutations } from 'vuex'
export default {
  name: 'matchMange',
  components: {
    detail,
    filterHeader,
    commonDialog
  },
  data: () => ({
    // 比赛列表数据
    matchList: [],
    // 比赛总数
    matchTotalCount: 0,
    // 比赛数据表格的头
    matchListHeaders: [
      { text: '比赛名称', value: 'matchName' },
      { text: '比赛类型', value: 'matchType' },
      { text: '比赛日期', value: 'matchDate' },
      { text: '比赛时间', value: 'matchClassTime' },
      { text: '操作', value: 'operate' }
    ],
    // 比赛表格配置信息
    matchListOptions: {},
    detailConfig: {
      className: 'match-manage',
      icon: 'mdi-soccer',
      title: '赛事管理',
      subTitle: '系统赛事列表中心，可对所有比赛进行管理统计'
    },
    // 过滤组件配置，默认显示全部比赛列表
    filterConfig: {
      // 是否查看所有比赛列表
      all: true,
      size: 'small',
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
            // {
            //   text: '导出',
            //   event: 'exportMatch',
            //   icon: 'mdi-database-export-outline'
            // },
            {
              text: '添加',
              event: 'addMatch',
              icon: 'mdi-plus-circle-outline'
            }
          ]
        }
      ]
    },
    // 删除比赛二次确认弹框配置
    deleteDialogConfig: {
      // 弹框打开与否
      status: false,
      // 弹框标题
      title: '删除比赛',
      // 弹框内容
      content: '你确定删除该比赛吗？比赛删除后不可恢复，请再次确认你的操作！',
      // 弹框确认触发事件
      event: 'delete',
      // 待删除的比赛id
      deleteMatchId: ''
    }
  }),
  mounted () {
    this.getMatchList()
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    // exportMatch () {
    //   matchExport('比赛列表', this.matchList)
    // },
    addMatch () {
      this.$router.push('/pageMatch')
    },
    getMatchList (page) {
      const query = {}
      query.page = this.matchListOptions.page
      query.limit = this.matchListOptions.itemsPerPage
      this.filterConfig.filterList.forEach((item) => {
        if (item.type !== 'button') query[item.key] = item.value
      })
      // 处理比赛类型参数
      query.matchType = MATCH_TYPE_PARAMS[query.matchType]
      queryMatch(query).then(res => {
        if (!res.success) {
          this.OPEN_MESSAGE({
            content: res.message,
            type: 'error',
            timeout: 3000
          })
        } else {
          this.matchList = res.data
          this.matchTotalCount = res.count
          this.handlerMatchData()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handlerMatchData () {
      this.matchList.forEach(item => {
        item.matchDate = item.matchDate.split('T')[0]
        item.matchType = MATCH_TYPE_PARAMS_MAP[item.matchType]
        item.matchClassTime = CLASS_TIME_PARAMS_MAP[item.matchClassTime].name + '--' + CLASS_TIME_PARAMS_MAP[item.matchClassTime].time
      })
    },
    openDeleteDialog (match) {
      this.deleteDialogConfig.status = true
      this.deleteDialogConfig.deleteMatchId = match._id
    },
    closeDeleteDialog () {
      this.deleteDialogConfig.status = false
    },
    deleteMatch () {
      this.closeDeleteDialog()
      deleteMatch({ matchId: this.deleteDialogConfig.deleteMatchId }).then(res => {
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        // 重新加载比赛列表
        this.getMatchList()
      }).catch(err => {
        console.log(err)
      })
    },
    editMatch (match) {
      // 跳转到比赛编辑页
      this.$router.push('/pageMatch?matchId=' + match._id)
    },
    checkMatchDetail (match) {
      const { _id: matchId } = match
      // 跳转到比赛详情页，传递matchId
      this.$router.push('/pageMatchDetail?matchId=' + matchId)
    }
  },
  watch: {
    matchListOptions: {
      handler () {
        this.getMatchList()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  #match_manage{
    width: 100%;
    height: 100%;
    .match-manage{
      width: 100%;
      height: 100%;
      ::v-deep .v-card{
        width: 100%;
        height: 100%;
        .v-card__title{
          width: 100%;
          height: 10%;
        }
        .v-card__subtitle{
          width: 100%;
          height: 5%;
        }
        .v-card__text{
          width: 100%;
          height: 80%;
          overflow: auto;
        }
        .v-card__actions{
          width: 100%;
          height: 5%;
        }
      }
    }
  }
</style>
