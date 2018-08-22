//获取应用实例
const app = getApp()
Page({
  data: {
    balance:'80.5',       //余额
    deposit:false,      //是否缴纳押金
    disabled:true       //提现开启
  },
  onLoad: function () {
    if (app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')){
      var info = app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')
      this.setData({
        balance: info.money,
        deposit: info.deposit,
        disabled: info.deposit
      })
    }else{
      app.getLoginUserInfo = (res) =>{
        this.setData({
          balance: res.money,
          deposit: res.deposit,
          disabled: res.deposit
        })
      }
    }
  },
  
})
