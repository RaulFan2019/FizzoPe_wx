// pages/device/hubGroupDetail/hubGroupDetail.js
var viewU = require('../../../utils/viewU.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: 0,
    hubs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.groupName,
    });
    this.setData({
      'groupId': options.groupId
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
    this.getHubList();
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
    this.getHubList();
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
   * 获取HUB列表
   */
  getHubList: function () {
    var pThis = this;
    var app = getApp();
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getConsolegroupConsoleList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        consolegroupid: pThis.data.groupId
        // consolegroupid:34
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
            var showHubs = [];
            var hubs = data.result.consoles;
            hubs.forEach(function (v, k) {
              v.type = 1;
              showHubs.push(v);
              if (v.cassia_hubs.length > 0){
                v.cassia_hubs.forEach(function (z, d) {
                  z.type = 2;
                  z.antsn_count = 0;
                  z.versionname = "";
                  if (z.online != 2){
                    z.online = 1;
                  }
                  showHubs.push(z);
                });
              }
            });
            pThis.setData({
              'hubs': showHubs
            });
            //数量为0
          } else {
            viewU.showErrorMsg('这个HUB组内没有HUB');
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
  }
  
})