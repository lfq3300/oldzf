// pages/carlist/details.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde: true,
    contentstatus:true,
    btnstatus:false,
    nullinfo:false
  },
  swipercar:function(e){
    var that = this;
    var index = e.detail.current;
    that.setData({
      contentstatus:false
    })
    WxParse.wxParse('accontent', 'html', that.data.carlist[index].content, that, 0);
    that.setData({
      contentstatus: true,
      category: that.data.carlist[index].categoryId,
      id: that.data.carlist[index].id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      pageid: options.id
    })
    that.getVehicle(that.data.id);
  },
  navyysj: function (e) {
    var that = this;
    var url = '/pages/yysj/index?id=' + that.data.id + "&cartype=true&categoryid=" + that.data.category;
    wx.navigateTo({
      url: url,
    })
  },
  getVehicle: function (id) {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicle/GetActiveList?categoryId='+id,
      method: "post",
      data: {
        id: id
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          var data = res.data.result;
          if(data.length>0){
            WxParse.wxParse('accontent', 'html', data[0].content, that, 0);
            that.setData({
              loginhidde: false,
              carlist: data,
              category: data[0].categoryId,
              id: data[0].id,
              btnstatus: true
            })
          }else{
            that.setData({
              nullinfo: true,
              loginhidde: false,
            })
          }
        }
      },
      complete: function () {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
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
    console.log(that.data);
    that.getVehicle(that.data.pageid);
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