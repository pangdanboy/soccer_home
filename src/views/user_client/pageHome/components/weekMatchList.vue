<template>
  <div id="week_match_list">
    <v-dialog v-model="dialog" width="700px">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 mb-2 flex-column">
          {{ weekMatchListConfig.title }}
          <span style="font-size: 14px;">{{ weekMatchListConfig.time }}</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
               <span
                 class="tips"
                 style="color: #e84134; font-size: 14px;"
                 v-show="!weekMatchListConfig.free && USER_LOGIN_STATUS"
                 v-on="on"
                 v-bind="attrs"
               >
                 <v-icon style="color: #e84134; font-size: 16px;">mdi-alert-circle-outline</v-icon>
                 <span>该时间段存在课程，请注意时间安排</span>
               </span>
            </template>
            <span>你的课表显示你该时间段存在课程安排或者其他安排；或者你未初始化课表状态，进入个人中心-我的课表进行更改</span>
          </v-tooltip>
        </v-card-title>

        <v-card-text>
          <v-data-table
            :headers="matchListHeaders"
            :items="weekMatchListConfig.matchList"
            :options.sync="userMatchListOptions"
            :server-items-length="weekMatchListConfig.totalCount"
            :footer-props="{'items-per-page-options':[5]}"
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
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="closeDialog"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'weekMatchList',
  props: {
    weekMatchListConfig: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['USER_LOGIN_STATUS'])
  },
  data: () => ({
    dialog: false,
    // 比赛数据表格的头
    matchListHeaders: [
      { text: '比赛名称', value: 'matchName' },
      { text: '比赛类型', value: 'matchType' },
      { text: '比赛日期', value: 'matchDate' },
      { text: '比赛时间', value: 'matchClassTime' },
      { text: '操作', value: 'operate' }
    ],
    userMatchListOptions: {
      userMatchType: ''
    }
  }),
  methods: {
    checkMatchDetail (match) {
      const { _id: matchId } = match
      // 跳转到比赛详情页，传递matchId
      this.$router.push('/pageMatchDetail?matchId=' + matchId)
    },
    closeDialog () {
      this.userMatchListOptions.page = 1
      this.$emit('close')
    }
  },
  watch: {
    weekMatchListConfig: {
      handler () {
        if (this.weekMatchListConfig.status) {
          this.dialog = true
        } else {
          this.dialog = false
        }
      },
      deep: true
    },
    userMatchListOptions: {
      handler () {
        this.$emit('pageChange', this.userMatchListOptions.page)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
