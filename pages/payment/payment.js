// pages/payment/payment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weixin:true,
    yue:false,
    money:0,
    time:'',
    hourly:'',
    num:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options){
      this.data.num = options.num
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      hourly: app.globalData.hourly
    })
  },
  //选择支付方式
  seletPlay:function(e){
    var type = e.target.dataset.type
    if (type == '1'){
      this.setData({
        weixin:true
      })
    }else{
      this.setData({
        weixin: false
      })
    }
  },
  //输入时间
  inputTime: function (e) {
    this.setData({
      time: e.detail.value,
      money: e.detail.value*5
    })
  },
  //余额支付
  balancePlay:function(){
    var userInfo = app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')
    if (userInfo.money > this.data.money) {
      wx.request({
        url: wx.envConfig.host + 'play/play',
        data: { money: this.data.money },
        method: 'POST',
        header: {
          ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
        },
        success: (res) => {
          console.log('余额支付请求--------', res)
          if (res.data.data) {
            wx.redirectTo({
              url: '/pages/progress/progress?num=' + this.data.num
            })
          }
        }
      })
    } else {
      //余额不足，跳转余额充值页面
      wx.navigateTo({
        url: '/pages/my/recharge/recharge'
      })
    }
  },
  //微信支付
  weixinPlay:function(){

  }
})