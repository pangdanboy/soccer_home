import axios from './../plugins/axios'

export const verifyRole = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/route/verifyRole', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
