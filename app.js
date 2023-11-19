const { http } = require('./utils/util');

// app.js
App({
  async onLaunch() {
    // 初始化
    wx.cloud.init();

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    animal_default_avatar: 'cloud://test-2glskykn8b63a50a.7465-test-2glskykn8b63a50a-1317060853/example.png',
  },
  
})
