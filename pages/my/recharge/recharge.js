// pages/my/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyList:[
      {
        money:5,
        select:true
      },
      {
        money: 10,
        select: false
      },
      {
        money: 20,
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
      }
    ],
    selectMoney:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  //选择金额
  select:function(e){
    var index = e.target.dataset.index
    for (var i = 0, len = this.data.moneyList.length;i<len;i++){
      this.data.moneyList[i].select = false
    }
    this.data.moneyList[index].select = true
    this.data.selectMoney = this.data.moneyList[index].money
    this.setData({
      moneyList: this.data.moneyList
    })
  },
  rechargeHandler() {
    return new Promise((resolve, reject) => {
      app.ajaxSubmit({
        url: app.globalData.shopMHost + 'xcx/member/recharge',
        method: 'post',
        header: {
          sessionId: wx.getStorageSync('memberCardInfo') && wx.getStorageSync('memberCardInfo').sessionId
        },
        data: {
          amount: (this.data.rechargeAmount || this.data.rechargeValue) * 100,
          memberId: wx.getStorageSync('memberCardInfo') && wx.getStorageSync('memberCardInfo').id,
          openId: app.globalData.openid,
          orgId: app.globalData.orgId,
          returnAmount: this.data.returnAmount * 100 || 0,
          // sessionId: '',
          xcxId: app.globalData.xcxId
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
        else if (res.data.code !== '000000') {
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
      success: function (payRes) { // 支付成功后
        this.triggerEvent("paySuccess")
      },
      fail: (res) => { // 支付失败回调
        this.triggerEvent("paySuccess")
        wx.showToast({
          title: '用户取消支付',
          icon: 'none'
        })
      }
    })
  },
})