//获取应用实例
const app = getApp()
Page({
  data: {
    orderlist:[],
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
    app.getOrderList(this.data.select, this.data.thisp,()=>{
      wx.hideLoading()
      this.setData({
        isloading: false
      })
      wx.stopPullDownRefresh()
    }).then((list)=>{
      this.setData({
        orderlist: list
      })
    })
  }
})
