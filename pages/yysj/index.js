var app = getApp();
// pages/yysj/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cararr: ['--'],
    jxs:["--"],
    carindex: 0,
    carId:0,
    _sex: 0,
    jxsindex:0,
    mapstatus:false,
    ajaxstatus:true,
    hidden:true,
    date:null,
    loginhidde: true,
    timeIndex:0,
    timeArrIdArr:[],
    timeArr:["--"]
  },
  bindcarType: function (e) {
    var index = e.detail.value;
    var that = this;
    var data = that.data.carold;
    that.setData({
      carindex: index,
      carId: data[index].id,
      imgurl: data[index].imgUrl,
    });
  },
  bindjsxType: function (e) {
    var addrs = this.data.addrs;
    var jxs = this.data.jxs;
    this.setData({
      mapstatus: false,
      jxsindex: e.detail.value,
      latitude: addrs[e.detail.value].latitude,
      longitude: addrs[e.detail.value].longitude,
      markers: [{
        latitude: addrs[e.detail.value].latitude,
        longitude: addrs[e.detail.value].longitude,
        name: addrs[e.detail.value].address,
        iconPath: '/images/icons/location.png',
        height: 37,
        width: 28,
        callout: {
          content: jxs[e.detail.value] + "\n地址:" + addrs[e.detail.value].address + "\n电话:" + addrs[e.detail.value].tel,
          bgColor: "#ffffff",
          color: "#999999",
          padding: 10,
          display: "ALWAYS",
          borderRadius: 5
        },
      }]
    });
    this.setData({
      mapstatus: true,
    })
  },

  bindSexChange: function (e) {
    this.setData({
      _sex: e.target.dataset.sex
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeType:function(e){
    var that = this;
    this.setData({
      timeIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //app.ifUserLogin();
    var that = this;
    this.setData({
      pageoptions: options
    })
    that.pageInfo(options);
  },
  pageInfo: function (options){
    var that = this;
    that.setDistributor();
    // 精确到分的处理，将数组的秒去掉
    var myDate = new Date();
    var m = myDate.getMonth() + 1;
    //如果超过了18点 就只能预约第二天的
    var t = 0;
    //例如现在预约 ， 现在9点 只能预约 10-11点的 超过18点 第二天全天不用判断
    if(myDate.getHours()>=18){
      t = 1;
    }
    
    //判断现在预约,智能时间
    var b = myDate.getDate()+t;
    var date = myDate.getFullYear() + "-" + m + "-" +b;
    that.setData({
      _sex: wx.getStorageSync('userinfo').gender,
      date: date,
    });
    if (options.cartype){
      that.getCar(options.categoryid);
      that.setData({
        carindex: options.id,
        carId: options.id,
        activityId:0,
      })
    }else{
      that.getActivity(options.id);
      that.getVehicle();
      that.setData({
        activityId: options.id,
      })
    }
    that.getTime();
  },
  getTime:function(){
    var that = this;
    wx.request({
      url: app.data.hostUrl + '/api/services/app/globalInformation/GetListByType?type=2',
      method: "post",
      success: function (res){
        if (res.statusCode == 200 && res.data.success) {
          var result = res.data.result;
          var a = [];
          var b = [];
          for (var i = 0; i < result.length;i++){
            a[i] = result[i].name;
            b[i] = result[i].value;
          }
          that.setData({
            timeArr:a,
            timeArrIdArr:b
          })
        }
      }
    })
  },
  getCar:function(id){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicle/GetActiveList?categoryId='+id,
      method:"post",
      data:{
        categoryId: id
      },
      success:function(res){
        if (res.statusCode == 200 && res.data.success){
          var data = res.data.result;
          var cararr = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].id == that.data.carindex) {
              that.setData({
                imgurl: data[i].imgUrl,
                carindex: i,
                loginhidde: false
              })
            }
            cararr[i] = data[i].name;
          }
          that.setData({
            cararr: cararr,
            carold: data
          })
        }
      }
    })
  },

  getVehicle: function(){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicle/GetActiveList',
      method: "post",
      success:function(res){
        if (res.statusCode == 200 && res.data.success){
              var data = res.data.result;
              var cararr = [];
              for(var i = 0;i<data.length;i++){
                cararr[i] = data[i].name;
              }
              that.setData({
                cararr:cararr,
                carold: data,
              })
          }
      }
    });
  },
  
  getActivity: function (id) {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/activity/GetById',
      method: "post",
      data: { id: id },
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          var data = res.data.result;
          if (data.activity.vehicleId>0){
            that.setData({
              imgurl: data.activity.imgUrl,
              carindex: data.activity.vehicleId,
              carId:data.activity.vehicleId,
              loginhidde: false
            });
          }else{
            that.setData({
              imgurl: data.activity.imgUrl,
              loginhidde: false
            });
          }
        }
      }
    })
  },
  setDistributor:function(){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/dealer/GetActiveList',
      method: "post",
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
            var data = res.data.result;
            data = that.sortAddres(data);
            var jsx = [];
            var addrs = [];
            for(var i = 0;i<data.length;i++){
              jsx[i] = data[i].name;
              var c = {};
              c.latitude = data[i].latitude;
              c.longitude = data[i].longitude;
              c.tel = data[i].tel;
              c.address = data[i].address;
              c.id = data[i].id;
              addrs[i] = c;
            }
            that.setData({
              jxs:jsx,
              addrs:addrs,
              latitude: addrs[0].latitude,
              longitude: addrs[0].longitude,
              markers: [{
                latitude: addrs[0].latitude,
                longitude: addrs[0].longitude,
                name: addrs[0].address,
                iconPath: '/images/icons/location.png',
                height: 37,
                width: 28,
                callout: {
                  content: jsx[0] + "\n地址:" + addrs[0].address + "\n电话:" + addrs[0].tel,
                  bgColor: "#ffffff",
                  color: "#999999",
                  padding: 10,
                  display: "ALWAYS",
                  borderRadius: 5
                },
              }],
              mapstatus:true
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
  sortAddres:function(data){
    var that = this;
    var latitude = app.globalData.latitude;
    var longitude = app.globalData.longitude;
    var distance = [];
    for(var i = 0;i<data.length;i++){
       var c = {};
       c.aindex = i;
       c.distance = that.GetDistance(latitude, longitude, data[i].latitude, data[i].longitude);
       distance[i] = c;
    }
    var max;
    for (var i = 0; i < distance.length; i++) {
      for (var j = i; j < distance.length; j++) {
        if (distance[i].distance > distance[j].distance) {
          max = distance[j];
          distance[j] = distance[i];
          distance[i] = max;
        }
      }
    }
    var newData = [];
    for (var i = 0; i < distance.length;i++){
      newData[i] = data[distance[i].aindex]
    }
    return newData;
  },

  Rad:function(d){
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
  },
  GetDistance: function(lat1, lng1, lat2, lng2){
    var that = this;
    var radLat1 = that.Rad(lat1);
    var radLat2 = that.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = that.Rad(lng1) - that.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137 ;
    s = Math.round(s * 10000) / 10000; //输出为公里
    return s;
  },
  /*提交预约信息*/
  formSubmit: function (e) {
    var that = this;
    if(!that.data.ajaxstatus){
      return false;
    }
    
    var msg = e.detail.value;
    if(msg.username == ""){
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if(!app.isPoneAvailable(msg.tel)){
      wx.showToast({
        title: '电话号码输入有误',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    that.setData({
      ajaxstatus:false,
      hidden: false,
    })
    var data = {
      accountId: wx.getStorageSync("userId"),
      name:msg.username,
      tel: msg.tel,
      vehicleId: that.data.carId*1,
      dealerId: that.data.addrs[that.data.jxsindex].id*1,
      appointmentDate: that.data.date,
      appointmentTimeId: that.data.timeArrIdArr[that.data.timeIndex],
      activityId: that.data.activityId*1,
      genderId:that.data._sex*1,
      sessionId: wx.getStorageSync('sessionId'),
      description:"",
      fromId:"appointment"
    }
    
    wx.request({
      url: app.data.hostUrl + 'api/MiniApp/addappointment',
      data: data,
      method: 'POST',
      success: function (res) {
        that.setData({
          ajaxstatus: true,
          hidden: true,
        })
        if (res.data.success){
          wx.redirectTo({
            url: '/pages/success/index'
          })
        }else{
          wx.showToast({
            title: res.data.error.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail:function(){
        //未发送请求
        that.setData({
          ajaxstatus: true,
          hidden: true,
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
    var that = this;
    that.pageInfo(that.setData.pageoptions);
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
    var that = this;
    wx.showNavigationBarLoading();
    var that = this;
    that.pageInfo(that.data.pageoptions);
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
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

  },

})