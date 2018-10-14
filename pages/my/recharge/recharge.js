// pages/my/recharge/recharge.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    moneyList:[
      {
        money: 5,
        select: true
      },
      {
        money: 15,
        select: false
      },
      {
        money: 30,
        select: false
      },
      {
        money: 50,
        select: false
      },
      {
        money: 100,
        select: false
      },
      {
        money: '',
        select: false,
        other:true
      },
    ],
    selectMoney:5,
    selectIndex:0,  //选中的索引
    showLayer:false,
    isLogin: false, //登录按钮是否可点击
    inputMoney:0, //输入的金额
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  //选择金额
  select:function(e){
    var index = e.currentTarget.dataset.index
    for (var i = 0, len = this.data.moneyList.length;i<len;i++){
      this.data.moneyList[i].select = false
    }
    this.data.moneyList[index].select = true
    this.data.selectIndex = index
    this.data.selectMoney = this.data.moneyList[index].money
    this.setData({
      moneyList: this.data.moneyList
    })
    if (this.data.moneyList[index].other == true){
      this.setData({
        showLayer: true,
        inputMoney: this.data.moneyList[index].money,
        isLogin: this.data.moneyList[index].money > 0
      })
    }
  },
  /**
   * 余额输入监听
   */
  phoneChange: function (e) {
    let money = e.detail.value;
    this.data.inputMoney = money
    this.setData({
      inputMoney: money,
      isLogin: money>0
    })
  },
  /**
   * 确定余额
   */
  submitBind: function () {
    var that = this;
    if (!that.data.isLogin) return;
    this.data.moneyList[this.data.selectIndex].money = this.data.inputMoney
    this.data.selectMoney = this.data.inputMoney
    this.setData({
      moneyList: this.data.moneyList,
      showLayer:false
    })
  },
  /**
   * 关闭弹窗
   */
  closeLayer: function () {
    this.setData({ showLayer: false });
  },
  rechargeHandler() {
    if (!this.data.selectMoney){
      wx.showToast({
        title: '请选择有效的金额',
        icon:'none'
      })
      return
    }
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
          total_fee: this.data.selectMoney * 100,
          // total_fee:1,
          body:'余额充值',
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
      success: (payRes)=> { // 支付成功后
        // this.triggerEvent("paySuccess")
        console.log(payRes)
        if (payRes.errMsg === 'requestPayment:ok'){
          wx.navigateTo({
            url: '/pages/playsuccess/playsuccess?result=1',
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