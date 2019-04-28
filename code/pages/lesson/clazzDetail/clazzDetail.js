// pages/lesson/clazzDetail/clazzDetail.js
import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();
let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: '',//班级名称
    lessonId: 0,//课程ID
    classId: 0, //班级ID
    //图表
    ec: {
      onInit: initChart
    },
    userDefault: {
      nickname: '--',
      avatar: '/assets/img/ic_default_avatar.png',
    },
    clazzData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'classId': options.classid,
      'className': options.classname,
      'lessonId': options.lessonid,
      'teacherId': options.teacherId,
      'myId': app.globalData.fizzoUserInfo.userid
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
    if (this.data.myId == this.data.teacherId) {
      this.showAvgView();
    }
    this.refreshInfoAgain(500);
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
    this.refreshInfoAgain(500);
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
   *  通知页面显示班级平均页面
   */
  showAvgView: function(){
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/selectLessonStudent',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId,
        studentnumber: -1
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        if (data.errorcode === 0) {
        } else {
          setTimeout(function () {
            pThis.showAvgView();
          }, 1000);
        }
      }, fail: function (res) {
        setTimeout(function () {
          pThis.showAvgView();
        }, 1000);
      }
    });
  },

  /**
   * 获取上课数据
   */
  getLessonData: function () {
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getLessonDelegatesHistoryHeartratesByInterval',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId,
        fromoffset: 0,
        interval:60
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        var data = res.data;
        if (data.errorcode === 0) {
          pThis.setData({
            'clazzData': data.result
          });
          pThis.setBpmsData(data.result.boy.bpms, data.result.girl.bpms);
          // pThis.setChartData();
        }
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }, fail: function (res) {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },

  /**
   * 获取上课数据(测试)
   */
  getLessonDataTest: function () {
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getLessonDelegatesHistoryHeartratesByInterval',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId,
        fromoffset: 0,
        interval: 60
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log('getLessonDataTest');
      }, fail: function (res) {
      }
    });
  },

  /**
 * 导入心率数据
 */
  setBpmsData: function (boyBpms,girlBpms) {
    var xBaseData = [];
    var boyBpmData = [];
    var girlBpmData = [];
    var boyBpmEData = [];
    var girlBpmEData = [];
    var target = this.data.target_hr;
    var target_high = this.data.target_hr_high;

    for (var i = 0; i < 49; i++) {
      xBaseData.push(i);
    }

    for (var i = 0; i < boyBpms.length; i++) {
      boyBpmData.push(boyBpms[i].bpm);
      if (boyBpms[i].exercising == 0){
        boyBpmEData.push(0);
      }else{
        boyBpmEData.push(boyBpms[i].bpm);
      }
    }

    for (var i = 0; i < girlBpms.length; i++) {
      girlBpmData.push(girlBpms[i].bpm);
      if (girlBpms[i].exercising == 0) {
        girlBpmEData.push(0);
      } else {
        girlBpmEData.push(girlBpms[i].bpm);
      }
    }

    var option = {
      // backgroundColor: "#eee",//背景色
      color: ['#12afff', '#ff44d8', '#12afff', '#ff44d8'],
      legend: {
        right: 10,
        top: 10,
        orient: 'vertical',
        show: true,//不显示图标
        data: ['男生心率', '女生心率']
      },
      //设置Y轴
      yAxis: {
        min: 60,
        max: 220,
        interval: 40,
        type: 'value',
        axisLabel: {
          interval: 4,
          fontSize: 10,
          color: '#999999',
        },
        axisLine: {
          lineStyle: {
            color: '#ffffff'
          }
        }
      },
      //横坐标数据显示方式
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        },
        axisLabel: {
          interval: 4,
          fontSize: 10,
          color: '#999999',
        },
        axisLine: {
          lineStyle: {
            color: '#999999',
          }
        },
        axisTick: {
          show: false
        },
        data: xBaseData
      },
      //数据
      series: [
        {
          name: '1号代表平均心率',
          type: 'line',
          smooth: true,
          symbol: 'none',//轴线上的标记
          data: boyBpmData,
        },
        {
          name: '2号代表平均心率',
          type: 'line',
          smooth: true,
          symbol: 'none',//轴线上的标记
          data: girlBpmData,
        },
        {
          name: '男生运动',
          type: 'line',
          smooth: true,
          symbol: 'none',//轴线上的标记
          data: boyBpmEData,
          areaStyle: {}
        },
        {
          name: '女生运动',
          type: 'line',
          smooth: true,
          symbol: 'none',//轴线上的标记
          data: girlBpmEData,
          areaStyle: {}
        }
      ]
    };
    chart.setOption(option);
  },

  /**
  * 延迟刷新
  */
  refreshInfoAgain: function (time) {
    var pThis = this;
    setTimeout(function () {
      pThis.getLessonData();
    }, time);
    // setTimeout(function () {
    //   for(var i = 0; i < 20 ; i ++){
    //     pThis.getLessonDataTest();
    //   }
    // }, time);
    
  }
})