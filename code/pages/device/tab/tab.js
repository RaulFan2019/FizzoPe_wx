// pages/device/tab/tab.js

var viewU = require('../../../utils/viewU.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hubGroups: []
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
    this.getHubGroupList();
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
    this.getHubGroupList();
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
  getHubGroupList: function () {
    var pThis = this;
    var app = getApp();
    var schoolId = app.globalData.fizzoUserInfo.schoolid;
    if (app.globalData.qSchoolId > 0) {
      schoolId = app.globalData.qSchoolId;
    }

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getSchoolConsolegroupList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        storeid: schoolId
      },
      method: 'POST',
      dateType: 'json',
      success: function (res) {
        var data = res.data;
        wx.hideLoading();
        //获取成功
        if (res.data.errorcode == 0) {
          //数量不为0
          if (res.data.result.count != 0) {
            var hubGroups = data.result.consolegroups;
            pThis.setData({
              'hubGroups': hubGroups
            });
            //数量为0
          } else {
            viewU.showErrorMsg('目前没有可用的HUB组');
          }
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: function (res) {
        viewU.showErrorMsg('网络错误');
        wx.hideLoading();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },

  /**
   * 点击HUB组
   */
  clickGroupItem: function (e) {
    var groupName = e.currentTarget.dataset.obj.name;
    var groupId = e.currentTarget.dataset.obj.id;
    var gourpCount = e.currentTarget.dataset.obj.console_count;

    wx.navigateTo({
      url: '/pages/device/hubGroupDetail/hubGroupDetail'
      + '?groupName=' + groupName
      + '&groupId=' + groupId
      + '&groupCount=' + gourpCount,
    })
    e.currentTarget.dataset.obj
  }
})