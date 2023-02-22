<template>
  <v-app>
    <v-card>
      <!-- 导航栏 -->
      <v-app-bar
        fixed
        elevate-on-scroll
        hide-on-scroll
      >
       <template v-slot:default>
         <v-avatar size="49" style="margin-right: 15px;">
           <img src="./../public/images/logo.jpg" alt="">
         </v-avatar>
         <v-toolbar-title>阿米小窝</v-toolbar-title>

         <v-spacer></v-spacer>

         <v-btn icon>
           <v-icon>mdi-cart</v-icon>
         </v-btn>
         <v-btn icon>
           <v-icon>mdi-bell</v-icon>
         </v-btn>
         <v-btn icon>
           <v-icon>mdi-account</v-icon>
         </v-btn>
       </template>
        <template v-slot:extension>
          <v-tabs align-with-title>
            <v-tab to="/pageHome">主页</v-tab>
            <v-tab to="/pageChatRoom">聊天室</v-tab>
            <v-tab to="/pageNews">热点</v-tab>
            <v-tab to="/pageCommunity">社区</v-tab>
            <v-tab to="/pageMerch">周边</v-tab>
            <v-tab to="/pageUserLogin">登录</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <!-- 主体内容 -->
      <v-sheet>
        <v-container style="margin-top: 120px" fluid>
          <router-view></router-view>
        </v-container>
      </v-sheet>
    </v-card>
    <!-- 页面滚动到顶部按钮以及主题切换 -->
    <div style="position: fixed; bottom: 15px; right: 30px;" v-show="toggleBtnShow">
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

export default {
  name: 'App',
  mounted () {
    if (window.pageYOffset > 100) {
      this.toggleBtnShow = true
    }
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
  data: () => ({
    //
    searchStatus: false,
    toggleBtnShow: false,
    iconText: 'mdi-decagram'
  }),
  methods: {
    search () {
      this.searchStatus = true
    },
    toggleTheme () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      this.iconText = this.iconText === 'mdi-decagram' ? 'mdi-decagram-outline' : 'mdi-decagram'
    },
    pageUp () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #app{
    overflow: hidden;
  }
  ::v-deep .v-toolbar__content{
    padding: 15px 50px 0px 50px;
  }
</style>
