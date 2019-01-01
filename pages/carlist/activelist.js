var app = getApp();
// pages/carlist/carlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carlist: [],
    loginhidde: true,
    cararr: [],
    carLevelId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectInfo();
    this.pageInfo();
  },
  pageInfo:function(){
    var that = this;
    wx.request({
      url: app.data.hostUrl + "api/services/app/vehicleCategory/GetActiveList",
      method: "post",
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          var result = res.data.result;
          that.setData({
            loginhidde: false,
            carlist: result
          })
        }
      },
      complete:function(){
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  selectInfo(){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleLevel/GetActiveList',
      method: "post",
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          var data = res.data.result;
          that.setData({
            carLevelId: data[0].id,
            cararr: data
          })
        }
      }
    });
  },
  bindcarlevel:function(e){
    this.setData({
      carLevelId: e.target.dataset.id
    })
    console.log(this.data.carLevelId)
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

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.pageInfo(true);
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