var app = getApp();
// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    loginhidde: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.request({
      url: app.data.hostUrl + 'api/services/app/serviceProduct/GetActiveList',
      method: "post",
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          var arr = res.data.result;
          that.setData({
            loginhidde: false,
            arr: arr
          })
        }
      }
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