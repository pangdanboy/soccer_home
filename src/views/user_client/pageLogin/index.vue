<template>
  <div id="login_register">
    <div class="page-main">
      <div class="page-left"></div>
      <div class="page-right">
        <login v-show="showLogin" @jumpRegister="jumpRegister"></login>
        <register v-show="!showLogin" @jumpLogin="jumpLogin"></register>
      </div>
    </div>
  </div>
</template>

<script>
import login from '@/views/user_client/pageLogin/components/login.vue'
import register from '@/views/user_client/pageLogin/components/register.vue'
export default {
  name: 'pageLogin',
  components: {
    login,
    register
  },
  data: () => ({
    // 控制登录和注册框的切换
    showLogin: true
  }),
  methods: {
    jumpLogin () {
      this.showLogin = true
    },
    jumpRegister () {
      this.showLogin = false
    }
  }
}
</script>

<style scoped lang="scss">
  #login_register{
    width: 100vw;
    height: 100vh;
    background-image: url('./../../../static/images/m_c.jpg');
    background-size: cover;
    .page-main{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .page-left{
        width: 60%;
        height: 100%;
      }
      .page-right{
        width: 450px;
        height: 550px;
        background-color: rgba(255, 255, 255, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
      }
    }
  }
</style>
