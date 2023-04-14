import axios from './../plugins/axios'
export const login = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/user/login', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
export const register = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/user/register', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
export const getCurrentUserInfo = (params) => {
  return new Promise((resolve, reject) => {
    axios.get('/user/current', { params }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
export const getVerify = (params) => {
  return new Promise((resolve, reject) => {
    axios.get('/user/verify', { params }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
