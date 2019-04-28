// pages/lesson/prepare/prepare.js
var viewU = require('../../../utils/viewU.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId: 1, //班级ID
    className: '', //班级名称
    consoleGroup: null, //hub组
    hrPackage: null, //手环包
    boy: null, //参考男生
    girl: null, //参考女生
    selectedDuration: null, //时间长度
    consoleGroups: [],
    userDefault: {
      nickname: '--',
      avatar: '/assets/img/ic_default_avatar.png',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.classname,
    });
    this.setData({
      'classId': options.classid,
      'className': options.classname
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getConsoleGroupList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //检查场地
    var consoleGroup = wx.getStorageSync("selectedConsoleGroups");
    if (consoleGroup != null) {
      this.setData({
        'consoleGroup': consoleGroup
      });
    };
    //检查手环包
    var hrPackage = wx.getStorageSync("hrPackage");
    if (hrPackage != null) {
      this.setData({
        'hrPackage': hrPackage
      });
    };
    //检查男生
    var boy = wx.getStorageSync("boy");
    if (boy != null) {
      this.setData({
        'boy': boy
      });
    };
    //检查女生
    var girl = wx.getStorageSync("girl");
    if (girl != null) {
      this.setData({
        'girl': girl
      });
    };
    var selectedDuration = wx.getStorageSync('selectedDuration');
    if (selectedDuration != null) {
      this.setData({
        'selectedDuration': selectedDuration
      });
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
   * 选择场地
   */
  selectConsoleGroup: function() {
    wx.navigateTo({
      url: '/pages/lesson/prepareConsoleGroup/prepareConsoleGroup',
    })
  },

  /**
   * 选择手环包
   */
  selectHrPackage: function() {
    wx.navigateTo({
      url: '/pages/lesson/prepareHrPackage/prepareHrPackage',
    })
  },


  /**
   *  选择男生
   */
  selectBoy: function() {
    wx.navigateTo({
      url: '/pages/lesson/prepareStu/prepareStu' +
        '?classid=' + this.data.classId +
        '&gender=1',
    });
  },

  /**
   * 选择女生
   */
  selectGirl: function() {
    wx.navigateTo({
      url: '/pages/lesson/prepareStu/prepareStu' +
        '?classid=' + this.data.classId +
        '&gender=2',
    });
  },

  /**
   * 选择时长
   */
  selectDuration: function() {
    wx.navigateTo({
      url: '/pages/lesson/prepareDuration/prepareDuration',
    })
  },

  /**
   * 获取HUB组信息
   */
  getConsoleGroupList: function() {
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
      success: function(res) {
        var data = res.data;
        wx.hideLoading();
        //获取成功
        if (res.data.errorcode == 0) {
          //数量不为0
          if (res.data.result.count != 0) {
            if (data.result.consolegroups.length == 1) {
              wx.setStorageSync('selectedConsoleGroups', data.result.consolegroups[0]);
              pThis.setData({
                'consoleGroup': data.result.consolegroups[0],
                'consoleGroups': data.result.consolegroups
              });
            }
          }
        }
      }
    });
  },

  /**
   * 点击准备上课
   */
  onFinishBtnClick: function() {
    //检查场地
    if (this.data.consoleGroup == null) {
      viewU.showErrorMsg('请选择场地');
      return;
    };
    //检查手环包
    if (this.data.hrPackage == null) {
      viewU.showErrorMsg('请选择手环包');
      return;
    };
    //检查男生
    if (this.data.boy == null) {
      viewU.showErrorMsg('请选择1号代表');
      return;
    };
    //检查女生
    if (this.data.girl == null) {
      viewU.showErrorMsg('请选择2号代表');
      return;
    };
    //检查上课时长
    if (this.data.selectedDuration == null) {
      viewU.showErrorMsg('请选择预计时长');
      return;
    }
    wx.showLoading({
      title: '准备上课...',
    });

    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/prepareClassLesson',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        teacherid: app.globalData.fizzoUserInfo.userid,
        classid: pThis.data.classId,
        consolegroupid: pThis.data.consoleGroup.id,
        hrpackageid: pThis.data.hrPackage.id,
        boy_studentid: pThis.data.boy.id,
        girl_studentid: pThis.data.girl.id,
        planned_duration: pThis.data.selectedDuration.duration
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        var data = res.data;
        //准备上课成功
        if (data.errorcode === 0) {
          //跳转到正在上课页面
          wx.redirectTo({
            url: '/pages/lesson/lessonWall/lessonWall' +
              '?classid=' + pThis.data.classId +
              '&classname=' + pThis.data.className +
              '&lessonid=' + data.result.lessonid +
              '&status=1' +
              '&teacherId=' + app.globalData.fizzoUserInfo.userid,
          });
        } else {
          viewU.showErrorMsg(data.errormsg);
        }
      },
      fail: function(res) {
        viewU.showErrorMsg('网络错误，请重试');
      }
    });
  },
})