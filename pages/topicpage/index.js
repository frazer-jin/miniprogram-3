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
  },
  onLoad() {
    this.setData({
      topics: app.globalData.topics.concat(app.globalData.topics)
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
    topics[index].i_liked = !topics[index].i_liked;
    topics[index].like = topics[index].i_liked ? topics[index].like+1 : topics[index].like-1;
    this.setData({
      topics: topics
    });
  }
})
