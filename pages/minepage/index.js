const session = require('../../utils/session');
const utils = require('../../utils/util');
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    buttonDisabled: false,
  },
  onLoad() {
    // 检查用户是否已登录，如果未登录，提示用户先登录
    const user = session.getUser();
    console.log(user);

    if (user) {
      // users
      this.setData({
        user: user
      });
    }
  },

  onShow() {
    const user = this.data.user;
    if (user) {
      // animals
      this.loadAnimals(user);
    }
  },

  loadAnimals: function (user) {
    // todo
    utils.http.get('/pets/mine').then(data => {
      console.log(data);
      this.setData({
        animals: data
      });
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '加载失败',
        icon: 'failed'
      });
      this.setData({
        animals: []
      });
    });
  },

  onAnimalSelected(e) {
    console.log(e)
    const id = e.currentTarget.dataset.index;
    console.log(id);
    wx.navigateTo({
      url: '../petdetailpage/index?id=' + id
    })
  },

  onAnimalNew(e) {
    wx.navigateTo({
      url: '../petpage/index'
    });
  },

  // 点击授权按钮触发的事件
  login: function (e) {
    var that = this;
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料', // 这里填写获取用户信息的目的，会显示在弹窗中
      success: function (res) {
        var userInfo = res.userInfo; // 获取到用户信息，可根据需求进行处理

        console.log(userInfo);
        const {
          nickName,
          country,
          province,
          city,
          gender,
          avatarUrl
        } = userInfo;

        const payload = {
          nick_name: nickName,
          country,
          province,
          city,
          gender,
          avatar_url: avatarUrl
        };

        that.setData({
          buttonDisabled: true
        });

        utils.http.post('/auth/login', payload).then((data) => {
          console.log(data);
          const user = {
            token: data.access_token,
            id: data.user_id,
            name: data.user_name,
            avatar: data.user_avatar,
            login_time: utils.formatTime(Date.now())
          }
          session.setUser(user);
          that.setData({
            user: user
          })
          that.setData({
            buttonDisabled: false
          });
        }).catch(e => {
          console.log('登录失败!！' + e)
        });
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