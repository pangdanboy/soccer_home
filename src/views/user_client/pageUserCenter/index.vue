<template>
    <div id="user_center">
      <div class="user-nav">
        <v-card height="550px">
          <v-navigation-drawer permanent>
            <template v-slot:prepend>
              <v-list-item two-line>
                <v-list-item-avatar>
                  <img :src="userInfo.avatar">
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ userInfo.username }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-divider></v-divider>
            <v-list-item-group dense active-class="tab-active text--accent-4" v-model="defaultActive">
              <v-list-item
                v-for="item in userCenterTabs"
                :key="item.key"
                link
                :active="item.active"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content @click="choose(item.key)">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-navigation-drawer>
        </v-card>
      </div>
      <div class="tab-box">
        <div class="base-info" v-show="chooseTab === 'baseInfo'">
          <div class="base-info-box">
            <div>
              <v-icon>mdi-account</v-icon>
              <p>用户名：{{ userInfo.username }}</p>
            </div>
            <div>
              <v-icon>mdi-draw</v-icon>
              <p>个性签名：{{ userInfo.signature }}</p>
            </div>
            <div style="display: flex; align-items: center">
              <v-icon>mdi-email</v-icon>
              <p>绑定邮箱：{{ userInfo.email }}</p>
            </div>
            <div>
              <v-icon>mdi-security</v-icon>
              <p>用户级别：{{ userLevel }}</p>
            </div>
            <div>
              <v-icon>mdi-soccer</v-icon>
              <p>参赛场数：{{ 2 }}</p>
            </div>
            <div>
              <v-icon>mdi-format-list-numbered</v-icon>
              <p>我的排名：{{ 2 }}</p>
            </div>
            <div class="base-info-operation">
              <v-btn style="margin-right: 40px;" color="primary" @click="openEditDialog('base')">修改信息</v-btn>
              <v-btn color="primary" @click="openEditDialog('pwd')">修改密码</v-btn>
            </div>
          </div>
        </div>
        <div class="user-match" v-show="chooseTab === 'userMatch'">
          <v-tabs v-model="userMatchType">
            <v-tab>我参加的比赛</v-tab>
            <v-tab>我创建的比赛</v-tab>
          </v-tabs>
          <div class="user-match-list">
            <v-data-table
              :headers="matchListHeaders"
              :items="userMatchList"
              :options.sync="userMatchListOptions"
              :server-items-length="userMatchTotalCount"
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
                      v-show="userMatchType === 1"
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
                      v-show="userMatchType === 1"
                      @click="editMatch(item)"
                      style="cursor: pointer;"
                      v-bind="attrs" v-on="on"
                    >mdi-square-edit-outline</v-icon>
                  </template>
                  <span>编辑比赛</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </div>
        </div>
        <div class="user-time-table" v-show="chooseTab === 'userTimeTable'">
          <time-table :time-table-type="timeTableType" :free-time-list="userInfo.freeTimeList" @freeTimeListEdit="freeTimeListEdit"></time-table>
        </div>
      </div>
      <!-- 修改信息-->
      <v-dialog
        transition="dialog-top-transition"
        max-width="600"
        v-model="dialogConfig.open"
      >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >{{ dialogConfig.type === 'base'? '修改信息':'修改密码' }}</v-toolbar>
          <v-card-text>
            <div class="edit-base" v-show="dialogConfig.type === 'base'">
              <v-form ref="editBaseInfoForm" v-model="editBaseInfoValid">
                <v-text-field
                  v-model="dialogConfig.editInfo.baseInfoConfig.username"
                  :rules="usernameRules"
                  label="用户名"
                  :counter="16"
                  required
                  clearable
                ></v-text-field>
                <v-text-field
                  v-model="dialogConfig.editInfo.baseInfoConfig.signature"
                  :rules="signatureRules"
                  label="个性签名"
                  :counter="16"
                  required
                  clearable
                ></v-text-field>
                <v-text-field
                  v-model="dialogConfig.editInfo.baseInfoConfig.email"
                  :rules="emailRules"
                  label="邮箱"
                  required
                  clearable
                ></v-text-field>
                <div class="code" style="display: flex; align-items: center">
                  <v-text-field
                    v-model="dialogConfig.editInfo.baseInfoConfig.code"
                    label="验证码"
                    required
                    clearable
                    :disabled="verifyCode.length === 0"
                    style="margin-right: 10px"
                  ></v-text-field>
                  <v-btn @click="handleVerify" :disabled="verifyProcess || dialogConfig.editInfo.baseInfoConfig.email === userInfo.email  ">{{ verifyProcess ? countDown:'获取验证码' }}</v-btn>
                </div>
              </v-form>
            </div>
            <div class="edit-password" v-show="dialogConfig.type === 'pwd'">
              <v-form ref="editPasswordForm" v-model="editPasswordValid">
                <v-text-field
                  v-model="dialogConfig.editInfo.passwordConfig.newPassword.value"
                  :rules="passwordRules"
                  label="新的密码"
                  :counter="16"
                  required
                  clearable
                  :type="dialogConfig.editInfo.passwordConfig.newPassword.show ? 'text' : 'password'"
                >
                  <template slot="append">
                    <v-icon
                      style="cursor: pointer;"
                      @click="() => dialogConfig.editInfo.passwordConfig.newPassword.show = !dialogConfig.editInfo.passwordConfig.newPassword.show"
                    >
                      {{ dialogConfig.editInfo.passwordConfig.newPassword.show ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
                    </v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="dialogConfig.editInfo.passwordConfig.confirmPassword.value"
                  :rules="passwordRules"
                  label="确认密码"
                  required
                  clearable
                  :counter="16"
                  :type="dialogConfig.editInfo.passwordConfig.confirmPassword.show ? 'text' : 'password'"
                >
                  <template slot="append">
                    <v-icon
                      style="cursor: pointer;"
                      @click="() => dialogConfig.editInfo.passwordConfig.confirmPassword.show = !dialogConfig.editInfo.passwordConfig.confirmPassword.show"
                    >
                      {{ dialogConfig.editInfo.passwordConfig.confirmPassword.show ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
                    </v-icon>
                  </template>
                </v-text-field>
              </v-form>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              color="error"
              @click="dialogConfig.open = false"
            >关闭</v-btn>
            <v-btn
              color="primary"
              v-show="dialogConfig.type === 'base'"
              :disabled="!editBaseInfo"
              @click="baseInfoEdit"
            >修改</v-btn>
            <v-btn
              color="primary"
              v-show="dialogConfig.type === 'pwd'"
              @click="passwordEdit"
            >修改</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- 删除比赛二次确认弹框 -->
      <common-dialog :dialog-config="deleteDialogConfig" @close="closeDeleteDialog" @delete="deleteMatch"></common-dialog>
    </div>
</template>

<script>
import { getCurrentUserInfo, getVerify, editUserInfo } from '@/http/user'
import { userJoinMatch, userCreateMatch, deleteMatch } from '@/http/match'
import { USER_LEVEL, CLASS_TIME_PARAMS_MAP, MATCH_TYPE_PARAMS_MAP } from '@/constant'
import { mapMutations } from 'vuex'
import timeTable from '@/components/timeTable.vue'
import commonDialog from '@/components/commonDialog.vue'

export default {
  name: 'pageUserCenter',
  components: {
    timeTable,
    commonDialog
  },
  data: () => ({
    userCenterTabs: [
      {
        title: '基本信息',
        icon: 'mdi-account',
        key: 'baseInfo'
      },
      {
        title: '我的比赛',
        icon: 'mdi-soccer',
        key: 'userMatch'
      },
      {
        title: '我的课表',
        icon: 'mdi-book-open-variant',
        key: 'userTimeTable'
      }
    ],
    defaultActive: 0,
    chooseTab: 'baseInfo',
    userInfo: {},
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
    },
    // 用户比赛列表总数
    userMatchTotalCount: 0,
    // 用户比赛列表
    userMatchList: [],
    // 用户比赛类型(参加or创建)
    userMatchType: null,
    timeTableType: 'operation',
    // 信息修改弹框配置
    dialogConfig: {
      open: false,
      editInfo: {
        baseInfoConfig: {},
        passwordConfig: {
          newPassword: {
            value: '',
            show: false
          },
          confirmPassword: {
            value: '',
            show: false
          }
        }
      },
      type: '',
      event: ''
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
    },
    // 修改基本信息表单校验标志
    editBaseInfoValid: false,
    // 基本信息是否发生变化
    editBaseInfo: false,
    // 修改密码表单校验标志
    editPasswordValid: false,
    // 基本信息校验规则
    usernameRules: [
      v => !!v || '昵称不能为空！',
      v => v.length <= 16 || '长度不能超过16！'
    ],
    signatureRules: [
      v => !!v || '个性签名不能为空！',
      v => v.length <= 16 || '长度不能超过16！'
    ],
    emailRules: [
      v => !!v || '邮箱不能为空！',
      v => /.+@.+\..+/.test(v) || '邮箱格式不正确！'
    ],
    // 密码校验规则
    passwordRules: [
      v => !!v || '密码不能为空！',
      v => v.length <= 16 || '长度不能超过16！'
    ],
    // 验证码相关
    verifyProcess: false,
    verifyTimer: null,
    countDown: 60,
    verifyCode: ''
  }),
  computed: {
    userLevel: function () {
      return USER_LEVEL[this.userInfo.role]
    }
  },
  mounted () {
    // 查询用户信息
    this.getUserInfo()
    // 查询用户参加比赛列表
    this.getUserJoinMatchList()
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    getUserInfo () {
      getCurrentUserInfo().then(res => {
        if (res.success) {
          this.userInfo = res.data
          this.dialogConfig.editInfo.baseInfoConfig = JSON.parse(JSON.stringify(this.userInfo))
          this.dialogConfig.editInfo.code = ''
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getUserJoinMatchList () {
      userJoinMatch({
        page: this.userMatchListOptions.page,
        limit: this.userMatchListOptions.itemsPerPage
      }).then(res => {
        console.log(res)
        if (res.success) this.userMatchList = res.data
        this.userMatchTotalCount = res.count
        // 处理数据，处理数据中比赛的日期和时间
        this.handlerMatchData()
      }).catch(err => {
        console.log(err)
      })
    },
    getUserCreateMatchList () {
      userCreateMatch({
        page: this.userMatchListOptions.page,
        limit: this.userMatchListOptions.itemsPerPage
      }).then(res => {
        console.log(res)
        if (res.success) this.userMatchList = res.data
        this.userMatchTotalCount = res.count
        // 处理数据，处理数据中比赛的日期和时间
        this.handlerMatchData()
      }).catch(err => {
        console.log(err)
      })
    },
    handlerMatchData () {
      this.userMatchList.forEach(item => {
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
      console.log('删除比赛：', this.deleteDialogConfig.deleteMatchId)
      deleteMatch({ matchId: this.deleteDialogConfig.deleteMatchId }).then(res => {
        console.log(res)
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        // 重新加载用户创建比赛列表
        this.getUserCreateMatchList()
      }).catch(err => {
        console.log(err)
      })
    },
    editMatch (match) {
      console.log('编辑比赛', match)
      // 跳转到比赛编辑页
      this.$router.push('/pageMatch?matchId=' + match._id)
    },
    checkMatchDetail (match) {
      console.log('查看详情')
      console.log(match)
      const { _id: matchId } = match
      // 跳转到比赛详情页，传递matchId
      this.$router.push('/pageMatchDetail?matchId=' + matchId)
    },
    choose (tab) {
      this.chooseTab = tab
    },
    openEditDialog (type) {
      console.log(type)
      this.dialogConfig.open = true
      this.dialogConfig.type = type
    },
    handleVerify () {
      // 校验邮箱格式
      const emailVerify = /.+@.+\..+/.test(this.dialogConfig.editInfo.baseInfoConfig.email)
      if (emailVerify) {
        // 向邮箱发送验证码
        getVerify({
          email: this.dialogConfig.editInfo.baseInfoConfig.email
        }).then(res => {
          if (res.success) {
            this.verifyCode = res.data.verifyCode
            this.verifyProcess = true
            this.verifyTimer = setInterval(() => {
              this.countDown -= 1
              if (this.countDown === 0) {
                clearInterval(this.verifyTimer)
                this.verifyProcess = false
                this.countDown = 60
              }
            }, 1000)
          }
          this.OPEN_MESSAGE({
            content: res.message,
            type: res.success ? 'success' : 'error',
            timeout: 3000
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.OPEN_MESSAGE({
          content: '邮箱格式错误！',
          type: 'error',
          timeout: 3000
        })
      }
    },
    baseInfoEdit () {
      // 调用表单校验方法
      const editBaseInfoForm = this.$refs.editBaseInfoForm.validate()
      if (editBaseInfoForm) {
        // 判断邮箱是否发生修改，如果修改了，需要校验验证码
        if (this.dialogConfig.editInfo.baseInfoConfig.email !== this.userInfo.email) {
          if (!this.verifyCode) {
            this.OPEN_MESSAGE({
              content: '请校验邮箱',
              type: 'warning',
              timeout: 3000
            })
            return
          }
          // 校验验证码
          if (!this.dialogConfig.editInfo.code) {
            this.OPEN_MESSAGE({
              content: '请填写验证码',
              type: 'warning',
              timeout: 3000
            })
            return
          }
          if (this.dialogConfig.editInfo.code !== this.verifyCode) {
            this.OPEN_MESSAGE({
              content: '验证码错误',
              type: 'error',
              timeout: 3000
            })
            return
          }
          this.confirmEdit('base')
        }
        this.confirmEdit('base')
      } else {
        this.OPEN_MESSAGE({
          content: '请检查你填写的信息',
          type: 'error',
          timeout: 3000
        })
      }
    },
    passwordEdit () {
      // 调用表单校验方法
      const editPasswordForm = this.$refs.editPasswordForm.validate()
      if (editPasswordForm) {
        // 校验用户填写的两次密码是否一致
        if (this.dialogConfig.editInfo.passwordConfig.newPassword.value === this.dialogConfig.editInfo.passwordConfig.confirmPassword.value) {
          this.confirmEdit('pwd')
        } else {
          this.OPEN_MESSAGE({
            content: '两次密码不一致',
            type: 'error',
            timeout: 3000
          })
        }
      } else {
        this.OPEN_MESSAGE({
          content: '请检查你填写的信息',
          type: 'error',
          timeout: 3000
        })
      }
    },
    freeTimeListEdit (list) {
      this.confirmEdit('freeTimeList', list)
    },
    confirmEdit (type, list) {
      const editParams = {}
      editParams.type = type
      if (type === 'base') {
        editParams.username = this.dialogConfig.editInfo.baseInfoConfig.username
        editParams.signature = this.dialogConfig.editInfo.baseInfoConfig.signature
        editParams.email = this.verifyCode ? this.dialogConfig.editInfo.baseInfoConfig.email : ''
      } else if (type === 'pwd') {
        editParams.password = this.dialogConfig.editInfo.passwordConfig.newPassword.value
      } else {
        editParams.freeTimeList = list
      }
      editUserInfo(editParams).then(res => {
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        this.dialogConfig.open = !res.success
        if (res.success) {
          if (type === 'password') this.$refs.editPasswordForm.reset()
          this.getUserInfo()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    dialogConfig: {
      handler (n, o) {
        if (n.editInfo.baseInfoConfig.username !== this.userInfo.username ||
            n.editInfo.baseInfoConfig.signature !== this.userInfo.signature ||
            n.editInfo.baseInfoConfig.email !== this.userInfo.email) {
          this.editBaseInfo = true
        } else {
          this.editBaseInfo = false
        }
      },
      deep: true
    },
    // 切换查看比赛类型，重置分页和每页条数
    userMatchType: function (newVal) {
      // 使userMatchListOptions发生变化触发查询
      this.userMatchListOptions.userMatchType = newVal
      this.userMatchListOptions.page = 1
      this.userMatchListOptions.itemsPerPage = 5
    },
    userMatchListOptions: {
      handler () {
        if (this.userMatchType === 0) this.getUserJoinMatchList()
        if (this.userMatchType === 1) this.getUserCreateMatchList()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  #user_center{
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .user-nav{
      width: 180px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      margin-right: 5px;
    }
    .tab-box{
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      width: 1000px;
      height: 550px;
      background-image: url('./../../../static/images/user_center.jpg');
      background-size: cover;
      overflow: auto;
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
      .base-info,.user-match{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.5);
      }
      .user-match{
        ::v-deep .v-tabs{
          width: 100%;
          height: 8%;
        }
        .user-match-list{
          background-color: #fff;
          width: 100%;
          height: 92%;
        }
      }
      .user-time-table{
        width: 100%;
        height: 100%;
      }
      .base-info{
        .base-info-box{
          width: 60%;
          height: 70%;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          div{
            width: 60%;
            padding-left: 15px;
            margin-bottom: 23px;
            display: flex;
            p{
              margin: 0 0 0 5px;
              font-size: 18px;
            }
          }
        }
      }
    }
    @media screen and (min-width: 1411px) {
      .user-nav{
        .v-card{
          height: 850px !important;
        }
      }
      .tab-box{
        height: 850px;
        width: 1500px;
        .base-info{
          .base-info-box{
            div{
              margin-bottom: 50px;
              p{
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }
</style>
