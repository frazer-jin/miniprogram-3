// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    topic: undefined,
    none: undefined, // 动物没找到的话，这个值为true
  },
  onLoad(option) {
    console.log('xxxx')
    let existed = false;
    app.globalData.topics.forEach(e => {
      if(e.id == option.id) {
        existed = true;
        this.setData({
          topic: e
        })
        this.setData({
          comments: app.globalData.comments
        })
        console.log(e);
      }
    });
    if(!existed) {
      this.setData({
        none: true
      })
    }
  },
})
