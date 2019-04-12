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
    value:0,
    playing:false,    //支付中
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
      //不使用全局的价格了
      // app.globalData.hourly = (res.data[1].value) / 100
      this.setData({
        hourList: res.data[3].value.split(','),
        hourly: app.globalData.hourly
      })
    })
  },
  //选择支付方式
  seletPlay:function(e){
    var type = e.currentTarget.dataset.type
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
    //每24个小时封顶(单价x10)元
    var value = e.detail.value
    var maxPri = app.globalData.hourly * 10
    var day = Math.floor(value / 24)
    var rem = value % 24
    var product = (rem * app.globalData.hourly) > maxPri ? maxPri : rem * app.globalData.hourly
    var money = day * maxPri + product
    this.setData({
      time: e.detail.value,
      money: money
    })
  },
  bindPickerChange: function (e) {
    //每24个小时封顶30元
    var val = e.detail.value
    var value = this.data.hourList[val]
    var maxPri = app.globalData.hourly * 10
    var day = Math.floor(value / 24)
    var rem = value % 24
    var product = (rem * app.globalData.hourly) > maxPri ? maxPri : rem * app.globalData.hourly
    var money = day * maxPri + product
    this.setData({
      time: this.data.hourList[val],
      money: money
    })
  },
  //余额支付
  balancePlay:function(){
    var userInfo = app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')
    if (!this.data.money) {
      wx.showToast({
        title: '请选择租借时间',
        icon: 'none'
      })
      return
    }
    if (this.data.playing) return
    this.data.playing = true
    if ((userInfo.money/100) > this.data.money) {
      this.data.playing = false
      wx.redirectTo({
        url: '/pages/progress/progress?num=' + this.data.num + '&fee=-' + this.data.money * 100+'&hours='+this.data.time
      })
    } else {
      this.data.playing = false
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
    var userInfo = app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')
    if (!this.data.money){
      wx.showToast({
        title:'请选择租借时间',
        icon:'none'
      })
      return
    } else if (userInfo.money < 0){
      //余额不足，跳转余额充值页面
      wx.showModal({
        title: '提示',
        content: '您有订单尚未结算完成，请前往充值',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/recharge/recharge'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if (this.data.playing) return
    this.data.playing = true
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
          total_fee: this.data.money * 100 || 0,
          // total_fee: 1,
          body: '余额充值',
          user_id: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo').id
        },
        isHideLoading: true
      }).then((res) => {
        this.data.playing = false
        if (res.data.code == '100001') {
          return;
        }else if (res.data.code !== 100) {
          wx.showToast({
            title: res.data.msg || '服务器异常',
            icon: 'none'
          })
          return
        }
        this.signWxPay(res.data.data)
        resolve(res)
      }).catch(()=>{
        this.data.playing = false
      })
    })
  },
  signWxPay(data) {
    if (this.data.playing) return
    this.data.playing = true
    wx.requestPayment({ //调用支付弹框
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: (payRes) => { // 支付成功后
        // this.triggerEvent("paySuccess")
        this.data.playing = false
        console.log(payRes)
        if (payRes.errMsg === 'requestPayment:ok') {
          wx.redirectTo({
            url: '/pages/progress/progress?num=' + this.data.num + '&fee=-' + this.data.money * 100 + '&hours=' + this.data.time + '&outno=' + data.out_trade_no
          })
        }
      },
      fail: (res) => { // 支付失败回调
        this.data.playing = false
        wx.showToast({
          title: '用户取消支付',
          icon: 'none'
        })
      }
    })
  },
})