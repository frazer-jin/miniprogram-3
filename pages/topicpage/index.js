// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    topics: undefined, // 话题列表
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
  }
})
