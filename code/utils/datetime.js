function diffTime(startDate, endDate) {
  var diff = endDate.getTime() - startDate.getTime();//时间差的毫秒数  

  //计算出相差天数  
  var days = Math.floor(diff / (24 * 3600 * 1000));

  //计算出小时数  
  var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);

  var returnStr = seconds + "秒";
  if (minutes > 0) {
    returnStr = minutes + "分" + returnStr;
  }
  if (hours > 0) {
    returnStr = hours + "小时" + returnStr;
  }
  if (days > 0) {
    returnStr = days + "天" + returnStr;
  }
  return returnStr;
}

/**
 * 计算相差的分钟数
 */
function diffTimeForMin(startDate, endDate) {
  var diff = endDate.getTime() - startDate.getTime();//时间差的毫秒数  
  var returnStr = Math.floor(diff / (60 * 1000));
  return returnStr;
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
} 

//数据转化  
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
} 

module.exports = {
  diffTime: diffTime,
  diffTimeForMin: diffTimeForMin,
  formatTime: formatTime
}