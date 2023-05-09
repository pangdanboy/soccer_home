import axios from './../plugins/axios'

export const uploadAreaCover = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/upload/areaCover', params, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
