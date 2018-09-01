// pages/my/detailed/detailed.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderlist: [
      {
        order_no: 'jjdk454787',
        type:'1',
        update_time: '2018-10-10 10:10',
        fee:200
      },
      {
        order_no: 'jjdk454787',
        type: '1',
        update_time: '2018-10-10 10: 10',
        fee: 200
      }
    ],
    isloading: false,
    thisp: 1,
    typeMap:{
      0:'余额支付',
      1:'退费',
      2:'缴纳押金',
      3:'退押金',
      4:'充值'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.thisp = 1
    this.getOrderList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isloading) {
      // let thisp = this.data.thisp
      this.data.thisp++
      // console.log(self.data.config)
      this.getOrderList()
    }
  },
  getOrderList: function () {
    if (this.data.isloading) {
      wx.showToast({
        title: '请勿频繁操作',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.setData({
      isloading: true
    })
    wx.request({
      url: wx.envConfig.host + 'user/pageByTransFlowInfo',
      method: "POST",
      header: {
        ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
      },
      data: { pageNum: this.data.thisp, pageSize: 8 },
      success: (res) => {
        // this.setData({
        //   orderlist: res.data.data.list
        // })
      },
      fail: (err) => { },
      complete: (data) => {
        wx.hideLoading()
        this.setData({
          isloading: false
        })
        wx.stopPullDownRefresh()
      }
    })
  }
})