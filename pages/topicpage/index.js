const session = require('../../utils/session');
const utils = require('../../utils/util');
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    topics: undefined, // 话题列表
  },
  onShow() {
    // 检查用户是否已登录，如果未登录，提示用户先登录
    const user = session.getUser();
    console.log(user);
    if (utils.isEmpty(user)) {
      wx.switchTab({
        url: '/pages/minepage/index',
      });
    }
    const user_id = user.id;
    // 获取数据
    utils.http.get('/topics').then(data => {
      console.log(data);
      this.setData({
        topics: data
      });
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '加载失败',
        icon: 'failed'
      });
      this.setData({
        topics: []
      });
    });
  },
  onTopicSelected(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    wx.navigateTo({
      url: '../topicdetailpage/index?id=' + index
    })
  },
  onTopicLike(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    const topics = this.data.topics;
    const topic = topics[index];
    // update
    utils.http.put('/topics/' + topic.id + '/like').then(data => {
      console.log(data);
      if (!data) {
        wx.showToast({
          title: '更新失败',
          icon: 'failed'
        });
      } else {
        topics[index] = data;
        this.setData({
          topics: topics
        })
      }
      //
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '更新失败',
        icon: 'failed'
      });
    });
  },
  onTopicNew() {
    wx.navigateTo({
      url: '../topicdetailpage/index',
    })
  }
})
