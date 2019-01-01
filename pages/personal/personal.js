// pages/personal/personal.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
//    app.ifUserLogin();
    var userInfo = wx.getStorageSync('userinfo');
    that.setData({
      nickName: userInfo.nickName,
      gender: userInfo.gender == 1?"男":"女",
      loginhidde:false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userinfo');
    console.log(userInfo);
    that.setData({
      nickName: userInfo.nickName,
      gender: userInfo.gender == 1 ? "男" : "女",
      loginhidde: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { 
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})