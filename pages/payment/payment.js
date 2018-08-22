// pages/payment/payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weixin:true,
    yue:false
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  //查询时间和金额
  getTime:function(data){
    wx.request({
      url: '',
      data:data,
    })
  }
})