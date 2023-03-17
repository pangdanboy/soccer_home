<template>
  <div class="register">
    <v-form ref="form" v-model="valid" lazy-validation style="width: 450px; height: 500px; padding: 40px">
      <div class="title">
        <p style="font-size: 24px; font-weight: bold;">注册</p>
      </div>
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="用户名"
        :counter="16"
        required
        clearable
      ></v-text-field>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="邮箱"
        required
        clearable
      ></v-text-field>
      <div class="code">
        <v-text-field
          v-model="code"
          :rules="codeRules"
          label="验证码"
          required
          clearable
        ></v-text-field>
        <v-btn>获取验证码</v-btn>
      </div>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="密码"
        required
        clearable
        :counter="16"
        type="password"
      ></v-text-field>
      <div class="register-policy">
        <v-checkbox
          v-model="checkbox"
          :rules="[v => !!v || '请阅读并同意相关协议！']"
          label="是否同意协议？"
          required
        ></v-checkbox>
        <a>相关政策</a>
      </div>
      <div class="jump-login">
        <a style="font-size: 12px;" @click.prevent="jumpLogin">已有账号？返回登录>></a>
      </div>
      <div class="register-operate">
        <v-btn color="error" class="mr-4" @click="reset">重置</v-btn>
        <v-btn color="primary" @click="register">注册</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'register',
  data: () => ({
    username: '',
    usernameRules: [
      v => !!v || '昵称不能为空！',
      v => v.length <= 16 || '长度不能超过16！'
    ],
    password: '',
    passwordRules: [
      v => !!v || '密码不能为空！',
      v => v.length <= 16 || '长度不能超过16！'
    ],
    email: '',
    emailRules: [
      v => !!v || '邮箱不能为空！',
      v => /.+@.+\..+/.test(v) || '邮箱格式不正确！'
    ],
    code: '',
    codeRules: [
      v => !!v || '验证码不能为空！',
      v => v.length <= 6 || '长度不能超过6！'
    ],
    checkbox: false,
    valid: false
  }),
  methods: {
    reset () {
      this.$refs.form.reset()
    },
    register () {
      this.$refs.form.validate()
    },
    jumpLogin () {
      this.$emit('jumpLogin')
    }
  }
}
</script>

<style scoped lang="scss">
  .register{
    width: 450px;
    height: 550px;
    .v-form{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .code{
        display: flex;
        align-items: center;
        .v-btn{
          margin-left: 15px;
        }
      }
      .register-policy{
        display: flex;
        align-items: center;
      }
      .jump-login{
        margin-bottom: 10px;
      }
      .register-operate{
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
