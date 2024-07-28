// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
  },
  onLoad() {
  },
  toBaike() {
    console.log('to baidu bake');
    wx.navigateToMiniProgram({
      shortLink: '#小程序://搜狗百科/S7zgdnhtlJCKDoI',
      success(res){
        console.log('navigate success: ' + res);
      }
    });

  }
})
