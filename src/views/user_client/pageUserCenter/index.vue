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
              <v-btn color="primary" @click="openEditDialog('password')">修改密码</v-btn>
            </div>
          </div>
        </v-card>
        <v-card class="user-match" v-show="chooseTab === 'userMatch'">
          我的比赛
        </v-card>
        <v-card class="user-time-table" v-show="chooseTab === 'userTimeTable'">
          <time-table :time-table-type="timeTableType"></time-table>
        </v-card>
      </div>
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
            <div class="edit-base"></div>
            <div class="edit-password"></div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              color="error"
              @click="dialogConfig.open = false"
            >关闭</v-btn>
            <v-btn
              color="primary"
              @click="dialogConfig.open = false"
            >保存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
import { getCurrentUserInfo } from '@/http/user'
import { USER_LEVEL } from '@/constant'
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
      editInfo: {},
      type: '',
      event: ''
    }
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
    getUserInfo () {
      getCurrentUserInfo().then(res => {
        if (res.success) {
          this.userInfo = res.data
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
