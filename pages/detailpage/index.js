// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    animal: undefined,
    none: undefined, // 动物没找到的话，这个值为true
  },
  onLoad(option) {
    this.setData({
      animals: app.globalData.animals
    });
    let existed = false;
    app.globalData.animals.forEach(e => {
      if(e.id == option.id) {
        existed = true;
        this.setData({
          animal: e
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
