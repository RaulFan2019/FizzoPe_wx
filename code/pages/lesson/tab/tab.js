// pages/lesson/tab/tab.js
var datetime = require('../../../utils/datetime')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classes: [],//班级列表
    userId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
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
      'userId': app.globalData.fizzoUserInfo.userid
    });
    this.getClassesList();
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getClassesList();
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
  * 获取班级列表
  */
  getClassesList: function () {
    var pThis = this;
    var app = getApp();
    var schoolId = app.globalData.fizzoUserInfo.schoolid;
    if (app.globalData.qSchoolId > 0) {
      schoolId = app.globalData.qSchoolId;
    }
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getSchoolClassList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        storeid: schoolId,
        teacherid: app.globalData.fizzoUserInfo.userid
      },
      method: 'POST',
      dateType: 'json',
      success: function (res) {
        var data = res.data;
        // console.log('getClassesList:' + JSON.stringify(data));
        wx.hideLoading();
        //获取成功
        if (data.errorcode == 0) {
          //数量不为0
          if (res.data.result.count != 0) {
            var classes = data.result.classes;
            classes.forEach(function (v, k) {
              v.myId = pThis.data.userId;
              if (v.lessonreminder == 2){
                v.ation = '上课中';
              } else {
                v.ation = '去上课';
              }
            });

            pThis.setData({
              'classes': classes
            });
            //数量为0
          } else {
            wx.showToast({
              title: '目前没有可显示班级'
            });
          }
        } else {
          wx.showToast({
            title: data.errormsg
          });
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: function (res) {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideLoading();
      }
    });
  },

  //点击班级列表
  clickClassItem: function (e) {
    var pThis = this;
    var app = getApp();
    var classid = e.currentTarget.dataset.obj.id;
    var classname = e.currentTarget.dataset.obj.name;
    var lessonid = e.currentTarget.dataset.obj.lessonid;
    var status = e.currentTarget.dataset.obj.lessonreminder;
    var boy = e.currentTarget.dataset.obj.boy;
    var girl = e.currentTarget.dataset.obj.girl;
    var duration = e.currentTarget.dataset.obj.lessondefaultduration;
    var teacherId = e.currentTarget.dataset.obj.lessonteacherid;

    //准备上课页面app.globalData.fizzoUserInfo.role
    if (status == 0) {
      if(app.globalData.fizzoUserInfo.role == 5
        || app.globalData.fizzoUserInfo.role == 0){
        wx.showToast({
          title: '观课者不能开课',
        });
        return;
      }
      wx.setStorageSync("selectedConsoleGroups", null);
      wx.setStorageSync("hrPackage",null);
      if (boy.studentnumber == 0){
        wx.setStorageSync("boy", null);
      }else{
        wx.setStorageSync("boy", boy);
      }
      if (girl.studentnumber == 0) {
        wx.setStorageSync("girl", null);
      } else {
        wx.setStorageSync("girl", girl);
      }
      var durationObj = {};
      durationObj.duration = duration;
      durationObj.selected = true;

      wx.setStorageSync('selectedDuration', durationObj);

      wx.navigateTo({
        url: '/pages/lesson/prepare/prepare'
        + '?classid=' + classid
        + '&classname=' + classname
        + '&lessonid=' + lessonid,
      })
      return;
    }


    wx.navigateTo({
      url: '/pages/lesson/lessonWall/lessonWall'
      + '?classid=' + classid
      + '&classname=' + classname
      + '&lessonid=' + lessonid
      + '&status=' + status
      + '&teacherId=' + teacherId,
    });
  },


  /**
   * 点击部署按钮
   */
  onMapOutBtnClick: function(e){
    this.vibrate(0);
  },

  vibrate: function (virvateTimes){
    var pThis = this;
    var times = virvateTimes + 1;
    
    wx.vibrateLong({
      success : function(e){
        if(times < 10){
          setTimeout(function () {
            pThis.vibrate(times);
          }, 500);
        }
      }
    })
  }

})