//获取应用实例
const app = getApp()
Page({
  data: {
    balance:'0',       //余额
    deposit:false,      //是否缴纳押金
    disabled:true       //提现开启
  },
  onLoad: function () {
    
  },
  onShow:function(){
    this.updata()
  },
  //更新数据
  updata:function(){
    app.getNewUserInfo(() => {
      if (app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')) {
        var info = app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')
        this.setData({
          balance: info.money,
          deposit: info.deposit,
          disabled: info.deposit
        })
        wx.stopPullDownRefresh()
      } else {
        app.getLoginUserInfo = (res) => {
          this.setData({
            balance: res.money,
            deposit: res.deposit,
            disabled: res.deposit
          })
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  onPullDownRefresh:function(){
    this.updata()
  }
  
})
