const formatTime = millis => {
  const date = new Date(millis);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const isEmpty = obj => {
  return null == obj || Object.keys(obj).length === 0;
}

const http = {
  env: 'test-2glskykn8b63a50a',
  service: 'nestjs-mini',

  async request(method, path, payload) {
    const result = await wx.cloud.callContainer({
      config: {
        env: http.env, // 微信云托管的环境ID
      },
      path: path, // 填入业务自定义路径和参数，根目录，就是 / 
      method: method, // 按照自己的业务开发，选择对应的方法
      header: {
        'X-WX-SERVICE': http.service, // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
      },
      data: payload,
      dataType:'json', // 默认不填是以JSON形式解析返回结果，若不想让SDK自己解析，可以填text
    })
    return (result.statusCode >= 200 && result.statusCode < 300) ? result.data : null;
  },

  async uploadFile(path, file) {
    return new Promise((resolve, reject) => {
      const task = wx.cloud.uploadFile({
        cloudPath: path,
        filePath: file,
        config: {
          env: http.env
        },
        success: res => resolve(res.fileID),
        fail: e => {
          const info = e.toString()
          if (info.indexOf('abort') != -1) {
            reject(new Error('【文件上传失败】中断上传'))
          } else {
            reject(new Error('【文件上传失败】网络或其他错误'))
          }
        }
      })
    });
  },

  async deleteFile(fileId) {
    return new Promise((resolve, reject) => {
      wx.cloud.deleteFile({
        fileList: [fileId], // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
        config: {
          env: http.env
        },
        success: res => {
          resolve(res.fileList)
        },
        fail: err => {
          reject(new Error('【文件删除失败】'))
        },
        complete: res => {
          console.log(res)
        }
      })
      
    });
  },

  async get(path) {
    return http.request('GET', path);
  },

  async post(path, payload) {
    const result =  await http.request('POST', path, payload);
    return result;
  },

  async delete(path) {
    const result =  await http.request('DELETE', path);
    return result;
  },
}

module.exports = {
  formatTime,
  isEmpty,
  http
}
