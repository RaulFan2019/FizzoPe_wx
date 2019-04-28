// pages/report/tab/tab.js
var datetime = require('../../../utils/datetime')
var viewU = require('../../../utils/viewU.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reports: [],
    showPullDown: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '数据加载中',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getReportList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getReportList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取班级列表
   */
  getReportList: function() {
    var pThis = this;
    var app = getApp();
    var schoolId = app.globalData.fizzoUserInfo.schoolid;
    if (app.globalData.qSchoolId > 0) {
      schoolId = app.globalData.qSchoolId;
    }
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getSchoolTeacherLessonList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        storeid: schoolId,
        // teacherid:147
        teacherid: app.globalData.fizzoUserInfo.userid
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        var data = res.data;
        wx.hideLoading();
        //获取成功
        if (res.data.errorcode == 0) {
          console.log(res);
          //数量不为0
          if (res.data.result.count != 0) {
            var reports = [];
            data.result.lessons.forEach(function(v, k) {
              if (v.duration > 60 * 15 &&
                v.duration < 2 * 60 * 60 &&
                v.classid != 0) {
                reports.push(v);
              }
            });

            pThis.setData({
              'reports': reports
            });
            //数量为0
          } else {
            viewU.showErrorMsg('目前没有体育课报告');
          }
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }
        pThis.setData({
          'showPullDown': false
        });
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: function(res) {
        viewU.showErrorMsg('网络错误');
        wx.hideLoading();
        pThis.setData({
          'showPullDown': false
        });
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },


  /**
   * 点击报告
   */
  clickReportItem: function(e) {
    var classid = e.currentTarget.dataset.obj.classid;
    var classname = e.currentTarget.dataset.obj.classname;
    var lessonid = e.currentTarget.dataset.obj.id;

    wx.navigateTo({
      url: '/pages/report/lesson2/lesson2' +
        '?classid=' + classid +
        '&classname=' + classname +
        '&lessonid=' + lessonid,
    });
  }

})