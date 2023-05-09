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

export const changeStatus = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/area/changeStatus', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteArea = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/area/deleteArea', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const editArea = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/area/editArea', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
