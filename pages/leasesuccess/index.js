// pages/leasesuccess/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaysuccess:1,
    hourly:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        isPlaysuccess: options.result
      })
      wx.setNavigationBarTitle({
        title: options.result?'租借成功':'租借失败'
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
    this.setData({
      hourly: app.globalData.hourly
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
})