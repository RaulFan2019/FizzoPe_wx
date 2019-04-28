// pages/lesson/prepareStu/prepareStu.js
var viewU = require('../../../utils/viewU.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    search:'',//搜索字段
    selectGender: 1,//选择性别
    classId: '',//班级ID
    students: [],//学生列表
    showList: [],//显示的列表
    selectedStu:null,//已经选择的学生
    userDefault: {
      nickname: '--',
      avatar: '/assets/img/ic_default_avatar.png',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //改变标题
    if (options.gender == 1) {
      wx.setNavigationBarTitle({
        title: '选择1号代表',
      });
    } else {
      wx.setNavigationBarTitle({
        title: '选择2号代表',
      });
    };

    var selectedStu;
    //获取已选择的学生
    if(options.gender == 1){
      selectedStu = wx.getStorageSync('boy');
    }else{
      selectedStu = wx.getStorageSync('girl');
    }

    this.setData({
      'selectGender': options.gender,
      'classId': options.classid,
      'selectedStu' : selectedStu
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '数据加载中',
    });
    this.getStudentList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
   * 获取学生列表
   */
  getStudentList: function () {
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
      success: function (res) {
        var data = res.data;
        wx.hideLoading();
        //获取成功
        if (res.data.errorcode == 0) {
          //数量不为0
          if (res.data.result.count != 0) {
            var students = data.result.students;
            students.forEach(function (v, k) {
              if (v.studentnumber < 10) {
                v.no = '00' + v.studentnumber;
              } else if (v.studentnumber < 100){
                v.no = '0' + v.studentnumber;
              }else{
                v.no = '' + v.studentnumber;
              }
            });

            pThis.setData({
              'students': students
            })
            pThis.searchStudents();
            //数量为0
          } else {
            viewU.showErrorMsg('这个班没有学生');
            wx.navigateBack({});
          }
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }

      },
      fail: function (res) {
        wx.hideLoading();
        viewU.showErrorMsg('网络错误');
      }
    });
  },

  /**
   * 点击单个学生
   */
  clickstudentsItem: function (e) {
    this.setData({
      'selectedStu': e.currentTarget.dataset.obj
    });
    //选择的是男生
    if (this.data.selectGender == 1) {
      wx.setStorageSync("boy", e.currentTarget.dataset.obj);
    } else {
      wx.setStorageSync("girl", e.currentTarget.dataset.obj);
    }

    this.checkSelected(this.data.showList);
    
  },

  /**
   * 搜索框发生变化
   */
  searchInput:function(e){
    var inputValue = e.detail.value;
    this.setData({
      'search': inputValue
    });
    this.searchStudents();
  },

  /**
   * 根据条件筛选需要显示的学生列表
   */
  searchStudents: function(){
    var students = this.data.students;
    var pThis = this;
    var showStudents = [];
    
    //筛选性别
    for (var i = 0; i < students.length; i++) {
      if (
        // students[i].gender == pThis.data.selectGender&& 
        (students[i].no.indexOf(this.data.search) != -1
        || students[i].nickname.indexOf(this.data.search) != -1)){
        showStudents.push(students[i]);
      }
    }
    pThis.setData({
      'showList': showStudents
    });
    this.checkSelected(this.data.showList);
  },


  /**
   * 检查是否被选择
   */
  checkSelected: function (showList){
    if (this.data.selectedStu != null){
      var selectId = this.data.selectedStu.id;
      showList.forEach(function (v, k) {
        if (selectId == v.id) {
          v.selected = true;
        } else {
          v.selected = false;
        }
      });
    }
    this.setData({
      'showList': showList
    });
  },

  /**
 * 点击完成按钮
 */
  onFinishBtnClick: function () {
    if (this.data.selectedStu == null) {
      viewU.showErrorMsg('未选择学生');
    } else {
      wx.navigateBack({});
    }
  }

})