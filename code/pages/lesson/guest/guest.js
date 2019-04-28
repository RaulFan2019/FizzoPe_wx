// pages/lesson/guest/guest.js
const app = getApp()
const uThis = this

var viewU = require('../../../utils/viewU.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 提交邀请码
   */
  inputCode: function(e) {
    console.log("code: " + this.data.code);
    var pCode = this.data.code;
    var pThis = this;
    wx.request({
      url: app.globalData.host + '/fitness/V2/Pekanban/joinSchoolByInvitecode',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userid: app.globalData.fizzoUserInfo.userid,
        invitecode:pCode
      },
      method: 'POST',
      dateType: 'json',
      //获取用户信息成功
      success: function(res) {
        console.log(res.data);
        //获取FIZZO用户数据成功，并赋值给全局变量
        if (res.data.errorcode == 0) {
          app.globalData.fizzoUserInfo = res.data.result;
          // console.log(JSON.stringify(res.data.result));
          //若是游客
          if (app.globalData.fizzoUserInfo.role == 0) {
            pThis.launchByGuest();
            //若非游客
          } else {
            pThis.launchByAdmin();
          }
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }
      },
      //获取用户信息失败
      fail: function(res) {
        viewU.showErrorMsg('提交邀请码失败，请重试');
      }
    })
  },

  /**
   * 输入发生改变
   */
  codeChanged: function(e) {
    this.setData({
      'code': e.detail.value
    });
  },

  /**
   * 管理员身份登录
   */
  launchByAdmin: function () {
    wx.switchTab({
      url: '/pages/lesson/tab/tab',
    })
  },
})