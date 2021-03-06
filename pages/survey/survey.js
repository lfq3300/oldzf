// pages/survey/survey.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde:true,
    title:'',
    surveyArr:[],
    questions:[],
    textArrStatus:[],
    textArrValue: [],
    pageId:'',
    hidden:true,
    ajaxstatus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //app.ifUserLogin();
    var that = this;
    that.setData({
      SurveyIdTitle: options.title,
      pageId: options.id,
      options: options
    })
    that.pageInfo(options);
  },
  pageInfo: function (options){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/surveyQuestion/GetListBySurveyIdAsync?surveyId=' + parseInt(that.data.pageId) + '&accountId='+ wx.getStorageSync('userId'),
      method:'POST',
      success:function(res){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        if (res.statusCode == 200 && res.data.success) {
          var textArrStatus =[];
          var textArrValue =[];
          res.data.result.forEach((item,index)=>{
            if (item.type != 'text' && item.options.length>0){
              var v =  false;
              var b = item.options;
              for (var i = 0; i < b.length;i++){
                if (b[i].otherOption && b[i].isSelected){
                  v = true;
                  break;
                }
              }
              if (v){
                textArrStatus.push(true);
              }else{
                textArrStatus.push(false);
              }
            }else{
              textArrStatus.push(false);
            }
            textArrValue.push('');
          })
          console.log(res.data.result[0]);
          that.setData({
            SurveyIdTitle: res.data.result[0].surveyIdName,
            surveyArr: res.data.result,
            textArrStatus: textArrStatus,
            textArrValue: textArrValue,
            loginhidde:false
          });
        }
      },
      fail: function (res){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        console.log('--fail--');
        console.log(res)
      }
    })
  },
  bindRadioOption:function(e){
    var questionid = e.target.dataset.questionid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index);
  },
  
  bindCheckboxOption:function(e){
    var questionid = e.target.dataset.questionid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index, true);
  },
  setFromData: function (e, questionid,index,status = false) {
    var value = e.detail.value;
    var questions = this.data.questions;
    var len = questions.length;
    var textArrStatus = this.data.textArrStatus;
    var textArrValue = this.data.textArrValue;
    for (var i = 0; i < len; i++) {
      if (parseInt(questions[i].questionId) === parseInt(questionid)){
        delete questions[i];
      }
    }
    var newquestions = [];
    for (var i = 0; i < len; i++){
      if (typeof (questions[i]) != 'undefined'){
        newquestions.push(questions[i])
        }
    }
    var newJsonData = {};
    if (status){
      if (value.length == 0){
        textArrStatus[index] = false;
      }
      for (var i = 0; i < value.length; i++){
        var val = value[i].split("-|-");
        if (val[2] == 'true') {
          textArrStatus[index] = true;
          break;
        }else{
          textArrStatus[index] = false;
        }
      }
      for(var i= 0;i<value.length;i++){
        var val = value[i].split("-|-");
        if (val[2] == 'true') {
          newJsonData =  {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: textArrValue[index] ? textArrValue[index] : '其他',
            otherOption: val[2],
          }
        }else{
          newJsonData = {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: val[1],
            otherOption: val[2],
          }
        }
        newquestions.push(newJsonData);
      }
    }else{
      var val = value.split("-|-");
      if (val[2] == 'true') {
        textArrStatus[index] = true;
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: textArrValue[index] ? textArrValue[index]:'其他',
          otherOption: val[2],
        }
      } else {
        textArrStatus[index] = false;
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: val[1],
          otherOption: val[2],
        }
      }
      newquestions.push(newJsonData);
    }
    this.setData({
      questions: newquestions,
      textArrStatus: textArrStatus
    })
  },
  bingTextarea:function(e){
    var questionid = e.target.dataset.questionid;
    var index = e.target.dataset.index;
    var value = e.detail.value;
    var optionId = e.target.dataset.id;
    var questions = this.data.questions;
    var textArrValue = this.data.textArrValue;
    var len = questions.length;
    for(var i = 0;i<len;i++){
      if (parseInt(questions[i].questionId) == parseInt(questionid) && questions[i].otherOption == 'true'){
        questions[i].content = value;
      }
    }
    textArrValue[index] = value;
    this.setData({
      questions: questions,
      textArrValue: textArrValue
    })
  },
  bingOtherTextarea:function(e){
    var questionid = e.target.dataset.questionid;
    var value = e.detail.value;
    var questions = this.data.questions;
    var len = questions.length;
    for (var i = 0; i < len; i++) {
      if (parseInt(questions[i].questionId) === parseInt(questionid)) {
        delete questions[i];
      }
    }
    var newquestions = [];
    for (var i = 0; i < len; i++) {
      if (typeof (questions[i]) != 'undefined') {
        newquestions.push(questions[i])
      }
    }
    newquestions.push({
      questionId: parseInt(questionid),
      optionId: 0,
      content: value,
      otherOption: 'other',
    })
    this.setData({
      questions: newquestions
    })
  },
  submitFrom:function(){
    var that = this;
    if (that.data.questions.length == 0){
      wx.showToast({
        title: '不能提交空问卷',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!that.data.ajaxstatus){
      return;
    }
    that.setData({
      hidden:false,
      ajaxstatus:false
    })
    wx.request({
      url: app.data.hostUrl + 'api/MiniApp/addsurvey',
      method:"post",
      data:{
        surveyId: parseInt(that.data.pageId),
        accountId: wx.getStorageSync('userId'),
        questions: that.data.questions
      },
      success:function(res){
        that.setData({
          ajaxstatus: true,
          hidden: true,
        })
        if (res.data.success) {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000,
            success:function(){
              setTimeout(function(){
                wx.switchTab({
                  url: '/pages/survey/index'
                })
              },1500)
            }
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
    that.pageInfo(that.setData.options);
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
    this.pageInfo(this.data.options);
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