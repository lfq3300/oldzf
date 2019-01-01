// pages/survey/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde:true,
    surveryList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageInfo();
  },
  pageInfo:function(){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/survey/GetListByAccountIdAsync',
      method: "post",
      data:{
        id: wx.getStorageSync('userId')
      },
      success:function(res){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        if (res.statusCode == 200 && res.data.success) {
            that.setData({
              surveryList: res.data.result,
              loginhidde: false
            })
        }
      },
      fail:function(){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
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
    this.pageInfo();
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
      this.pageInfo();
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