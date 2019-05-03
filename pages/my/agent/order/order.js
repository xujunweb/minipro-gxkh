// pages/my/agent/order/order.js
import { getOrderList, sumByLockOrder } from '../../../../api/order.js'
import { GetTime } from '../../../../utils/util.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articlelist: [], //文章列表
    thisp: 1,  //当前页
    lastPage: 1, //总共页数
    noMore: false, //没有更多数据了
    total:'', //总计
    startDate:'2018-09-01', //开始时间
    endDate: GetTime(),   //结束时间
    thisDate: GetTime(),  //当前时间
    typeMap: {
      0: 'PT',
      1: 'GL',
      2: 'DL',
      3: 'GZ'
    },
    total_fee:0,  //总费用
    diff_fee:0, //总欠费
    hospital:'',  //所属医院
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  inputChange: function(e){
    this.setData({
      hospital:e.detail.value
    })
  },
  bindTimeChange:function (res) {
    console.log('选择时间-------',res)
    this.data[res.target.dataset.type + 'Date'] = res.detail.value
    this.setData({
      [res.target.dataset.type+'Date']:res.detail.value
    })
    this.data.thisp = 1
    this.getOrderList(true)
  },
  //医院搜索
  getOrderListToHo: function(){
    this.data.thisp = 1
    this.getOrderList(true)
  },
  //分页加载文章列表
  getOrderList: function (resf) {
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
    var data = {
      pageNum: this.data.thisp,
      pageSize: 8,
      start_time: this.data.startDate + ' 00:00:00',
      end_time: this.data.endDate + ' 23:59:59',
      hospital: this.data.hospital,
    }
    //获取订单统计数据
    sumByLockOrder(data).then((res) => {
      console.log('订单统计数据---', res)
      this.setData({
        diff_fee: res.data.diff_fee,
        total_fee: res.data.total_fee,
      })
    })
    //分页加载文章列表
    getOrderList(data).then((res) => {
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
    this.getOrderList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.thisp += 1
    this.getOrderList()
  }
})