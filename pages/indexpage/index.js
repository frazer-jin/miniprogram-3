const {
  http
} = require('../../utils/util')
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    searchText: '', // 搜索框内容
    animals: undefined, // 动物列表
  },
  onShow() {
    this.loadAnimals();
  },


  loadAnimals: function () {
    http.get('/pets').then(data => {
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