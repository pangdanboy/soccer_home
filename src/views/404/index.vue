<template>
  <div id="auth">
    <div class="tip">
      <div class="tip-logo">
        <v-icon size="76" color="#1976d2" class="logo">mdi-shield-alert-outline</v-icon>
      </div>
      <div class="tip-title">
        <h2>该页面已不翼而飞</h2>
      </div>
      <div class="tip-operation" style="justify-content: center">
        <v-btn color="primary" @click="() => this.$router.replace('/pageHome')">进入网站首页</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'NotFound',
  data: () => ({
  }),
  created () {
  },
  computed: {
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
