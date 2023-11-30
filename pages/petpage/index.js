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

    if (/cloud:/i.test(this.data.imageUrl)) {
      this.saveForm(e);
    } else {
      // 解析文件路径，获取文件名
      var filename = this.data.imageUrl.split('/').pop();
      // 获取文件后缀名
      var fileExt = filename.split('.').pop();
      console.log('avatar url:', this.data.imageUrl);
      // 上传头像
      http.uploadFile(new Date().getTime() + '.' + fileExt, this.data.imageUrl).then(data => {
        console.log(data);
        this.setData({
          imageUrl: data
        });

        this.saveForm(e);
      }).catch(e => {
        console.log(e);
        wx.showToast({
          title: '保存头像失败, 请重新选择',
          icon: 'none'
        });
        this.setData({
          buttonDisabled: false
        });
        return;
      });
    }
  },
  formReset: function () {
    wx.navigateBack();
  },

  saveForm: function (e) {
    // save
    const payload = {
      name: e.detail.value.name,
      gender: this.data.genderIndex,
      avatar: this.data.imageUrl,
      birthday: this.data.birthday,
      vaccines: this.data.vaccineIndex,
      sterilization: this.data.sterilizationIndex,
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

  chooseImage: function () {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const tempFileSize = res.tempFiles[0].size;

        // 判断图片大小是否符合要求
        if (tempFileSize > 1024 * 1024) {
          // 如果图片大小超过1MB，进行提醒或其他处理
          wx.showToast({
            title: '所选图片太大，请选择小于1MB的图片',
            icon: 'none'
          });
        } else {
          // 图片大小符合要求，继续处理
          that.setData({
            imageUrl: tempFilePath,
          });
        }
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