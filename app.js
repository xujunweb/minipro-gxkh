//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.envConfig = this.globalData.env[this.globalData.env.mode];
    //注释1
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('wx.login---------',res)
        this.getOpenIdUserInfo({ code: res.code})
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('获取微信登录状态---', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('微信用户信息---',res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //获取openid
  getOpenIdUserInfo:function(data,callback){
    wx.showLoading({
      title:'加载中...',
      mask:true
    })
    wx.request({
      url: wx.envConfig.host + 'pay/wx/getWeixinUserInfo',
      data:data,
      method:'POST',
      success:(res)=>{
        console.log('后台获取的用户信息--------',res)
        this.globalData.loginUserInfo = res.data.data
        this.globalData.openid = res.data.data.openid
        wx.setStorageSync('loginUserInfo', res.data.data)
        if (this.getLoginUserInfo){
          this.getLoginUserInfo(res.data.data)
        }
        callback && callback(res)
      },
      fail:function(){
        wx.showToast({
          title:'登陆失败',
          icon:'none'
        })
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  //获取openid
  getNewUserInfo: function (callback) {
    wx.request({
      url: wx.envConfig.host + 'user/getUserInfo',
      data: {},
      header:{
        ticket: this.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
      },
      method: 'POST',
      success: (res) => {
        console.log('后台最新的用户信息--------', res)
        this.globalData.loginUserInfo = res.data.data
        wx.setStorageSync('loginUserInfo', res.data.data)
        callback && callback(res)
      }
    })
  },
  //公共数据
  globalData: {
    userInfo: null,
    loginUserInfo:null,
    code: '',
    openid: '',
    env: {
      mode: 'dev',
      dev: {
        // host: 'https://47.107.54.207:8080/mobile/',
        host: 'https://www.chmbkh.com/mobile/'
      },
      production: {
        host: 'https://www.chmbkh.com/mobile/',
      }
    }
  }
})