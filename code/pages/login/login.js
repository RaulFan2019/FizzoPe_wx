const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    tip: '启动中...',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log("onload:" + "app.globalData.qSchoolId");
    app.globalData.qSchoolId = options.school;
    // console.log('app.globalData.qSchoolId:' + app.globalData.qSchoolId);
    
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
    // this.setData({
    //   tip: 'onShow'
    // });
    //若已经获取了用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      // console.log('getWxUserInfo 1');
      this.getWXAccountInfo();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        // console.log('getWxUserInfo 2');
        this.getWXAccountInfo();
      };
      // console.log('hasUserInfo:' + this.data.hasUserInfo + ',canIUse:' + this.data.canIUse);
      // console.log('getWxUserInfo 3');
      // this.getWxUserInfo();
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          this.getWXAccountInfo();
        }
      })
    }
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
   * 点击确认按钮
   */
  onConfirmBtnClick: function(e) {
    
  },

  userInfoHandler: function(e){
    // console.log('userInfoHandler:' + JSON.stringify(e));
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    this.getWxUserInfo();
  },

  /**
   * 获取用户信息
   */
  getWxUserInfo: function() {
    var pthis = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo,
                app.globalData.iv = res.iv,
                app.globalData.encrypted = res.encryptedData

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              pthis.getWXAccountInfo();
            }
          })
        }
      }
    })
  },

  /**
   * 获取FIZZO用户的信息
   */
  getWXAccountInfo: function() {
    var pThis = this;
    pThis.setData({
      tip: '正在获取用户信息'
    });
    wx.request({
      url: app.globalData.host + '/fitness/V2/Pekanban/getWXAAccountInfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        code: app.globalData.code,
        iv: app.globalData.iv,
        encrypted: app.globalData.encrypted,
        appid: 'wxe5d881a9b82dab89'
      },
      method: 'POST',
      dateType: 'json',
      //获取用户信息成功
      success: function(res) {
        console.log(res.data);
        //获取FIZZO用户数据成功，并赋值给全局变量
        if (res.data.errorcode == 0) {
          // console.log(JSON.stringify(res.data.result));
          app.globalData.fizzoUserInfo = res.data.result;
          //若是游客
          if (app.globalData.fizzoUserInfo.role == 0) {
            pThis.launchByGuest();
            //若非游客
          } else {
            pThis.launchByAdmin();
          }
        } else {
          console.log("res.data.errorcode:" + res.data.errorcode);
          pThis.getFizzoUserError(res.data.errormsg);
        }
      },
      //获取用户信息失败
      fail: function(res) {
        pThis.getFizzoUserError('获取用户信息失败，请重试');
      }
    })
  },

  /**
   * 管理员身份登录
   */
  launchByAdmin: function() {
    wx.switchTab({
      url: '/pages/lesson/tab/tab',
    })
  },

  /**
   * 游客身份登录
   */
  launchByGuest: function() {
    if (app.globalData.qSchoolId > 0) {
      wx.switchTab({
        url: '/pages/lesson/tab/tab',
      })
    } else {
      wx.navigateTo({
        url: '/pages/lesson/guest/guest',
      })
    }
  },

  /**
   * 获取用户数据错误
   */
  getFizzoUserError(msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    });
  }

})