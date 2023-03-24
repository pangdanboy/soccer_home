import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    UserInfo: {
      // 登录状态
      loginStatus: false,
      // 角色
      role: '0',
      // 头像
      avatar: ''
    },
    // 全局提示信息
    message: {
      // 显示状态
      status: false,
      // 提示类型
      type: '',
      // 提示内容
      content: '',
      // 延迟消失时间
      timeout: 2000
    }
  },
  getters: {
    USER_LOGIN_STATUS: (state, getters) => {
      return state.UserInfo.loginStatus
    },
    USER_AVATAR: (state, getters) => {
      return state.UserInfo.avatar
    },
    USER_ROLE: (state, getters) => {
      return state.UserInfo.role
    },
    MESSAGE_STATUS: (state, getters) => {
      return state.message.status
    },
    MESSAGE_CONTENT: (state, getters) => {
      return state.message.content
    },
    MESSAGE_TYPE: (state, getters) => {
      return state.message.type
    },
    MESSAGE_TIMEOUT: (state, getters) => {
      return state.message.timeout
    }
  },
  mutations: {
    OPEN_MESSAGE: (state, payload) => {
      state.message.status = true
      state.message.content = payload.content
      state.message.type = payload.type
      state.message.timeout = payload.timeout || 2000
      setTimeout(() => {
        state.message.status = false
      }, payload.timeout)
    },
    CLOSE_MESSAGE: (state, payload) => {
      state.message.status = false
    }
  },
  actions: {
  },
  modules: {
  }
})
