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
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('获取微信登录状态---', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        }else{
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      }
    })
  },
  scan:function(){
    wx.scanCode({
      onlyFromCamera:false,   //可以从相册选择照片
      success:function(e){
        console.log(e)
      },
      fail:function(){
        
      },
      complete:function(){

      }
    })
  }
})
