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
import { mapMutations } from 'vuex'
import { login } from '@/http'

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
    ...mapMutations(['OPEN_MESSAGE']),
    // 重置表单校验信息
    reset () {
      this.$refs.form.reset()
    },
    // 处理登录
    login () {
      const verify = this.$refs.form.validate()
      // 用户信息填写完整，调用登录接口，验证用户信息
      if (verify) {
        console.log('调用接口验证用户登录信息')
        login({
          email: this.email,
          password: this.password
        }).then(res => {
          console.log(res)
          if (res.success) {
            localStorage.setItem('userToken', res.data.token)
            this.$router.replace('/pageHome')
          }
          this.OPEN_MESSAGE({
            content: res.message,
            type: res.success ? 'success' : 'error',
            timeout: 3000
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.OPEN_MESSAGE({
          content: '请填写完整信息！',
          type: 'warning',
          timeout: 3000
        })
      }
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
