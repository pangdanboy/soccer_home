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
      role: '',
      // 头像
      avatar: ''
    }
  },
  getters: {
    USER_LOGIN_STATUS: (state, getters) => {
      return state.UserInfo.loginStatus
    },
    USER_AVATAR: (state, getters) => {
      return state.UserInfo.avatar
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
