// pages/lesson/prepareConsoleGroup/prepareConsoleGroup.js
var viewU = require('../../../utils/viewU.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consoleGroups:[],
    selectedConsoleGroups:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    wx.showLoading({
      title: '数据加载中',
    });
    this.setData({
      'selectedConsoleGroups': wx.getStorageSync('selectedConsoleGroups')
    })
    this.getConsoleGroupList();
    
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
    this.getConsoleGroupList();
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
   * 获取HUB组信息
   */
  getConsoleGroupList: function () {
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
            var consoleGroups = data.result.consolegroups;
            pThis.checkSelectedList(consoleGroups);
            //数量为0
          } else {
            viewU.showErrorMsg('目前没有场地');
          }
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }
      },
      fail: function (res) {
        viewU.showErrorMsg('网络错误');
        wx.hideLoading();
      }
    });
  },

  /**
   *  点击列表
   */
  clickItem: function (e) {
    this.setData({
      'selectedConsoleGroups': e.currentTarget.dataset.obj
    });
    this.checkSelectedList(this.data.consoleGroups);
    wx.setStorageSync('selectedConsoleGroups', this.data.selectedConsoleGroups);
  },

  /**
   * 检查是否被选中
   */
  checkSelectedList: function (consoleGroups) {
    if (this.data.selectedConsoleGroups != null){
      var selectId = this.data.selectedConsoleGroups.id;
      consoleGroups.forEach(function (v, k) {
        if (selectId == v.id) {
          v.selected = true;
        } else {
          v.selected = false;
        }
      });
    }
    this.setData({
      'consoleGroups': consoleGroups
    });
  },

  /**
   * 点击完成按钮
   */
  onFinishBtnClick: function () {
    if (this.data.selectedConsoleGroups == null) {
      viewU.showErrorMsg('未选择场地');
    } else {
      wx.navigateBack({});
    }
  },

})