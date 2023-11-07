const session = require('../../utils/session');
const utils = require('../../utils/util');
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {},
  onLoad() {
    // 检查用户是否已登录，如果未登录，提示用户先登录
    const user = session.getUser();
    console.log(user);

    if (user) {
      this.setData({
        user: user
      });
    }
  },

  // 点击授权按钮触发的事件
  login: function (e) {
    var that = this;
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料', // 这里填写获取用户信息的目的，会显示在弹窗中
      success: function (res) {
        var userInfo = res.userInfo; // 获取到用户信息，可根据需求进行处理

        // 获取一次性 code
        wx.login({
          success(res) {
            if (res.code) {
              console.log(res.code);
              console.log(userInfo);
              //发起网络请求
              // wx.request({
              //   url: 'https://example.com/onLogin',
              //   data: {
              //     code: res.code
              //   }
              // });

              // 测试代码
              const user = {
                name: 'jack',
                id: Date.now(),
                login_time: utils.formatTime(Date.now())
              }
              session.setUser(user);
              that.setData({
                user: user
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    });
  },

  logout: function (e) {
    session.setUser({});
    this.setData({
      user: null
    })
  }
})