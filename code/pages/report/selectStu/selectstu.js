// pages/report/selectStu/selectstu.js
var viewU = require('../../../utils/viewU.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId: 0,
    selectIndex: 0,
    selectId: 0,
    students: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: ' 选择学生',
    });

    this.setData({
      'classId': options.classId,
      'selectIndex': options.selectIndex
    });
    this.getClassStudentList();
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
   * 获取学生列表
   */
  getClassStudentList: function() {
    var pThis = this;
    var app = getApp();
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getClassStudentList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'classid': pThis.data.classId
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        var data = res.data;
        //获取成功
        if (res.data.errorcode == 0) {
          var selectId = data.result.students[pThis.data.selectIndex].id;
          data.result.students.forEach(function(v, k) {
            if (selectId == v.id) {
              v.selected = true;
            } else {
              v.selected = false;
            }
          });
          pThis.setData({
            'students': data.result.students,
            'selectId': selectId
          });
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }
      },
      fail: function(res) {
        viewU.showErrorMsg('网络错误');
      }
    });
  },

  /**
   * 点击列表
   */
  clickstudentsItem: function(e) {
    var selectId = e.currentTarget.dataset.obj.id;
    var stus = this.data.students;
    stus.forEach(function(v, k) {
      if (selectId == v.id) {
        v.selected = true;
      } else {
        v.selected = false;
      }
    });
    this.setData({
      'students': stus
    });
  },

  /**
   * 点击返回
   */
  onFinishBtnClick: function(e) {

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var index = 0;
    for (; index < this.data.students.length; index++) {
      if (this.data.students[index].selected){
        break;
      }
    };
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      'showtab': index
    });
    wx.navigateBack({
      delta: 1
    })
  }
})