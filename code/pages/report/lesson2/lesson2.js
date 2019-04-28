import * as echarts from '../../../ec-canvas/echarts';

var viewU = require('../../../utils/viewU.js');
let chartPower = null;
let chartHr = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId: 1, //班级ID
    lessonId: 1, //课程ID
    students: [], //学生列表
    lessonInfo: {}, //课程统计信息
    stuInfo: {}, //选中的学生信息
    tabnum: 5, //TAB 显示数
    showtab: -1, //顶部选项卡索引
    ecPower: {
      onInit: function (canvas, width, height) {
        chartPower = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chartPower);
        return chartPower;
      }
    },
    ecHr: {
      onInit: function (canvas, width, height) {
        chartHr = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chartHr);
        return chartHr;
      }
    },
    lessonHrLowPercent: 0, //课程低强度百分比
    lessonHrTargetPercent: 0, //课程中强度百分比
    lessonHrHighPercent: 0, //课程高强度百分比
    stuHrLowPercent: 0, //学生低强度百分比
    stuHrtargetPercent: 0, //学生中强度百分比
    stuHrHighPercent: 0, //学生高强度百分比
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
    this.getLessonInfo();
  },
  onShow:function(){
    if(this.data.showtab != -1){
      this.getStuInfo();
    }
  },

  /**
   * 获取课程信息
   */
  getLessonInfo: function() {
    var pThis = this;
    var app = getApp();
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getLessonAvgHistoryHeartratesByInterval',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'lessonid': pThis.data.lessonId,
        'interval': 60,
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        // console.log('getLessonInfo:' + res.data.errorcode);
        //获取成功
        if (res.data.errorcode == 0) {
          var lessonHrCount = 0;
          var lessonHrHighCount = 0;
          var lessonHrLowCount = 0;
          var lessonHrLowPercent = 0;
          var lessonHrHighPercent = 0;
          var lessonHrTargetPercent = 0;
          for (var i = 0; i < res.data.result.bpm_counts.length; i++) {
            if (res.data.result.bpm_counts[i].bpm < 120) {
              lessonHrLowCount += res.data.result.bpm_counts[i].count;
            }
            if (res.data.result.bpm_counts[i].bpm > 150) {
              lessonHrHighCount += res.data.result.bpm_counts[i].count;
            }
            lessonHrCount += res.data.result.bpm_counts[i].count;
          }
          if (lessonHrCount != 0) {
            lessonHrLowPercent = parseInt(lessonHrLowCount * 100 / lessonHrCount);
            lessonHrHighPercent = parseInt(lessonHrHighCount * 100 / lessonHrCount);
            lessonHrTargetPercent = 100 - lessonHrLowPercent - lessonHrHighPercent;
          }
          pThis.setData({
            'lessonInfo': res.data.result,
            'lessonHrLowPercent': lessonHrLowPercent,
            'lessonHrHighPercent': lessonHrHighPercent,
            'lessonHrTargetPercent': lessonHrTargetPercent
          });
          pThis.getClassStudentList();
        } else {
          if (res.data.errorcode == 301){
              setTimeout(function () {
                pThis.getLessonInfo();
              }, 2000);
          }else{
            viewU.showErrorMsg(res.data.errormsg);
          }
        }
      },
      fail: function(res) {
        console.log(JSON.stringify(res));
        viewU.showErrorMsg('网络错误');
      }
    });
  },

  /**
 * 获取课程信息
 */
  getLessonInfoTest: function () {
    var pThis = this;
    var app = getApp();
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getLessonAvgHistoryHeartratesByInterval',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'lessonid': pThis.data.lessonId,
        'interval': 60,
      },
      method: 'POST',
      dateType: 'json',
      success: function (res) {
        console.log('getLessonInfoTest');
      },
      fail: function (res) {
        viewU.showErrorMsg('网络错误');
      }
    });
  },


  /**
   * 获取学生列表
   */
  getClassStudentList: function() {
    var pThis = this;
    var app = getApp();
    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getClassStudentList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'classid': pThis.data.classId
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        var data = res.data;
        //获取成功
        if (res.data.errorcode == 0) {
          pThis.setData({
            'students': data.result.students, //平均心率
            'showtab': 0
          });
          pThis.getStuInfo();
          //测试
          // for (var i = 0; i < 20; i++) {
          //   this.getLessonInfoTest();
          // }
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
   * 获取学生课程信息
   */
  getStuInfo: function() {
    var pThis = this;
    var app = getApp();

    wx.request({
      url: app.globalData.host + '/fitness/V2/School/getStudentLessonHistoryHeartratesByInterval',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'lessonid': pThis.data.lessonId,
        'studentnumber': pThis.data.students[pThis.data.showtab].studentnumber,
        'interval': 60,
      },
      method: 'POST',
      dateType: 'json',
      success: function(res) {
        var data = res.data;
        //获取成功
        if (res.data.errorcode == 0) {
          var stuHrCount = 0;
          var stuHrHighCount = 0;
          var stuHrLowCount = 0;
          for (var i = 0; i < data.result.bpm_counts.length; i++) {
            if (data.result.bpm_counts[i].bpm < 120) {
              stuHrLowCount += data.result.bpm_counts[i].count;
            }
            if (data.result.bpm_counts[i].bpm > 150) {
              stuHrHighCount += data.result.bpm_counts[i].count;
            }
            stuHrCount += data.result.bpm_counts[i].count;
          }
          var stuHrLowPercent = parseInt(stuHrLowCount * 100 / stuHrCount);
          var stuHrHighPercent = parseInt(stuHrHighCount * 100 / stuHrCount);
          var stuHrtargetPercent = 100 - stuHrHighPercent - stuHrLowPercent;
          pThis.setData({
            'stuInfo': res.data.result, //学生信息
            'stuHrLowPercent': stuHrLowPercent,
            'stuHrHighPercent': stuHrHighPercent,
            'stuHrtargetPercent': stuHrtargetPercent
          });
          pThis.setPowerChartData();
          pThis.setHrChartData();
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
   * 点击全部
   */
  clickAll:function(){
    wx.navigateTo({
      url: '/pages/report/selectStu/selectstu'
        + '?classId=' + this.data.classId
        + '&selectIndex=' + this.data.showtab 
    });
  },

  /**
   * 设置tab
   */
  setTab: function(e) {
    const edata = e.currentTarget.dataset;
    this.setData({
      showtab: edata.tabindex,
    });
    this.getStuInfo();
  },

  /**
   * 插入强度对比数据
   */
  setPowerChartData: function() {
    var option = {
      color: ['#ff4612', '#ffbd14'],
      tooltip: {
        trigger: 'axis',
        show:false,
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: false
      },
      calculable: true,
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 30,
        containLabel: true
      },
      yAxis: [{
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          fontSize: 10,
          color: '#e0e0e0',
        },
        splitLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
          show: true
        },
        axisLine: {
          show: false
        },
      }],
      xAxis: [{
        type: 'category',
        axisTick: {
          show: false
        },
        data: ['低强度\n(心率值<120)', '中强度\n(120≤心率值<150)', '高强度\n(心率值≥150)'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          interval: 0,
          color: '#666'
        }
      }],
      series: [{
          name: '班级',
          type: 'bar',
          barGap: 0,
          barWidth: '30%',
          label: {
            normal: {
              show: true,
              position: 'inside',
              rotate:270,
              formatter: '{c}%'
            }
          },
          data: [this.data.lessonHrLowPercent, this.data.lessonHrTargetPercent, this.data.lessonHrHighPercent],
        },
        {
          name: '个人',
          type: 'bar',
          barGap: 0,
          barWidth: '30%',
          label: {
            normal: {
              show: true,
              position: 'inside',
              rotate: 270,
              formatter: '{c}%'
            }
          },
          data: [this.data.stuHrLowPercent, this.data.stuHrtargetPercent, this.data.stuHrHighPercent],
        }
      ]
    };
    chartPower.setOption(option);
  },

  /**
   * 设置心率图表数据
   */
  setHrChartData: function() {
    var baseData = [];
    var xBaseData = [];
    var bpmData = [];
    var bpmStuData = [];

    for (var i = 0; i < 49; i++) {
      xBaseData.push(i);
    }

    for (var i = 0; i < this.data.lessonInfo.bpms.length; i++) {
      bpmData.push(this.data.lessonInfo.bpms[i].bpm);
    }

    for (var i = 0; i < this.data.stuInfo.bpms.length; i++) {
      bpmStuData.push(this.data.stuInfo.bpms[i].bpm);
    }


    chartHr.setOption({
      legend: {
        show: false, //不显示图标
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
          itemStyle: {
            normal: {
              color: 'rgb(255, 70, 18)'
            }
          },
          markLine: {
            silent: true,
            label: {
              show: true,
              formatter: '{b}'
            },
            data: [{
              yAxis: 200,
              name: '',
              lineStyle: {
                color: '#ff4612',
                width: 1
              },
            }]
          }
        },
        {
          name: '个人心率',
          type: 'line',
          smooth: true,
          symbol: 'none', //轴线上的标记
          data: bpmStuData,
          itemStyle: {
            normal: {
              color: 'rgb(255, 189, 20)'
            }
          }
        }

      ]
    })

  }

})