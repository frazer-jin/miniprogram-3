const {
  http
} = require('../../utils/util');
const session = require('../../utils/session');
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    create: undefined, // 创建新话题，这个值为true
    topic: undefined,
    topicId: undefined,
    myTopic: undefined,
    comments: undefined,
    comment: undefined,
    none: undefined, // 话题没找到的话，这个值为true
  },
  onLoad(option) {
    if (!option.id) {
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
          topic: data,
          topicId: data.id
        })
        this.loadComments(data.id);
        const user = session.getUser();
        console.log(user)
        if (data.user_id == user?.id) {
          this.setData({
            myTopic: true
          })
        }
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
  loadComments(topicId) {
    http.get('/topics/' + topicId + '/comments').then(data => {
      console.log(data);
      const user = session.getUser();
      for(const c of data) {
        if(c.user_id === user.id) {
          c.mine = true;
        }
      }
      this.setData({
        comments: data
      })
      //
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '加载失败',
        icon: 'failed'
      });
      this.setData({
        comments: []
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
    const topic = this.data.topic;
    // 提交表单时的逻辑处理
    const topic_id = e.detail.value.topic_id;
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
      topic.comment_count++;
      this.setData({
        topic: topic,
        comment: ''
      });
      this.loadComments(topic_id);
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: '提交失败',
        icon: 'failed'
      });
    });
  },

  deleteTopic(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该话题吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          // 在用户点击确定后的相关逻辑
          http.delete('/topics/' + id).then(data => {
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
  },

  deleteComment(e) {
    const topic_id = e.currentTarget.dataset.topicId;
    const id = e.currentTarget.dataset.id;
    console.log(e);
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该评论吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          // 在用户点击确定后的相关逻辑
          http.delete('/comments/' + id).then(data => {
            that.loadComments(topic_id);
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