<template>
  <div class="login">
    <v-form ref="form" v-model="valid" lazy-validation style="width: 450px; height: 500px; padding: 40px">
      <div class="title">
        <p style="font-size: 24px; font-weight: bold;">登录</p>
      </div>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="邮箱"
        required
        clearable
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="密码"
        required
        clearable
        type="password"
      ></v-text-field>
      <div class="login-policy">
        <v-checkbox
          v-model="checkbox"
          :rules="[v => !!v || '请阅读并同意相关协议！']"
          label="是否同意协议？"
          required
        ></v-checkbox>
        <a>相关政策</a>
      </div>
      <div class="jump-register">
        <a style="font-size: 12px;" @click.prevent="jumpRegister">没有账号？前往注册>></a>
      </div>
      <div class="login-operate">
        <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>
        <v-btn color="primary" @click="login">登录</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'login',
  data: () => ({
    password: '',
    passwordRules: [
      v => !!v || '密码不能为空！'
    ],
    email: '',
    emailRules: [
      v => !!v || '邮箱不能为空！',
      v => /.+@.+\..+/.test(v) || '邮箱格式不正确！'
    ],
    checkbox: false,
    valid: false
  }),
  methods: {
    reset () {
      this.$refs.form.reset()
    },
    login () {
      this.$refs.form.validate()
    },
    jumpRegister () {
      this.$emit('jumpRegister')
    }
  }
}
</script>

<style scoped lang="scss">
  .login{
    width: 450px;
    height: 550px;
    .v-form{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .login-policy{
        display: flex;
        align-items: center;
      }
      .jump-register{
        margin-bottom: 10px;
      }
      .login-operate{
        display: flex;
        justify-content: center;
        .v-btn{
          width: 120px;
          height: 45px;
        }
      }
    }
  }
</style>
