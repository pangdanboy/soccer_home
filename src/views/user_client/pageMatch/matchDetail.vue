<template>
  <div id="match_detail">
    <detail :detail-config="detailConfig">
      <template #content>
        <div class="match-area">
          <v-chip class="ma-2" color="primary">
            <v-icon left>
              mdi-soccer-field
            </v-icon>
            <p style="margin: 0; font-size: 14px; font-weight: bold;">
              比赛场地：{{ matchInfo.matchArea }}
            </p>
          </v-chip>
          <v-img src="./../../../static/images/home.jpg"></v-img>
        </div>
        <div class="match-info">
          <v-chip class="ma-2" color="primary">
            <v-icon left>
              mdi-list-box-outline
            </v-icon>
            <h3 style="margin: 0; font-size: 16px; font-weight: bold;">
             比赛信息
            </h3>
          </v-chip>
          <div class="match-info-detail">
            <div class="match-name">
              <v-chip class="ma-2" color="primary">
                <v-icon left>
                  mdi-application-edit-outline
                </v-icon>
                <p style="margin: 0; font-size: 14px;">比赛名称：{{ matchInfo.matchName }}</p>
              </v-chip>
            </div>
            <div class="match-type">
              <v-chip class="ma-2" color="primary">
                <v-icon left>
                  mdi-format-list-bulleted-type
                </v-icon>
                <p style="margin: 0; font-size: 14px;" v-show="matchInfo.matchType === '1'">比赛类型：自由比赛</p>
                <p style="margin: 0; font-size: 14px;" v-show="matchInfo.matchType === '2'">比赛类型：课程比赛</p>
                <p style="margin: 0; font-size: 14px;" v-show="matchInfo.matchType === '3'">比赛类型：联盟比赛</p>
              </v-chip>
            </div>
            <div class="match-date">
              <v-chip class="ma-2" color="primary">
                <v-icon left>
                  mdi-book-open-blank-variant
                </v-icon>
                <p style="margin: 0; font-size: 14px;">
                  比赛时间：{{ matchInfo.matchDate.split('T')[0] + '-' + CLASS_TIME_PARAMS_MAP[matchInfo.matchClassTime].name + '-' + CLASS_TIME_PARAMS_MAP[matchInfo.matchClassTime].time}}
                </p>
              </v-chip>
            </div>
            <div class="match-des">
              <v-icon left style="color: #ffffff;">
                mdi-book-open-outline
              </v-icon>
              <span>比赛描述：</span>
              <p style="margin: 0; font-size: 14px;">{{ matchInfo.matchDescription }}</p>
            </div>
            <div class="match-gamers">
              <v-icon left style="color: #ffffff;">
                mdi-account-group-outline
              </v-icon>
              <span>比赛参赛人员({{ matchInfo.matchGamerList.length }}/10)：</span>
              <div class="gamer-list">
                <template v-for="(item) in matchGamerInfo">
                  <v-chip class="ma-2" color="green" link :key="item._id">
                    <v-icon left>
                      mdi-account-outline
                    </v-icon>
                    <p style="margin: 0; font-size: 14px;">{{ item.username }}</p>
                  </v-chip>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #operate>
        <v-btn
          color="primary"
          @click="openDialog('in')"
          v-show="!matchInfo.matchGamerList.includes($store.state.UserInfo.id)"
        >参加比赛</v-btn>
        <v-btn
          color="error"
          @click="openDialog('out')"
          v-show="matchInfo.matchGamerList.includes($store.state.UserInfo.id)"
        >退出比赛</v-btn>
      </template>
    </detail>
    <!-- 二次确认 -->
    <common-dialog :dialog-config="dialogConfig" @join="joinMatch" @quit="quitMatch" @close="closeDialog"></common-dialog>
  </div>
</template>

<script>
import detail from '@/components/detail'
import { getMatchById, joinMatch, quitMatch } from '@/http/match'
import { CLASS_TIME_PARAMS_MAP } from '@/constant'
import commonDialog from '@/components/commonDialog'
import { mapMutations } from 'vuex'
import { getUserByIds } from '@/http/user'

export default {
  name: 'matchDetail',
  components: {
    detail,
    commonDialog
  },
  mounted () {
    this.getMatchData()
  },
  data: () => ({
    detailConfig: {
      className: 'match-detail',
      icon: 'mdi-soccer',
      title: '赛事详情',
      subTitle: '赛事详细信息，点击参加比赛，来绿茵场上尽情挥洒汗水吧！'
    },
    // 赛事信息
    matchInfo: {},
    // 赛事参加人员信息，根据matchInfo中的参赛人员列表查询获得
    matchGamerInfo: [],
    // 二次确认弹框配置
    dialogConfig: {
      // 弹框打开与否
      status: false,
      // 弹框标题
      title: '',
      // 弹框内容
      content: '',
      // 弹框确认触发事件
      event: ''
    },
    CLASS_TIME_PARAMS_MAP
  }),
  computed: {
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    getMatchData () {
      const { matchId } = this.$route.query
      // 查询赛事信息
      getMatchById({ matchId: matchId }).then(res => {
        console.log(res)
        if (res.success) {
          this.matchInfo = res.data
          // 查询所有参赛者信息，初始化下拉框数据
          getUserByIds({ userIds: this.matchInfo.matchGamerList }).then(userInfoList => {
            this.matchGamerInfo = userInfoList.data
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.OPEN_MESSAGE({
            content: res.message,
            type: 'error',
            timeout: 3000
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    openDialog (type) {
      if (this.matchInfo.matchType === '3') {
        this.OPEN_MESSAGE({
          content: type === 'in' ? '联盟比赛参赛人员由官方指定，不能参与！' : '联盟比赛参赛人员由官方指定，如果需要退出，请联系相关负责人！',
          type: 'warning',
          timeout: 3000
        })
        return
      }
      this.dialogConfig.status = true
      if (type === 'in') {
        this.dialogConfig.title = '参加比赛'
        this.dialogConfig.content = '你确认参加该场比赛吗？'
        this.dialogConfig.event = 'join'
      } else {
        this.dialogConfig.title = '退出比赛'
        this.dialogConfig.content = '你确认退出该场比赛吗？'
        this.dialogConfig.event = 'quit'
      }
    },
    closeDialog () {
      this.dialogConfig.status = false
    },
    quitMatch () {
      console.log('退出比赛')
      const { matchId } = this.$route.query
      quitMatch({ matchId: matchId }).then(res => {
        console.log(res)
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        if (res.success) this.getMatchData()
      }).catch(err => {
        console.log(err)
      })
      this.closeDialog()
    },
    joinMatch () {
      console.log('参加比赛')
      const { matchId } = this.$route.query
      joinMatch({ matchId: matchId }).then(res => {
        console.log(res)
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        if (res.success) this.getMatchData()
      }).catch(err => {
        console.log(err)
      })
      this.closeDialog()
    }
  }
}
</script>

<style scoped lang="scss">
  #match_detail{
    width: 100vw;
    height: 100vh;
    background-image: url('./../../../static/images/match.jpg');
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .match-detail{
      width: 85%;
      height: 90%;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 5px;
      ::v-deep .v-card__text {
        width: 100%;
        height: 75%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        .match-area{
          width: 45%;
          height: 100%;
          .v-image{
            width: 100%;
            height: 80%;
            border-radius: 5px;
          }
        }
        .match-info{
          width: 50%;
          height: 100%;
          .match-info-detail{
            width: 100%;
            height: 80%;
            border: 2px solid #1976d2;
            border-radius: 5px;
            .match-des, .match-gamers{
              max-height: 33%;
              border-radius: 10px;
              overflow: auto;
              background-color: #1976d2;
              margin: 8px;
              padding: 2px 6px;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
</style>
