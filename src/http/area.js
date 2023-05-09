import axios from './../plugins/axios'

export const addArea = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/area/addArea', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const queryArea = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/area/queryArea', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
