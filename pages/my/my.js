//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: '',
    hasUserInfo: false,
    phone:''
  },
  onLoad: function () {
    
  },
  onShow:function(){
    this.getPhone()
  },
  getUserInfo: function (e) {
    app.getNewUserInfo(()=>{
      this.setData({
        userInfo: app.globalData.loginUserInfo,
        hasUserInfo: true
      })
    })
  },
  //获取客服电话
  getPhone: function () {
    app.getAppInfo('customer_service_phone').then((res) => {
      console.log('电话-----', res)
      this.getUserInfo()
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
  },
  //关于我们
  goAboutMe(){
    wx.navigateTo({
      url: '/pages/aboutme/index',
    })
  },
  //商户合作
  goJointWork(){
    wx.navigateTo({
      url: '/pages/jointwork/index',
    })
  },
  //新手指南
  goNovice(){
    wx.navigateTo({
      url: '/pages/novice/index',
    })
  },
  //单纯链接跳转
  goUrl(e) {
    wx.navigateTo({
      url: e.target.dataset.url,
    })
  },
})
