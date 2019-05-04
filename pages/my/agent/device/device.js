// pages/my/agent/device/device.js
import { getDeviceList } from '../../../../api/order.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articlelist: [], //文章列表
    thisp: 1,  //当前页
    lastPage: 1, //总共页数
    total:'', //总计
    noMore: false, //没有更多数据了
    hospital: '',  //所属医院
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDeviceList()
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
  inputChange: function (e) {
    this.setData({
      hospital: e.detail.value
    })
  },
  //医院搜索
  getOrderListToHo: function () {
    this.data.thisp = 1
    this.getDeviceList(true)
  },
  //分页加载文章列表
  getDeviceList: function (resf) {
    if (this.data.thisp > this.data.lastPage && this.data.lastPage != 0) {
      this.setData({
        noMore: true
      })
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
      return
    }
    //获取本地的关注用户
    getDeviceList({
      pageNum: this.data.thisp,
      pageSize: 8,
      hospital: this.data.hospital,
    }).then((res) => {
      console.log(res)
      this.data.lastPage = res.data.lastPage
      if (resf) {
        this.setData({
          articlelist: [...res.data.list],
          total: res.data.total
        })
        wx.stopPullDownRefresh()
      } else {
        this.setData({
          articlelist: [...this.data.articlelist, ...res.data.list],
          total: res.data.total
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.thisp = 1
    this.getDeviceList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.thisp += 1
    this.getDeviceList()
  }
})