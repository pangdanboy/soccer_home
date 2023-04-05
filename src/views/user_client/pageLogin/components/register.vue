<template>
  <div class="register">
    <v-form ref="form" v-model="valid" lazy-validation style="width: 100%; height: 100%; padding: 40px">
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
        <v-btn @click="handleVerify" :disabled="verifyProcess">{{ verifyProcess ? countDown:'获取验证码' }}</v-btn>
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
      <v-text-field
        v-model="secretKey"
        label="管理员密钥(选填)"
        clearable
        :counter="6"
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
        <v-btn color="primary" @click="handleRegister">注册</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { register, getVerify } from '@/http'
import { USER_PERMISSIONS } from '@/constant'
import { mapMutations } from 'vuex'

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
    // 管理员密钥，可选
    secretKey: '',
    checkbox: false,
    valid: false,
    verifyProcess: false,
    verifyTimer: null,
    countDown: 60,
    verifyCode: 0
  }),
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    reset () {
      this.$refs.form.reset()
    },
    handleRegister () {
      const formVerify = this.$refs.form.validate()
      if (formVerify) {
        if (parseInt(this.code) !== this.verifyCode) {
          this.OPEN_MESSAGE({
            content: '验证码错误！',
            type: 'error',
            timeout: 3000
          })
          return
        }
        // 普通用户注册
        register({
          username: this.username,
          password: this.password,
          email: this.email,
          role: USER_PERMISSIONS.COMMON_USER
        }).then(res => {
          console.log(res)
          this.OPEN_MESSAGE({
            content: res.message,
            type: res.success ? 'success' : 'error',
            timeout: 3000
          })
          if (res.success) {
            this.jumpLogin()
          }
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
    handleVerify () {
      // 校验邮箱格式
      const emailVerify = /.+@.+\..+/.test(this.email)
      if (emailVerify) {
        // 向邮箱发送验证码
        getVerify({
          email: this.email
        }).then(res => {
          if (res.success) {
            this.verifyCode = res.data.verifyCode
            this.verifyProcess = true
            this.verifyTimer = setInterval(() => {
              this.countDown -= 1
              if (this.countDown === 0) {
                clearInterval(this.verifyTimer)
                this.verifyProcess = false
                this.countDown = 60
              }
            }, 1000)
          }
          this.OPEN_MESSAGE({
            content: res.message,
            type: res.success ? 'success' : 'error',
            timeout: 2000
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.OPEN_MESSAGE({
          content: '邮箱格式错误！',
          type: 'error',
          timeout: 3000
        })
      }
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
    height: 600px;
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
