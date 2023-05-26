import axios from './../plugins/axios'

export const createMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/create', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const editMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/editMatch', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const deleteMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/deleteMatch', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const queryMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/queryMatch', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getMatchById = (params) => {
  return new Promise((resolve, reject) => {
    axios.get('/match/getMatchById', { params }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const joinMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/joinMatch', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const quitMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/quitMatch', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const userJoinMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/userJoinMatch', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const userCreateMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/userCreateMatch', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getMatchByDateAndTime = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/getMatchByDateAndTime', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const exportMatch = (params) => {
  return new Promise((resolve, reject) => {
    axios.get('/match/export', { params }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getFreeArea = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/getFreeArea', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const setScore = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/setScore', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const setSupport = (params) => {
  return new Promise((resolve, reject) => {
    axios.post('/match/setSupport', params).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
