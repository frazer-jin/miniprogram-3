const {
  http
} = require('../../utils/util');
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    create: undefined, // 创建新话题，这个值为true
    topic: undefined,
    none: undefined, // 话题没找到的话，这个值为true
  },
  onLoad(option) {
    if(!option.id) {
      this.setData({
        create: true
      })
      return;
    }
    http.get('/topics/' + option.id).then(data => {
      console.log(data);
      if (!data) {
        this.setData({
          none: true
        })
      } else {
        this.setData({
          topic: data
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
  createTopic(e) {
    // 提交表单时的逻辑处理
    console.log('提交表单:', e.detail.value);
    const content = e.detail.value.topic;
    if (!content) {
      wx.showToast({
        title: '话题不能为空',
        icon: 'none'
      });
      return;
    }
    const payload = {
      content: content
    }

    http.post('/topics', payload).then(data => {
      console.log(data);
      wx.switchTab({
        url: '../topicpage/index'
      });
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '提交失败',
        icon: 'failed'
      });
    });
  },

  createComment(e) {
    // 提交表单时的逻辑处理
    const topic_id = e.detail.topic_id;
    console.log('提交表单topic:', topic_id);
    const content = e.detail.value.comment;
    if (!content) {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      });
      return;
    }
    const payload = {
      content: content,
      topic_id: topic_id
    }

    http.post('/comments', payload).then(data => {
      console.log(data);
      wx.navigateTo({
        url: '../topicdetailpage/index?id=' + topic_id
      });
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '提交失败',
        icon: 'failed'
      });
    });
  }
})