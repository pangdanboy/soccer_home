<template>
  <v-app>
    <v-card>
      <!-- 导航栏 -->
      <v-app-bar fixed elevate-on-scroll hide-on-scroll v-show="navShow">
        <template v-slot:default>
          <!-- logo -->
          <v-avatar size="49" style="margin-right: 15px;">
            <img src="./static/images/logo.jpg" alt="">
          </v-avatar>
          <!-- 标题 -->
          <v-toolbar-title>足球小窝</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- 路由入口，消息中心、用户中心、登出、创建比赛、以及管理员入口 -->
          <router-link to="/pageMessageCenter" tag="span">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-bell</v-icon>
                </v-btn>
              </template>
              <span>消息中心</span>
            </v-tooltip>
          </router-link>
          <router-link to="/pageAdmin" tag="span" v-show="USER_ROLE === USER_PERMISSIONS.SUPER_ADMIN">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-account-lock-open</v-icon>
                </v-btn>
              </template>
              <span>后台管理</span>
            </v-tooltip>
          </router-link>
          <router-link to="/pageMatch" tag="span" v-show="USER_LOGIN_STATUS">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-soccer</v-icon>
                </v-btn>
              </template>
              <span>创建比赛</span>
            </v-tooltip>
          </router-link>
          <span class="logout" v-show="USER_LOGIN_STATUS">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="logout">
                  <v-icon>mdi-logout-variant</v-icon>
                </v-btn>
              </template>
              <span>退出登录</span>
            </v-tooltip>
          </span>
          <router-link :to="USER_LOGIN_STATUS ? '/pageUserCenter' : '/pageLogin'" tag="span">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" v-show="!USER_LOGIN_STATUS">
                  <v-icon>mdi-account</v-icon>
                </v-btn>
                <v-avatar v-bind="attrs" v-on="on" v-show="USER_LOGIN_STATUS" style="cursor: pointer">
                  <img :src="USER_AVATAR">
                </v-avatar>
              </template>
              <span>{{ USER_LOGIN_STATUS ? '个人中心' : '登录注册'}}</span>
            </v-tooltip>
          </router-link>
        </template>
        <!-- 导航栏 -->
        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab to="/pageHome">赛事中心</v-tab>
            <v-tab to="/pageNews">新闻</v-tab>
            <v-tab to="/pageCommunity">社区</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <!-- 主体内容 -->
      <v-main :class="navShow ? 'main-top':''">
        <v-container fluid style="padding: 0;">
          <router-view></router-view>
        </v-container>
      </v-main>
      <!-- 页脚 -->
      <v-footer color="primary lighten-1" padless v-show="navShow">
        <v-row justify="center" no-gutters>
          <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
            {{ new Date().getFullYear() }} — <strong>SOCCER_HOME</strong>
          </v-col>
        </v-row>
      </v-footer>
    </v-card>
    <!-- 页面滚动到顶部按钮以及主题切换 -->
    <div class="tool-box" v-show="toggleBtnShow">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn height="45px" class="ma-2" @click="pageUp" v-bind="attrs" v-on="on">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
        </template>
        <span>回到顶部</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn height="45px" @click="toggleTheme" v-bind="attrs" v-on="on">
            <v-icon>{{iconText}}</v-icon>
          </v-btn>
        </template>
        <span>切换主题</span>
      </v-tooltip>
    </div>
    <!-- 全局提示组件 -->
    <message></message>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { USER_PERMISSIONS, NOT_SHOW_NAV_PAGES } from '@/constant'
import message from '@/components/message.vue'
import { getCurrentUserInfo } from '@/http/user'
export default {
  name: 'App',
  components: {
    message
  },
  mounted () {
    if (window.pageYOffset > 100) {
      this.toggleBtnShow = true
    }
    // 监听页面滚动，控制工具按钮的显示与隐藏
    window.onscroll = (e) => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 100) {
        this.toggleBtnShow = true
      }
      if (scrollTop === 0) {
        this.toggleBtnShow = false
      }
    }
    this.refreshUser()
  },
  computed: {
    ...mapGetters(['USER_LOGIN_STATUS', 'USER_AVATAR', 'USER_ROLE'])
  },
  data: () => ({
    // 页面工具按钮是否显示
    toggleBtnShow: false,
    // 导航栏是否显示
    navShow: true,
    // 页面工具按钮图标名称
    iconText: 'mdi-decagram',
    USER_PERMISSIONS
  }),
  methods: {
    ...mapMutations(['OPEN_MESSAGE', 'SET_USER_INFO', 'SET_USER_STATUS']),
    // 主题切换
    toggleTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      this.iconText = this.iconText === 'mdi-decagram' ? 'mdi-decagram-outline' : 'mdi-decagram'
    },
    // 页面回滚置顶
    pageUp () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    // 更新用户登录状态和信息
    refreshUser () {
      if (localStorage.getItem('userToken')) {
        this.SET_USER_STATUS({
          status: true
        })
        getCurrentUserInfo().then(res => {
          console.log(res)
          this.SET_USER_INFO({
            role: res.data.role,
            avatar: res.data.avatar,
            id: res.data.id
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.SET_USER_STATUS({
          status: false
        })
        this.SET_USER_INFO({
          role: '0',
          avatar: ''
        })
      }
    },
    // 退出登录
    logout () {
      localStorage.removeItem('userToken')
      this.OPEN_MESSAGE({
        content: '已退出系统',
        type: 'success',
        timeout: 3000
      })
      this.refreshUser()
    }
  },
  watch: {
    $route: {
      // 监听路由，控制导航栏的显示与隐藏
      handler (newVal, oldVal) {
        console.log(newVal, oldVal)
        if (NOT_SHOW_NAV_PAGES.includes(newVal.name)) {
          this.navShow = false
        } else {
          this.navShow = true
        }
        if (oldVal.name === 'pageLogin') {
          this.refreshUser()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  #app{
    overflow: hidden;
    .tool-box{
      position: fixed;
      bottom: 15px;
      right: 30px;
    }
    .main-top{
      margin-top: 120px;
    }
    .logout{
      margin-right: 10px;
    }
  }
  ::v-deep .v-toolbar__content{
    padding: 15px 50px 0px 50px;
  }
</style>
