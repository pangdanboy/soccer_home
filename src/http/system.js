import axios from '@/plugins/axios'

export const getSystemInfo = (params) => {
  return new Promise((resolve, reject) => {
    axios.get('/system/systemInfo', { params }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
