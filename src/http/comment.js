import axios from './../plugins/axios'

export const addComment = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/comment/addComment', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const query = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/comment/query', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
