//index.js
//获取应用实例
var app = getApp();
Page({
  data:{
    arr:[],
    loginhidde:true,
  },
  onLoad: function (options) {
    var that = this;
    that.pageInfo();
  },
  oneActivityTabBar: function (e) {
    wx.switchTab({
      url: '/pages/carlist/activelist',
    })
  },
  twoActivityTabBar:function(e){
      wx.switchTab({
        url: '/pages/activity/activity',
      })
  },
  threeActivityTabBar:function(e){
    wx.switchTab({
      url: '/pages/service/service',
    })
  },
  pageInfo:function(){
    var that = this;
     wx.request({
       url: app.data.hostUrl + 'api/services/app/homeSetting/GetActiveList?top=4',
       method:"post",
       success:function(res){
         if(res.statusCode == 200 && res.data.success){
           that.setData({
             loginhidde:false,
             arr:res.data.result
           })
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
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading();
    var that = this;
    that.pageInfo();
  }
})
