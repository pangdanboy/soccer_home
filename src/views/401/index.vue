<template>
  <div id="auth">
    <div class="tip">
      <div class="tip-logo">
        <v-icon size="66" color="#1976d2" class="logo">mdi-soccer</v-icon>
      </div>
      <div class="tip-title">
        <h2>无法访问此页面或者进行此操作</h2>
      </div>
      <div class="tip-reason">
        <p v-if="type === 'NoLogin'">你可能没有登录或者没有访问该页面的权限或者进行此操作的权限</p>
        <p v-else>你没有访问该页面的权限</p>
      </div>
      <div class="tip-method">
        <p>请试试以下方法：</p>
        <ul>
          <li>检查网络连接</li>
          <li v-show="type === 'NoLogin'">进入登录页进行登录</li>
          <li>联系管理员，赋予相关权限</li>
        </ul>
      </div>
      <div class="tip-operation" :style="{justifyContent: type === 'NoLogin'? 'space-between':'center'}">
        <v-btn color="primary" @click="() => this.$router.replace('/pageHome')">返回首页</v-btn>
        <v-btn color="primary" v-show="type === 'NoLogin'" @click="() => this.$router.replace('/pageLogin')">去登录</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Authorization',
  data: () => ({
    // 页面类型，未登录(NoLogin)or没有权限(NoAuth)
    type: ''
  }),
  mounted () {
    console.log(this.$route.params)
    this.type = this.$route.params.type
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  #auth{
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .tip{
      width: 400px;
      height: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      div{
        margin-bottom: 15px;
      }
      .tip-logo{
        .logo{
          animation: circle 2s infinite;
        }
        @keyframes circle {
          0%{
            transform: rotateZ(0deg);
          }
          50%{
            transform: rotateZ(180deg);
          }
          100%{
            transform: rotateZ(360deg);
          }
        }
      }
      .tip-method{
        margin-bottom: 25px;
        ul{
          color: #1976d2;
        }
      }
      .tip-operation{
        width: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
</style>
