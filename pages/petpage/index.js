const {
  http
} = require('../../utils/util');
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    buttonDisabled: false,
    genderArray: ['雄性', '雌性', '未知'],
    genderIndex: 2,
    vaccineArray: ['是', '否', '未知'],
    vaccineIndex: 2,
    sterilizationArray: ['是', '否', '未知'],
    sterilizationIndex: 2,
    todayDate: '',
    birthday: '请选择',
    imageUrl: app.globalData.animal_default_avatar,
  },
  onLoad: function () {
    // 获取当前日期作为日期选择器的结束日期
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    this.setData({
      todayDate: `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    });
  },
  formSubmit: function (e) {
    // 提交表单时的逻辑处理
    console.log('提交表单:', e.detail.value);

    if (!e.detail.value.name) {
      wx.showToast({
        title: '名字不能为空',
        icon: 'none'
      });
      return;
    }
    if (this.data.birthday === '请选择') {
      wx.showToast({
        title: '生日不能为空',
        icon: 'none'
      });
      return;
    }
    this.setData({
      buttonDisabled: true
    });
    const payload = {
      name: e.detail.value.name,
      gender: this.data.genderIndex,
      avatar: this.data.imageUrl,
      birthday: this.data.birthday,
      vaccines: this.data.vaccineIndex,
      sterilization: this.data.sterilizationIndex,
      user_id: 4,
    }

    http.post('/pets', payload).then(data => {
      console.log(data);
      wx.switchTab({
        url: '../minepage/index'
      });
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '提交失败',
        icon: 'failed'
      });
    });
  },
  formReset: function () {
    wx.navigateBack();
  },

  chooseImage: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];

        // 使用 wx.getFileSystemManager 的 readFile 方法读取图片文件
        const fsm = wx.getFileSystemManager();
        fsm.readFile({
          filePath: tempFilePath,
          encoding: 'base64', // 以base64编码格式读取文件
          success(readRes) {
            // 图片的base64格式内容在readRes.data中
            console.log(readRes.data);
            if(readRes.data.length > 1000 * 1024) {
              // 1000k
              wx.showToast({
                title: '图片太大，请选择小于200KB的图片',
                icon: 'none'
              });
            } else {
              that.setData({
                imageUrl: 'data:image/jpeg;base64,' + readRes.data
              });
            }
          },
          fail(readErr) {
            // 读取失败后的回调
            console.error(readErr);
          }
        });
      }
    })
  },


  nameChange: function (e) {
    // 名字输入框改变时的逻辑处理
    if (!e.detail.value) {
      wx.showToast({
        title: '名字不能为空',
        icon: 'none'
      });
    }
  },
  genderChange: function (e) {
    // 性别选择框改变时的逻辑处理
    this.setData({
      genderIndex: e.detail.value
    });
  },
  vaccineChange: function (e) {
    // 疫苗选择框改变时的逻辑处理
    this.setData({
      vaccineIndex: e.detail.value
    });
  },
  sterilizationChange: function (e) {
    // 绝育选择框改变时的逻辑处理
    this.setData({
      sterilizationIndex: e.detail.value
    });
  },
  birthdayChange: function (e) {
    // 生日选择框改变时的逻辑处理
    this.setData({
      birthday: e.detail.value
    });
  },

})