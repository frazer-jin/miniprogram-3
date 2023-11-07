const session = {
  getUser: () => {
    var data = wx.getStorageSync('user');
    return JSON.parse(data || '{}');
  },

  setUser: (user) => {
    wx.setStorageSync('user', JSON.stringify(user));
  }
};

module.exports = session;