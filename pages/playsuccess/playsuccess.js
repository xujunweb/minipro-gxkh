// pages/playsuccess/playsuccess.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlaysuccess:1    //充值是否成功
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options){
      this.setData({
        isPlaysuccess: options.result
      })
    }
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

  }
})