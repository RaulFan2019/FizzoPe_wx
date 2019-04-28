/**
* 显示错误信息
*/
function showErrorMsg(msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    confirmColor: '#ff4612'
  });
  return;
}

module.exports = {
  showErrorMsg: showErrorMsg
}