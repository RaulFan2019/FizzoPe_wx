// pages/lesson/lessonWall/lessonWall.js
var viewU = require('../../../utils/viewU.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId: 1, //班级ID
    className: '', //班级名称
    lessonId: 0, //课程ID 
    teacherId: 0,
    myId: 0,
    students: [],
    boy: null, //参考男生
    girl: null, //参考女生
    status: -1, //上课状态
    pageShow: false,
    userDefault: {
      nickname: '--',
      avatar: '/assets/img/ic_default_avatar.png',
    },
    warningSize: 0,
    warningTx: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var app = getApp();
    wx.setNavigationBarTitle({
      title: options.classname,
    });
    this.setData({
      'classId': options.classid,
      'className': options.classname,
      'lessonId': options.lessonid,
      'status': options.status,
      'teacherId': options.teacherId,
      'myId': app.globalData.fizzoUserInfo.userid
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
    if (this.data.myId == this.data.teacherId) {
      this.showHrWall();
    }
    this.setData({
      'pageShow': true
    });
    this.refreshInfoAgain(500);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      'pageShow': false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      'pageShow': false
    });
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
   * 显示心率墙
   */
  showHrWall: function() {
    var pThis = this;
    var app = getApp();

    if (this.data.myId != this.data.teacherId) {
      viewU.showErrorMsg('抱歉，您没有权限做此操作');
      return;
    }
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/selectLessonStudent',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId,
        studentnumber: 0
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        var data = res.data;
        if (data.errorcode === 0) {
        } else {
          setTimeout(function() {
            pThis.showHrWall();
          }, 1000);

        }
      },
      fail: function() {
        setTimeout(function() {
          pThis.showHrWall();
        }, 1000);
      }
    });
  },


  /**
   * 获取班级信息
   */
  getClassStudentList: function() {
    var pThis = this;
    var app = getApp();
    console.log('classid:' + this.data.classId);
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getClassStudentList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        classid: pThis.data.classId
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        var data = res.data;
        console.log(JSON.stringify(data));
        //获取成功
        if (res.data.errorcode == 0) {
          //如果课程已经结束
          if (res.data.result.lesson.status > 1){
            viewU.showErrorMsg('课程已结束');
            wx.navigateBack({
              });

            return;
          }
          //数量不为0
          if (res.data.result.count != 0) {
            var students = data.result.students;
            var showStudents = [];
            var boy = {};
            var girl = {};
            var warningSize = 0;
            var warningTx = '以下同学适当降低运动：';
            students.forEach(function(v, k) {
              if (v.studentnumber < 10) {
                v.no = '00' + v.studentnumber;
              } else if (v.studentnumber < 100) {
                v.no = '0' + v.studentnumber;
              } else {
                v.no = '' + v.studentnumber;
              }
              //男生代表
              if (v.delegate == 1) {
                boy = v;
              };
              //女生代表
              if (v.delegate == 2) {
                girl = v;
              }
              //其他学生
              if (v.delegate == 0) {
                showStudents.push(v);
              }
              if (v.alert_hr < v.bpm) {
                warningSize++;
                warningTx = warningTx + v.nickname + ',';
              }
            });
            //从没有报警到出现报警
            if (warningSize > 0 && pThis.data.warningSize == 0) {
              pThis.vibrate(0);
            }
            pThis.setData({
              'boy': boy,
              'girl': girl,
              'students': showStudents,
              'warningSize': warningSize,
              'warningTx': warningTx
            });
            //数量为0
          } else {
            viewU.showErrorMsg('这个班没有学生');
          }
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }
        pThis.refreshInfoAgain(2000);
      },
      fail: function(res) {
        viewU.showErrorMsg('网络错误');
        pThis.refreshInfoAgain(2000);
      }
    });
  },

  /**
   * 获取班级信息(压力测试版本)
   */
  getClassStudentListTest: function() {
    var pThis = this;
    var app = getApp();
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getClassStudentList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        classid: pThis.data.classId
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        // console.log('getClassStudentListTest');
      },
      fail: function(res) {
      }
    });
  },

  /**
   * 重新刷新
   */
  refreshInfoAgain: function(time) {
    if (this.data.pageShow) {
      var pThis = this;
      setTimeout(function() {
        pThis.getClassStudentList();
      }, time);
      // setTimeout(function() {
      //   for (var i = 0; i < 20; i++) {
      //     pThis.getClassStudentListTest();
      //   }
      // }, time);

    }
  },

  /**
   * 开始上课
   */
  startLesson: function(e) {
    var pThis = this;
    var app = getApp();
    if (this.data.myId != this.data.teacherId) {
      viewU.showErrorMsg('抱歉，没有权限');
      return;
    }

    wx.showLoading({
      title: '开始上课..',
    });
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/startClassLesson',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        var data = res.data;
        wx.hideLoading();
        //获取成功
        if (res.data.errorcode == 0) {
          pThis.setData({
            'status': 2
          });
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }

      },
      fail: function(res) {
        wx.hideLoading();
        viewU.showErrorMsg('网络错误');
      }
    });
  },

  /**
   * 结束上课
   */
  finishLesson: function(e) {
    if (this.data.myId != this.data.teacherId) {
      viewU.showErrorMsg('抱歉，没有权限');
      return;
    }
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/finishClassLesson',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId
      },
      success: function(res) {
        var data = res.data;
        //成功结束上课
        if (data.errorcode === 0) {
          wx.redirectTo({
            url: '/pages/report/lesson/lesson' +
              '?classid=' + pThis.data.classId +
              '&classname=' + pThis.data.className +
              '&lessonid=' + pThis.data.lessonId,
          });
        }
      }
    });
  },

  closeClass: function() {
    if (this.data.myId != this.data.teacherId) {
      viewU.showErrorMsg('抱歉，没有权限');
      return;
    }
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/closeClassLesson',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId
      },
      success: function(res) {
        var data = res.data;
        //成功关闭上课
        if (data.errorcode === 0) {
          wx.navigateBack({});
        }
      }
    });
  },

  /**
   * 进入班级平均页面
   */
  clickclassDetail: function() {
    wx.navigateTo({
      url: '/pages/lesson/clazzDetail/clazzDetail' +
        '?classid=' + this.data.classId +
        '&classname=' + this.data.className +
        '&lessonid=' + this.data.lessonId +
        '&teacherId=' + this.data.teacherId,
    })
  },

  /**
   * 点击男孩
   */
  clickBoy: function(e) {
    if (this.data.status == 1) {
      viewU.showErrorMsg('课程尚未开始');
      return;
    }
    this.changeToStuView(this.data.boy);
  },


  /**
   *  点击女孩
   */
  clickGirl: function(e) {
    if (this.data.status == 1) {
      viewU.showErrorMsg('课程尚未开始');
      return;
    }
    this.changeToStuView(this.data.girl);
  },

  /**
   * 点击任意学生
   */
  clickstudentsItem: function(e) {
    if (this.data.status == 1) {
      viewU.showErrorMsg('课程尚未开始');
      return;
    }
    this.changeToStuView(e.currentTarget.dataset.obj);
  },

  /**
   * 点击丢包数据
   */
  clickLostData: function(e) {
    wx.navigateTo({
      url: '/pages/lesson/testLostData/testLostData' +
        '?classid=' + this.data.classId +
        '&classname=' + this.data.className +
        '&lessonid=' + this.data.lessonId +
        '&teacherId=' + this.data.teacherId,
    })
  },

  /**
   * 切换页面
   */
  changeToStuView: function(stu) {
    var pThis = this;
    var app = getApp();

    if (this.data.myId == this.data.teacherId) {
      wx.request({
        url: app.globalData.host + '/fitness/V2/School/selectLessonStudent',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          lessonid: pThis.data.lessonId,
          studentnumber: stu.studentnumber
        },
        method: 'POST',
        dataType: 'json',
        success: function(res) {
          var data = res.data;
          if (data.errorcode === 0) {
            wx.navigateTo({
              url: '/pages/lesson/stuDetail/stuDetail' +
                '?studentnumber=' + stu.studentnumber +
                '&lessonId=' + pThis.data.lessonId +
                '&antSn=' + stu.antplus_serialno +
                '&name=' + stu.nickname,
            })
          } else {
            viewU.showErrorMsg(data.errormsg);
          }
        },
        fail: function(res) {
          viewU.showErrorMsg('网络错误');
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/lesson/stuDetail/stuDetail' +
          '?studentnumber=' + stu.studentnumber +
          '&lessonId=' + pThis.data.lessonId +
          '&antSn=' + stu.antplus_serialno +
          '&name=' + stu.nickname,
      })
    }
  },

  vibrate: function(virvateTimes) {
    var pThis = this;
    var times = virvateTimes + 1;

    //暂时去掉震动
    // wx.vibrateLong({
    //   success: function (e) {
    //     if (times < 10) {
    //       setTimeout(function () {
    //         pThis.vibrate(times);
    //       }, 500);
    //     }
    //   }
    // })
  }
})