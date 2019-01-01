var app = getApp();
// pages/activity/activitypage.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _sex:1,
    ajaxstatus: true,
    hidden:true,
    loginhidde:true
  },
  bindSexChange: function (e) {
    this.setData({
      _sex: e.target.dataset.sex
    })
  },
  bindMemberChange: function (e) {
    this.setData({
      _member: e.target.dataset.member
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      activityId: options.id
    })
    that.getActivity(options.id);
  },

  getActivity:function(id){
    var that = this;
    wx.request({
      url: app.data.hostUrl+'api/services/app/activity/GetById',
      method:"post",
      data:{id:id},
      success:function(res){
        if (res.statusCode == 200 && res.data.success){
            var data = res.data.result;
            WxParse.wxParse('accontent', 'html', data.activity.content, that, 0);
            that.setData({
              loginhidde:false,
              imgurl: data.activity.imgUrl
            })
          }
      }
    })
  },
  formSubmit:function(e){
    var that = this;
    var msg = e.detail.value;

    //验证信息是否正确
    if (!that.data.ajaxstatus) {
      console.log("信息提交中")
      return false;
    }
    if (msg.username == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (!app.isPoneAvailable(msg.tel)) {
      wx.showToast({
        title: '电话号码输入有误',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (msg.email != "" && !app.isEmailAvailable(msg.email)) {
      wx.showToast({
        title: '邮箱输入有误',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    
    that.setData({
      ajaxstatus: false,
      hidden:false
    })
    var postdata = {
      accountId: wx.getStorageSync("userId"),
      name: msg.username,
      tel: msg.tel,
      email: msg.email,
      vehicleId:"",
      appointmentDate:"",
      dealerId:"",
      activityId: that.data.activityId * 1,
      genderId: that.data._sex * 1,
      sessionId: wx.getStorageSync('sessionId'),
      description: "",
      FormId: "activity"
    }
    wx.request({
      url: app.data.hostUrl + 'api/MiniApp/addactivityappointment',
      data: postdata,
      method: 'POST',
      success: function (res){
        that.setData({
          ajaxstatus: true,
          hidden: true
        })
        if (res.data.success){
          wx.redirectTo({
            url: '/pages/success/index'
          })
        } else {
          wx.showToast({
            title: res.data.error.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        //未发送请求
        that.setData({
          ajaxstatus: true,
          hidden: true
        })
        wx.showToast({
          title: '网络异常，请检查网络状态',
          icon: 'none',
          duration: 2500
        })
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