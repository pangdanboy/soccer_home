<template>
  <div id="week_match_list">
    <v-dialog v-model="dialog" width="500px">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ weekMatchListConfig.title }}
        </v-card-title>
        <v-card-subtitle>{{ weekMatchListConfig.time }}</v-card-subtitle>

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
            @click="() => this.$emit('close')"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'weekMatchList',
  props: {
    weekMatchListConfig: {
      type: Object,
      required: true,
      default: () => ({})
    }
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
        this.$emit('weekDayMatchListPageChange', this.userMatchListOptions.page)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
