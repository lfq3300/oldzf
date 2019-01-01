App({
  onLaunch: function() {
    wx.loadFontFace({
      family: 'MYingHeiPRC-W3',
      source: 'url("https://miniprogram.zfchina.com/fonts/zf/MYingHeiPRC-W3.otf")',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
    wx.loadFontFace({
      family: 'MYingHeiPRC-W4',
      source: 'url("https://miniprogram.zfchina.com/fonts/zf/MYingHeiPRC-W4.otf")',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
    wx.loadFontFace({
      family: 'MYingHeiPRC-W5',
      source: 'url("https://miniprogram.zfchina.com/fonts/zf/MYingHeiPRC-W5.otf")',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
    this.getUserInfo();
    this.getUserAddsInfo();

  },
  data: {
    hostUrl: "https://miniprogram.zfchina.com/",
    appid: "wx4d69fe23e65ae0ca",
    appKey: "f3ee574e618801a984354749b2657b21",
    userInfoStatus: false,
  },
  globalData: {
    appcode: ""
  },

  getUserAddsInfo: function() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.globalData.latitude = res.latitude;
        that.globalData.longitude = res.longitude;
      }
    })
  },
  getUserInfo: function(e) {
    var that = this;
    if (wx.getStorageSync('sessionId').length == 0) {
      wx.login({
        success: function(res) {
          var code = res.code;
          wx.request({
            url: that.data.hostUrl + 'api/MiniApp/wechatoauth',
            data: {
              code: code
            },
            method: 'post',
            success: function(res) {
              console.log('123');
              console.log(res)
              if (res.statusCode == 200 && res.data.success) {
                wx.setStorageSync('sessionId', res.data.result);
                that.getUserId();
              }
            }
          })
        }
      })
    }
  },
  getUserId: function() {
    var that = this;
    //判断是否有UserInfo,如果存在不获取,不存在获取
    if (wx.getStorageSync('userId').length == 0) {
      //判断用户是否授权过
      wx.getSetting({
        success: function(res) {
          //授权过
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function(e) {
                var userInfo = e.userInfo;
                that.getAdminUserId(userInfo);
              }
            })
          } else {
            //未授权 ，引导授权
            wx.navigateTo({
              url: "/pages/userinfo/index"
            })
          }
        }
      })
    }
  },
  getAdminUserId: function(userInfo) {
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/MiniApp/checkaccount',
      method: "post",
      data: {
        sessionId: wx.getStorageSync('sessionId'),
        nickName: userInfo.nickName,
        city: userInfo.city,
        country: userInfo.country,
        province: userInfo.province,
        avatarUrl: userInfo.avatarUrl,
        gender: 0
      },
      success: function(res) {
        if (res.statusCode == 200 && res.data.success) {
          wx.setStorageSync('userId', res.data.result.accountId);
          wx.setStorageSync('userItoken', res.data.result.token);
          //授权失败怎么说？
        }
      }
    })
  },
  //判断是否已经登陆  在一定需要登陆的界面判断
  ifUserLogin: function() {
    var that = this;
    //直接判断有没有accountid  就重新授权
    if (wx.getStorageSync('userId').length == 0) {
      that.getUserId();
    }
  },
  isPoneAvailable: function(pone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  },
  isEmailAvailable: function(email) {
    var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!myreg.test(email)) {
      return false;
    } else {
      return true;
    }
  },
})