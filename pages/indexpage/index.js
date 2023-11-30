const {
  http
} = require('../../utils/util')
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    searchText: '', // 搜索框内容
    animals: [], // 动物列表
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
    this.data.pageNum = 1;
    this.data.animals = [];
    this.loadAnimals();
  },

  nextPage: function (e) {
    const that = this;
    if (!this.data.loading) {
      // 先检查是否已全部加载
      if (this.data.fullLoaded) {
        wx.showToast({
          title: '没有更多宠物了',
          icon: 'info'
        });
      } else {
        this.data.loading = true;
        wx.showLoading({
          title: '加载中',
        });
        this.data.pageNum++;
        this.loadAnimals();
        wx.hideLoading();
        that.data.loading = false;
      }
    }
    console.log(e)
  },

  loadAnimals: function () {
    const page = this.data.pageNum;
    const current_animals = this.data.animals || [];
    http.get('/pets?page=' + page).then(data => {
      console.log(data);
      this.setData({
        animals: [...current_animals, ...data, ...data]
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
    });
  },

  scan() {
    wx.scanCode({
      success: (res) => {
        const index = res.result;
        wx.navigateTo({
          url: '../detailpage/index?id=' + index
        })
      }
    })
  },
  onTypeSelected(e) {
    // 获取当前点击的索引
    const type = e.currentTarget.dataset.index;
    //保存选中分类，自动过滤出匹配的列表
    this.setData({
      selectedType: type
    })
  },
  onAnimalSelected(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    wx.navigateTo({
      url: '../petdetailpage/index?id=' + index
    })
  },
  onSearched(e) {
    console.log(e)
    const name = e.detail.value;
    http.get('/pets/keyword?q=' + name).then(data => {
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
  }
})