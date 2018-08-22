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
      success:(e)=>{
        console.log(e)
        var userInfo = app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')
        if (userInfo.deposit>0 && userInfo.money>0){
          this.unlock(123456)
        } else if (!userInfo.deposit){
          wx.navigateTo({
            url: '/pages/my/deposit/deposit'
          })
        }else{
          wx.navigateTo({
            url: '/pages/my/recharge/recharge'
          })
        }
        
      },
      fail:()=>{
        
      },
      complete:()=>{

      }
    })
  },
  //解锁请求
  unlock: function (lock){
    console.log(app.globalData.loginUserInfo, wx.getStorageSync('loginUserInfo'))
    wx.request({
      url: wx.envConfig.host + 'lockOrder/unLock',
      data: { lock_no: lock},
      method: 'POST',
      header:{
        ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
      },
      success: (res) => {
        console.log('解锁请求--------', res)
        if (res.data.data){

        }
      }
    })
  }
})
