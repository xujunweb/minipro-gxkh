//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    defaultSize:'',
    loading:'',
    plain:false,
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  scan:function(){
    wx.scanCode({
      onlyFromCamera:false,   //可以从相册选择照片
      success:function(){
        
      },
      fail:function(){
        
      },
      complete:function(){

      }
    })
  }
})
