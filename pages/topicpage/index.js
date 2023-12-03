const session = require('../../utils/session');
const utils = require('../../utils/util');
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    topics: [], // 话题列表
    scrollHeight: 0,
    loading: false,
    fullLoaded: false,
    pageNum: 1,
  },
  onLoad() {
    // 获取系统信息
    const sysInfo = wx.getSystemInfoSync();
    // 计算 scroll-view 的高度
    const scrollHeight = sysInfo.windowHeight - 60; // 减去其他元素的高度
    // 更新 scrollHeight 变量
    this.setData({
      scrollHeight: scrollHeight
    });
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
    this.data.pageNum = 1;
    this.data.topics = [];
    this.loadTopics();
  },

  loadTopics() {
    const page = this.data.pageNum;
    const current_topics = this.data.topics || [];
    // 获取数据
    utils.http.get('/topics?page=' + page).then(data => {
      console.log(data);
      this.setData({
        topics: [...current_topics, ...data]
      });
      if (data.length === 0) {
        this.data.fullLoaded = true;
      }
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

  nextPage: function (e) {
    const that = this;
    if (!this.data.loading) {
      // 先检查是否已全部加载
      if (this.data.fullLoaded) {
        wx.showToast({
          title: '没有更多话题了',
          icon: 'info'
        });
      } else {
        this.data.loading = true;
        wx.showLoading({
          title: '加载中',
        });
        this.data.pageNum++;
        this.loadTopics();
        wx.hideLoading();
        that.data.loading = false;
      }
    }
    console.log(e)
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