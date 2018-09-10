//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    phone:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    this.getPhone()
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取客服电话
  getPhone: function () {
    app.getAppInfo('customer_service_phone').then((res) => {
      console.log('电话-----', res)
      this.setData({
        phone: res.data.value
      })
    })
  },
  //未登录跳转登录
  goLogin(){
    if (!app.globalData.loginUserInfo.telphone) {
      wx.navigateTo({
        url: '/pages/message/message',
      })
      return false
    }
    return true
  },
  //我的订单
  goMyOrder(){
    if (this.goLogin()){
      wx.navigateTo({
        url: '/pages/my/order/order'
      })
    }
  },
  //我的钱包
  goMyMoney(){
    if(this.goLogin()){
      wx.navigateTo({
        url: '/pages/my/wallet/wallet',
      })
    }
  },
  //故障反馈
  goFault(){
    if (this.goLogin()){
      wx.navigateTo({
        url: '/pages/fault/fault',
      })
    }
  }
})
