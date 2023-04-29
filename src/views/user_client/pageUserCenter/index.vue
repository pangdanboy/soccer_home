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
        <v-card class="base-info" v-show="chooseTab === 'baseInfo'">
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
        </v-card>
        <v-card class="user-match" v-show="chooseTab === 'userMatch'">
          我的比赛
        </v-card>
        <v-card class="user-time-table" v-show="chooseTab === 'userTimeTable'">
          <time-table :time-table-type="timeTableType" :free-time-list="userInfo.freeTimeList" @freeTimeListEdit="freeTimeListEdit"></time-table>
        </v-card>
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
    </div>
</template>

<script>
import { getCurrentUserInfo, getVerify, editUserInfo } from '@/http/user'
import { USER_LEVEL } from '@/constant'
import { mapMutations } from 'vuex'
import timeTable from '@/components/timeTable.vue'

export default {
  name: 'pageUserCenter',
  components: {
    timeTable
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
    timeTableType: 'operation',
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
    this.getUserInfo()
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
      .base-info,.user-match{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.5);
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
