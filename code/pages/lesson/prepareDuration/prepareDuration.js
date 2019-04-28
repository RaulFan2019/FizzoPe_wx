// pages/lesson/prepareDuration/prepareDuration.js
var viewU = require('../../../utils/viewU.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    durations:[],
    selectedDuration:null
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
      'selectedDuration': wx.getStorageSync('selectedDuration')
    })
    this.getSchoolInfo();
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
    this.getSchoolInfo();
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
   * 获取学校信息
   */
  getSchoolInfo: function(){
    var pThis = this;
    var app = getApp();
    var schoolId = app.globalData.fizzoUserInfo.schoolid;
    if (app.globalData.qSchoolId > 0) {
      schoolId = app.globalData.qSchoolId;
    }
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getSchoolInfo',
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
          var durationStr = '' + data.result.store.pelesson_durations;
          var duration = durationStr.split(',');
          var durationitems = [];
          for (var i = 0; i < duration.length; i++){
            var durationitem = {
              duration: duration[i]
            }
            durationitems.push(durationitem);
          }
          pThis.checkSelectedList(durationitems);
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
      'selectedDuration': e.currentTarget.dataset.obj
    });
    this.checkSelectedList(this.data.durations);
    wx.setStorageSync('selectedDuration', this.data.selectedDuration);
  },


  /**
   * 检查选择项
   */
  checkSelectedList: function (durationitems){
    if(this.data.selectedDuration != null){
      var selectDuration = this.data.selectedDuration
      durationitems.forEach(function (v, k) {
        if (selectDuration.duration == v.duration) {
          v.selected = true;
        } else {
          v.selected = false;
        }
      });
    }
    this.setData({
      'durations': durationitems
    });
  },

    /**
   * 点击完成按钮
   */
  onFinishBtnClick: function () {
    if (this.data.selectedDuration == null) {
      viewU.showErrorMsg('未选择上课时间');
    } else {
      wx.navigateBack({});
    }
  }

})

