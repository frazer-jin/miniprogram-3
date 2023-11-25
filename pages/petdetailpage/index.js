const { http } = require('../../utils/util');
const session = require('../../utils/session');
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    animal: undefined,
    none: undefined, // 动物没找到的话，这个值为true
    user: undefined,
  },
  onLoad(option) {
    const user = session.getUser();
    if (user) {
      this.setData({
        user: user
      });
    } else {
      console.log('用户未登录');
    }

    http.get('/pets/' + option.id).then(data => {
      console.log(data);
      if(!data) {
        this.setData({
          none: true
        })
      } else {
        this.setData({
          animal: data
        })
      }
      //
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '加载失败',
        icon: 'failed'
      });
      this.setData({
        none: true
      })
    });
  },

  previewAnimal: function(e) {
    var currentUrl = e.currentTarget.dataset.url; // 获取当前点击图片的url
    console.log(e);
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: [currentUrl] // 需要预览的图片http链接列表
    })
  },

  onAnimalDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该宠物吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          // 在用户点击确定后的相关逻辑
          http.delete('/pets/' + id).then(data => {
            console.log(data);
            // 如果不是默认头像，则删除头像文件
            if(data && !/example.png$/i.test(data.avatar)) {
              http.deleteFile(data.avatar);
            }
            wx.navigateBack();
          }).catch(e => {
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            });
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
          // 在用户点击取消后的相关逻辑
        }
      }
    })
  }
})
