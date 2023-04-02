import axios from 'axios'
import router from './../router/index'
axios.defaults.baseURL = 'http://localhost:5000/api/'
// 请求拦截，在每次发送请求之前在请求头中添加当前用户的token
axios.interceptors.request.use(config => {
  // 如果此时用户登录
  if (localStorage.userToken) {
    // 设置统一的的请求header
    config.headers.Authorization = localStorage.userToken
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截，token值过期的时候，做统一做处理，跳转到登录，重新登录，删除token
axios.interceptors.response.use(response => {
  return response
}, error => {
  // 获取错误状态码
  const { status } = error.response
  if (status === 401) {
    // 清除token
    localStorage.removeItem('userToken')
    // token失效，回到未授权页面
    router.push('/page401/NoLogin')
  }
})

export default axios
