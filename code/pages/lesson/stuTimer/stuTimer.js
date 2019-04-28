// pages/lesson/stuTimer/stuTimer.js
var interval = null;
var viewU = require('../../../utils/viewU.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no : null,
    nickName : null,
    avatar : null,
    lessonId : null,
    userDefault: {
      nickname: '--',
      avatar: '/assets/img/ic_default_avatar.png',
    },
    //timer
    showStart:true,
    time:0,
    displayTime:'00:00:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.nickName,
    });
    this.setData({
      'id': options.id,
      'no': options.no,
      'nickName': options.nickName,
      'avatar': options.avatar,
      'lessonId': options.lessonId,
    });
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
    interval = null;
    clearInterval(interval);
    this.getStudentExerciseStatus();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (interval) {
      clearInterval(interval);
      interval = null;
    } else {
      this.setData({
        time: 0,
        displayTime: '00:00:00'
      })
    }
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
  
  },

  /**
   * 获取该学生的运动状态
   */
  getStudentExerciseStatus: function(){
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getStudentExerciseStatus',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId,
        studentid: pThis.data.id
      },
      method: 'POST',
      dateType: 'json',
      success: function (res) {
        var data = res.data;
        var time = data.result.exercising_passed * 100;
        //获取成功
        if (res.data.errorcode == 0) {
          pThis.setData({
            'time': time
          });
          //若计时器没有开始
          if (data.result.exercising_passed != 0){
            pThis.startTimer();
          }
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }
      },
      fail: function (res) {
        viewU.showErrorMsg('网络错误');
      }
    });
  },

  /**
   * 解析时间
   */
  parseTime() {
    var mm = parseInt(this.data.time / 100 / 60);
    if (mm < 10) mm = '0' + mm;
    var ss = parseInt(this.data.time % 6000 / 100);
    if (ss < 10) ss = '0' + ss;
    var ssss = parseInt(this.data.time % 100);
    if (ssss < 10) ssss = '0' + ssss;
    return `${mm}:${ss}:${ssss}`
  },


  /**
   * 开始计时
   */
  onStartHandler() {
    var pThis = this;
    var app = getApp();

    if (!interval) {
      wx.request({
        url: app.globalData.host + '/fitness/V2/School/startStudentExercise',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          lessonid: pThis.data.lessonId,
          studentid: pThis.data.id
        },
        method: 'POST',
        dateType: 'json',
        success: function (res) {
          var data = res.data;
          //获取成功
          if (res.data.errorcode == 0) {
            pThis.setData({
              'time': 0,
              'displayTime': '00:00:00'
            });
            pThis.startTimer();
          } else {
            viewU.showErrorMsg(res.data.errormsg);
          }
        },
        fail: function (res) {
          viewU.showErrorMsg('网络错误');
        }
      });
    }
  },

  /**
   * 停止计时
   */
  onStopHandler() {
    var pThis = this;
    var app = getApp();

    if (interval) {
      wx.request({
        url: app.globalData.host + '/fitness/V2/School/finishStudentExercise',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          lessonid: pThis.data.lessonId,
          studentid: pThis.data.id
        },
        method: 'POST',
        dateType: 'json',
        success: function (res) {
          //获取成功
          if (res.data.errorcode == 0) {
            pThis.stopTimer();
          } else {
            viewU.showErrorMsg(res.data.errormsg);
          }
        },
        fail: function (res) {
          viewU.showErrorMsg('网络错误');
        }
      });
    } else {
      this.setData({
        'time': 0,
        'displayTime': '00:00:00',
        'showStart': true
      })
    }
  },

  startTimer : function(){
    this.setData({
      'showStart': false,
      'displayTime': '00:00:00'
    });
    interval = setInterval(() => {
      this.setData({
        'time': this.data.time + 1,
        'displayTime': this.parseTime(this.data.time)
      })
    }, 10);
  },

  stopTimer : function(){
    clearInterval(interval);
    interval = null;
    this.setData({
      'showStart': true
    });
  }
})