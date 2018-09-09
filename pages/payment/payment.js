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
    num:'',
    hourList:[2,3,4,5,6],
    value:0
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
    this.getTimes()
  },
  //获取时间可选项
  getTimes: function () {
    app.getAppAllInfo().then((res) => {
      console.log('所有的应用数据-----', res)
      app.globalData.hourly = (res.data[1].value) / 100
      this.setData({
        hourList: res.data[3].value.split(','),
        hourly: app.globalData.hourly
      })
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
      money: e.detail.value * app.globalData.hourly
    })
  },
  bindPickerChange: function (e) {
    const val = e.detail.value
    this.setData({
      time: this.data.hourList[val[0]],
      money: this.data.hourList[val[0]] * app.globalData.hourly
    })
  },
  //余额支付
  balancePlay:function(){
    var userInfo = app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')
    if (userInfo.money > this.data.money) {
      // wx.request({
      //   url: wx.envConfig.host + 'user/updateMoney',
      //   data: { money: +('-'+this.data.money*100) },
      //   method: 'POST',
      //   header: {
      //     ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
      //   },
      //   success: (res) => {
      //     console.log('余额支付请求--------', res)
      //     if (res.data.code == '100') {
      //       wx.redirectTo({
      //         url: '/pages/progress/progress?num=' + this.data.num + '&fee=-' + this.data.money*100
      //       })
      //     }
      //   }
      // })
      wx.redirectTo({
        url: '/pages/progress/progress?num=' + this.data.num + '&fee=-' + this.data.money * 100
      })
    } else {
      //余额不足，跳转余额充值页面
      wx.showModal({
        title:'提示',
        content:'您的余额不足，请前往充值',
        success:(res)=>{
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/recharge/recharge'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //微信支付
  rechargeHandler() {
    return new Promise((resolve, reject) => {
      app.ajaxSubmit({
        url: wx.envConfig.host + 'pay/wx/generatePayParams',
        method: 'post',
        header: {
          ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
        },
        data: {
          attach: 'type=4',
          openid: app.globalData.openid,
          // total_fee: this.data.selectMoney * 100 || 0,
          total_fee: 1,
          body: '余额充值',
          user_id: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo').id
        },
        isHideLoading: true
      }).then((res) => {
        if (res.data.code == '100001') {
          app.loginInOtherPlaceAlert(res, function () {
            if (jsons.repeatLogin) {
              jsons.repeatLogin();
            }
          });
          return;
        }
        else if (res.data.code !== 100) {
          wx.showToast({
            title: res.data.msg || '服务器异常',
            icon: 'none'
          })
          return
        }
        this.signWxPay(res.data.data)
        resolve(res)
      })
    })
  },
  signWxPay(data) {
    wx.requestPayment({ //调用支付弹框
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: (payRes) => { // 支付成功后
        // this.triggerEvent("paySuccess")
        console.log(payRes)
        if (payRes.errMsg === 'requestPayment:ok') {
          wx.redirectTo({
            url: '/pages/progress/progress?num=' + this.data.num + '&fee=-' + this.data.money*100
          })
        }
      },
      fail: (res) => { // 支付失败回调
        wx.showToast({
          title: '用户取消支付',
          icon: 'none'
        })
      }
    })
  },
})