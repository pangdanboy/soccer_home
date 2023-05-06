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
/**
 * 用户信息修改接口
 * @param params: {type: ''(必须), email: ''(可选), username: ''(可选), signature: ''(可选), freeTimeList: [](可选)}
 * @returns {Promise<unknown>}
 */
export const editUserInfo = (params) => {
  return new Promise((resolve, reject) => {
    axios.put('/user/edit', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
/**
 * 用户输入搜索用户
 * @param params
 * @return {Promise<unknown>}
 */
export const getUserByInput = (params) => {
  return new Promise((resolve, reject) => {
    axios.get('/user/getUserByInput', { params }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 批量查询用户信息
 * @param params
 * @returns {Promise<unknown>}
 */
export const getUserByIds = (params) => {
  return new Promise((resolve, reject) => {
    axios.get('/user/getUserByIds', { params }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
