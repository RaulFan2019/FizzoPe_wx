// components/btn-big/btn-big.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    confirmText: {
      type: String,
      value: '确认'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
    }
  }
})