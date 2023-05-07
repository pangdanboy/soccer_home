<template>
  <div id="admin">
    <div class="nav">
      <v-card style="height: 100%;">
        <v-navigation-drawer
          permanent
        >
          <!-- 用户信息 -->
          <v-list>
            <v-list-item class="px-2">
              <v-list-item-avatar>
                <v-img :src="userInfo.avatar"></v-img>
              </v-list-item-avatar>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ userInfo.username }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <!-- 导航选项 -->
          <v-list-item-group dense>
            <v-list-item link to="/pageAdmin" exact>
              <v-list-item-icon>
                <v-icon>mdi-folder</v-icon>
              </v-list-item-icon>
              <v-list-item-title>服务总览</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/pageAdmin/matchManage">
              <v-list-item-icon>
                <v-icon>mdi-folder</v-icon>
              </v-list-item-icon>
              <v-list-item-title>比赛管理</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/pageAdmin/areaManage">
              <v-list-item-icon>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-title>场地管理</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/pageAdmin/userManage">
              <v-list-item-icon>
                <v-icon>mdi-star</v-icon>
              </v-list-item-icon>
              <v-list-item-title>用户管理</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/pageAdmin/authManage">
              <v-list-item-icon>
                <v-icon>mdi-star</v-icon>
              </v-list-item-icon>
              <v-list-item-title>权限管理</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/pageHome">
              <v-list-item-icon>
                <v-icon>mdi-star</v-icon>
              </v-list-item-icon>
              <v-list-item-title>返回首页</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-navigation-drawer>
      </v-card>
    </div>
    <div class="content">
      <div class="default" v-show="this.$route.name === 'overview'">
        <v-card width="96%" height="97%">
          <v-card-title style="display: flex; justify-content: space-between">
            <div class="text-h4 mb-2">
              五人制足球后台管理系统
            </div>
            <div class="text-h6 font-weight-regular grey--text">
              {{ systemInfo.nowDate }}-{{ systemInfo.weekDay }}
            </div>
          </v-card-title>
          <v-img
            :aspect-ratio="16/6"
            src="./../../../static/images/home.jpg" >
          </v-img>
          <v-divider class="mt-6 mx-4"></v-divider>
          <v-card-text>
            <v-chip class="mr-2">
              <v-icon left>
                mdi-soccer
              </v-icon>
              今日比赛场数：{{ systemInfo.nowDateMatchCount }}
            </v-chip>
            <v-chip class="mr-2">
              <v-icon left>
                mdi-alarm-check
              </v-icon>
              历史比赛场数：{{ systemInfo.totalMatchCount }}
            </v-chip>
            <v-chip class="mr-2">
              <v-icon left>
                mdi-soccer
              </v-icon>
              今日参加比赛人数：{{ systemInfo.nowDateMatchGamerCount }}
            </v-chip>
            <v-chip>
              <v-icon left>
                mdi-blinds
              </v-icon>
             历史参加比赛人数：{{ systemInfo.totalMatchGamerCount }}
            </v-chip>
          </v-card-text>
        </v-card>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { getSystemInfo } from '@/http/system'
import { getCurrentUserInfo } from '@/http/user'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'overview',
  data: () => ({
    defaultActive: 0,
    userInfo: {},
    systemInfo: {}
  }),
  mounted () {
    this.getUserInfo()
    this.getSystemInfo()
  },
  methods: {
    // 获取用户信息
    getUserInfo () {
      getCurrentUserInfo().then(res => {
        console.log(res)
        this.userInfo = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取系统信息
    getSystemInfo () {
      getSystemInfo().then(res => {
        this.systemInfo = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #admin{
    width: 100vw;
    height: 100vh;
    display: flex;
    .nav{
      width: 15%;
      height: 100%;
    }
    .content{
      width: 85%;
      height: 100%;
      .default{
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  }
</style>
