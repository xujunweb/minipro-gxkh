//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.envConfig = this.globalData.env[this.globalData.env.mode];
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('wx.login---------',res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
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
  globalData: {
    userInfo: {
      'id': 206,
      'userName': '13113864577',
      'password': 'fanjunlin123',
      'token': 'abcdefghijklmn123456'
    },
    code: '',
    openid: '',
    env: {
      mode: 'dev',
      dev: {
        host: 'http://47.107.54.207:8080',
      },
      production: {
        host: 'https://app.1sju.com/yishuju-app',
      }
    }
  }
})