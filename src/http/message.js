import axios from './../plugins/axios'

export const queryMessage = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/message/queryMessage', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
