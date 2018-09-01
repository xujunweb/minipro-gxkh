//logs.js
const util = require('../../utils/util.js')
const app = getApp()
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
    if (!app.globalData.loginUserInfo.phone){
      wx.navigateTo({
        url: '/pages/message/message',
      })
      return
    }
    wx.scanCode({
      onlyFromCamera:false,   //可以从相册选择照片
      success:(e)=>{
        console.log(e)
        wx.navigateTo({
          url: '/pages/payment/payment?num='+e
        })
      },
      fail:()=>{
        
      },
      complete:()=>{

      }
    })
  }
})
