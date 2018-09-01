//获取应用实例
const app = getApp()
Page({
  data: {
    orderlist:[
      {
        order_no:'jjdk454787',
        start_time: 1534673721000,
        address:'深圳市第六人名医院',
        fee:50
      },
      {
        order_no: 'jjdk454dfd7',
        start_time: 1534600000000,
        address: '深圳市',
        fee: 50
      }
    ],
    isloading:false,
    thisp:1,
    select:'0'
  },
  //下拉刷新
  onPullDownRefresh:function(){
    this.data.thisp = 1
    this.getOrderList()
  },
  //触底刷新
  onReachBottom:function(){
    if (this.data.isloading) {
      // let thisp = this.data.thisp
      this.data.thisp++
      // console.log(self.data.config)
      this.getOrderList()
    }
  },
  onLoad: function () {
    this.getOrderList()
  },
  //列表切换
  orderSwitch:function(){
    if(this.data.select == '0'){
      this.setData({
        select:'1'
      })
    }else{
      this.setData({
        select: '0'
      })
    }
    this.getOrderList()
  },
  getOrderList:function(){
    if (this.data.isloading){
      wx.showToast({
        title:'请勿频繁操作',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title:'加载中',
      mask:true,
    })
    this.setData({
      isloading:true
    })
    wx.request({
      url: wx.envConfig.host +'lockOrder/pageByLockOrder',
      method: "POST",
      header: {
        ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
      },
      data: { type: this.data.select, pageNum: this.data.thisp, pageSize:8 },
      success: (res) => {
        // this.setData({
        //   orderlist: res.data.data.list
        // })
      },
      fail: (err) => {},
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
