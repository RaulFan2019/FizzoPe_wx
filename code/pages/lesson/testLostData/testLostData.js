// pages/lesson/testLostData/testLostData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: '',//班级名称
    lessonId: 0,//课程ID
    classId: 0, //班级ID
    pageShow: false,
    attendances: [], //丢包数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'classId': options.classid,
      'className': options.classname,
      'lessonId': options.lessonid,
      'teacherId': options.teacherId
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
    this.setData({
      'pageShow': true
    });
    this.refreshInfoAgain(500);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      'pageShow': false
    });
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
 * 重新刷新
 */
  refreshInfoAgain: function (time) {
    if (this.data.pageShow) {
      var pThis = this;
      setTimeout(function () {
        pThis.getLostData();
      }, time);
    }
  },


  /**
   * 获取丢包数据
   */
  getLostData: function () {
    var pThis = this;
    var app = getApp();
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getLessonCassiaHeartrateAttendances',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId,
        // lessonid: 703,
        seconds:60
      },
      method: 'POST',
      dateType: 'json',
      success: function (res) {
        var data = res.data;
        //获取成功
        if (res.data.errorcode == 0) {
          pThis.setData({
            'attendances': data.result.attendances
          });
        } else {
          wx.showToast({
            title: res.data.errormsg
          });
        }
        pThis.refreshInfoAgain(1000);
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误'
        });
        pThis.refreshInfoAgain(1000);
      }
    });
  }
})