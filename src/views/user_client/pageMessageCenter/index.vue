<template>
  <div id="chat_room">
    <detail :detail-config="detailConfig">
      <template #content>
        <v-data-table
          :headers="messageListHeaders"
          :items="messageList"
          :options.sync="messageListOptions"
          :server-items-length="messageTotalCount"
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
          </template>
        </v-data-table>
      </template>
    </detail>
  </div>
</template>

<script>
import detail from '@/components/detail.vue'
import { queryMessage } from '@/http/message'
import { mapMutations } from 'vuex'

export default {
  name: 'pageMessageCenter',
  components: {
    detail
  },
  data: () => ({
    detailConfig: {
      className: 'message-center',
      icon: 'mdi-soccer',
      title: '消息中心',
      subTitle: '在这里你可以收到所有关于你参加的比赛的信息变动通知，让你不会错过任何一场比赛！'
    },
    // 消息列表数据
    messageList: [],
    // 消息总数
    messageTotalCount: 0,
    // 比赛数据表格的头
    messageListHeaders: [
      { text: '比赛名称', value: 'matchName' },
      { text: '比赛信息变动类型', value: 'messageType' },
      { text: '比赛日期', value: 'matchDate' },
      { text: '变动字段', value: 'changeColumn' },
      { text: '操作', value: 'operate' }
    ],
    // 比赛表格配置信息
    messageListOptions: {}
  }),
  mounted () {
    this.getMessageList()
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    getMessageList () {
      const query = {
        page: this.messageListOptions.page,
        limit: this.messageListOptions.itemsPerPage
      }
      queryMessage(query).then(res => {
        console.log(res)
        this.messageList = res.data
        this.messageTotalCount = res.count
      }).catch(err => {
        console.log(err)
      })
    },
    checkMatchDetail (match) {
      const { matchId } = match
      if (!matchId) {
        this.OPEN_MESSAGE({
          content: '该比赛已被删除！',
          type: 'warning',
          timeout: 3000
        })
        return
      }
      // 跳转到比赛详情页，传递matchId
      this.$router.push('/pageMatchDetail?matchId=' + matchId)
    }
  }
}
</script>

<style scoped lang="scss">
  #chat_room{
    width: 100vw;
    height: 100vh;
    background-image: url('./../../../static/images/message.png');
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .message-center{
      width: 85%;
      height: 90%;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 5px;
    }
  }
</style>
