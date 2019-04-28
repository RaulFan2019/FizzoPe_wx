// pages/lesson/stuDetail/stuDetail.js
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
    userDefault: {
      nickname: '--',
      avatar: '/assets/img/ic_default_avatar.png',
    },
    //图表
    ec: {
      onInit: initChart
    },
    antSn: null, //ant 编号
    lessonId: 0, //课程ID
    studentnumber: null,
    //个人特征
    id: 0,
    no: '',
    nickName: '',
    avatar: null,
    bmi: 0,
    //心率数据
    restHr: 0, //静息心率
    currHr: 0, //实时心率
    maxHr: 0, //最高心率
    avgHr: 0, //平均心率
    target_hr: 0, //目标心率
    target_hr_high: 0, //目标偏高心率
    power: 0, //锻炼强度
    density: 0, //密度

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.name,
    });
    this.setData({
      'lessonId': options.lessonId,
      'antSn': options.antSn,
      'studentnumber': options.studentnumber
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
    pThis.refreshInfoAgain(500);
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.refreshInfoAgain(500);
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
   * 延迟获取数据
   */
  refreshInfoAgain: function(time) {
    var pThis = this;
    setTimeout(function() {
      pThis.getHeartrates();
    }, time);
    //测试
    // setTimeout(function() {
    //   for (var i = 0; i < 20; i++) {
    //     pThis.getHeartratesTest();
    //   }
    // }, time);
  },

  /**
   * 获取该学生的心率列表
   */
  getHeartrates: function() {
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getStudentLessonHistoryHeartratesByInterval',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      data: {
        lessonid: pThis.data.lessonId,
        studentnumber: pThis.data.studentnumber,
        interval: 60
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        var data = res.data;
        // console.log(data);
        if (data.errorcode === 0) {
          var no = '';
          if (data.result.studentnumber < 10) {
            no = '00' + data.result.studentnumber;
          } else if (data.studentnumber < 100) {
            no = '0' + data.result.studentnumber;
          } else {
            no = '' + data.result.studentnumber;
          }
          pThis.setData({
            'nickName': data.result.nickname,
            'avatar': data.result.avatar,
            'no': no,
            'bmi': data.result.bmi,
            'currHr': data.result.cur_bpm,
            'target_hr': data.result.target_hr,
            'target_hr_high': data.result.target_hr_high,
            'maxHr': data.result.max_bpm,
            'avgHr': data.result.avg_bpm,
            'restHr': data.result.rest_hr,
            'power': data.result.resthr_intensity,
            'density': data.result.density,
            'id': data.result.id
          });
          pThis.setBpmsData(data.result.bpms);
        }
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: function(res) {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },

  /**
   * 获取该学生的心率列表(用于压力测试)
   */
  getHeartratesTest: function() {
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getStudentLessonHistoryHeartratesByInterval',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      data: {
        lessonid: pThis.data.lessonId,
        studentnumber: pThis.data.studentnumber,
        interval: 60
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        console.log('getHeartratesTest');

      },
      fail: function(res) {}
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
      // baseData.push(1);
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

  /**
   * 点击计时器
   */
  onTimerBtnClick: function() {
    var no = this.data.no;
    var nickName = this.data.nickName;
    var avatar = this.data.avatar;
    var lessonId = this.data.lessonId;
    var id = this.data.id;

    wx.navigateTo({
      url: '/pages/lesson/stuTimer/stuTimer' +
        '?no=' + no +
        '&nickName=' + nickName +
        '&avatar=' + avatar +
        '&lessonId=' + lessonId +
        '&id=' + id,
    })
  }

})