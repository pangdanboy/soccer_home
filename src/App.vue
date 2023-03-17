<template>
  <v-app>
    <v-card>
      <!-- 导航栏 -->
      <v-app-bar fixed elevate-on-scroll hide-on-scroll v-show="navShow">
        <template v-slot:default>
          <!-- logo -->
          <v-avatar size="49" style="margin-right: 15px;">
            <img src="" alt="">
          </v-avatar>
          <!-- 标题 -->
          <v-toolbar-title>足球小窝</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- 路由入口，消息中心和用户中心 -->
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
          <router-link :to="USER_LOGIN_STATUS ? '/pageUserCenter' : 'pageLogin'" tag="span">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" v-show="!USER_LOGIN_STATUS">
                  <v-icon>mdi-account</v-icon>
                </v-btn>
                <v-avatar v-bind="attrs" v-on="on" v-show="USER_LOGIN_STATUS" style="cursor: pointer">
                  <img :src="USER_AVATAR" alt="John">
                </v-avatar>
              </template>
              <span>{{ USER_LOGIN_STATUS ? '个人中心' : '登录注册'}}</span>
            </v-tooltip>
          </router-link>
        </template>
        <!-- 导航栏 -->
        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab to="/pageHome">主页</v-tab>
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
    </v-card>
    <!-- 页面滚动到顶部按钮以及主题切换 -->
    <div class="tool-box" v-show="toggleBtnShow">
      <v-btn height="45px" class="ma-2" color="#995fce" @click="pageUp">
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
      <v-btn height="45px" color="#995fce" @click="toggleTheme">
        <v-icon>{{iconText}}</v-icon>
      </v-btn>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
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
  },
  computed: {
    ...mapGetters(['USER_LOGIN_STATUS', 'USER_AVATAR'])
  },
  data: () => ({
    // 页面工具按钮是否显示
    toggleBtnShow: false,
    // 导航栏是否显示
    navShow: true,
    // 页面工具按钮图标名称
    iconText: 'mdi-decagram'
  }),
  methods: {
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
    }
  },
  watch: {
    $route: {
      // 监听路由，控制导航栏的显示与隐藏
      handler (newVal, oldVal) {
        if (newVal.name === 'pageMessageCenter' || newVal.name === 'pageUserCenter' || newVal.name === 'pageLogin') {
          this.navShow = false
        } else {
          this.navShow = true
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
  }
  ::v-deep .v-toolbar__content{
    padding: 15px 50px 0px 50px;
  }
</style>
