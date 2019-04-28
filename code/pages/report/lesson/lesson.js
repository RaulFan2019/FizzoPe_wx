// pages/report/lesson/lesson.js
var viewU = require('../../../utils/viewU.js');

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
    classId: 1, //班级ID
    className: '', //班级名称
    lessonId: 0, //课程ID
    //图表
    ec: {
      onInit: initChart
    },
    avg_bpm: 0, //平均心率
    alertTimes: 0, //报警次数
    density: 0, //密度
    resthrIntensity: 0, //平均强度

    target_hr: 0, //目标心率
    target_hr_high: 0, //目标偏高心率
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.classname + ' 报告',
    });
    this.setData({
      'classId': options.classid,
      'className': options.classname,
      'lessonId': options.lessonid
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
    var pThis = this;
    setTimeout(function() {
      pThis.getLessonReport();
    }, 500);
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
    this.getLessonReport();
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
   * 获取班级体育课报告
   */
  getLessonReport: function() {
    var pThis = this;
    var app = getApp();


    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getLessonSummaryHistoryHeartratesByInterval',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        lessonid: pThis.data.lessonId,
        interval: 60
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        var data = res.data;
        //获取成功
        if (res.data.errorcode == 0) {
          pThis.setData({
            'avg_bpm': data.result.avg_bpm, //平均心率
            'alertTimes': data.result.alert_times, //报警次数
            'density': data.result.density, //密度
            'resthrIntensity': data.result.resthr_intensity, //平均强度
            'target_hr': data.result.target_hr,
            'target_hr_high': data.result.target_hr_high,
          });
          pThis.setBpmsData(data.result.bpms);
        } else {
          viewU.showErrorMsg(res.data.errormsg);
        }
      },
      fail: function(res) {
        viewU.showErrorMsg('网络错误');
      }
    });
  },

  /**
   * 导入心率数据
   */
  setBpmsData: function(bpms) {
    var baseData = [];
    var xBaseData = [];
    var bpmData = [];
    var target = this.data.target_hr;
    var target_high = this.data.target_hr_high;


    for (var i = 0; i < 49; i++) {
      xBaseData.push(i);
    }

    for (var i = 0; i < bpms.length; i++) {
      bpmData.push(bpms[i].bpm);
    }

    chart.setOption({
      // backgroundColor: "#fff",//背景色
      legend: {
        show: false, //不显示图标
      },
      //范围颜色
      visualMap: {
        top: 30,
        right: 30,
        show: true,
        orient: 'horizontal',
        pieces: [{
            gt: 0,
            lte: target,
            color: '#A0A7BF',
            label: '热身区'
          },
          {
            gt: target,
            lte: target_high,
            color: '#4A6BE3',
            label: '运动区'
          },
          {
            gt: target_high,
            lte: 999,
            color: '#E94242',
            label: '报警区'
          }
        ],
        outOfRange: {
          color: '#E94242',
          label: '报警区'
        }
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
      series: [{
        name: '心率线',
        type: 'line',
        smooth: true,
        symbol: 'none', //轴线上的标记
        data: bpmData,
        markPoint: {
          symbolSize: 40,
          itemStyle: {
            color: '#ff4613',
          },
          data: [{
              type: 'max',
              name: '最大心率',
            },
            {
              type: 'min',
              name: '最小心率',
            }
          ]
        }
      }]
    })
  },
})