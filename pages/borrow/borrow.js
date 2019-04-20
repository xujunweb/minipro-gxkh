//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    logs: [],
    defaultSize:'',
    loading:'',
    plain:false,
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    showLayer:false,
    showOrdering:false,
    ordering:{},  //进行中的订单信息
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    this.getImages()
    this.showWelcome()
  },
  onShow(){
    app.getOrderList('0', 1).then((list) => {
      if (list && list.length) {
        this.setData({
          ordering: {...list[0]},
          showOrdering:true,
        })
      }
    })
  },
  //强制结算
  goFault(){
    wx.navigateTo({
      url: 'pages/fault/fault?order=' + this.data.ordering.order_no,
    })
  },
  //获取轮播图
  getImages:function(){
    app.getAppInfo('carousel_img').then((res) => {
      console.log('轮播图-----', res)
      this.setData({
        imgUrls: res.data.value.split(',')
      })
    })
  },
  //查看大图
  clickImg:function(e){
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.imgUrls[index],
      urls: this.data.imgUrls
    });
  },
  GetUrlParam(paraName,lurl) {
    　var url = lurl;
　　　var arrObj = url.split("?");
　　　if(arrObj.length > 1) {
　　　　　var arrPara = arrObj[1].split("&");
　　　　　var arr;
　　　　　for (var i = 0; i < arrPara.length; i++) {
　　　　　　　arr = arrPara[i].split("=");
　　　　　　　if (arr != null && arr[0] == paraName) {
　　　　　　　　　return arr[1];
　　　　　　　}
　　　　　}
　　　　　return "";
　　　　}else {
　　　　　return "";
　　　}
　　},
  scan:function(){
    if (!app.globalData.loginUserInfo.telphone){
      wx.navigateTo({
        url: '/pages/message/message',
      })
      return
    }
    wx.scanCode({
      onlyFromCamera:true,   //可以从相册选择照片
      success:(e)=>{
        console.log(e)
        wx.showLoading({
          title: '正在处理...',
          mask:true
        })
        var id = this.GetUrlParam('id', e.result)
        var userInfo = app.globalData.loginUserInfo || wx.getStorageSync('loginUserInfo')
        if (userInfo.money < 0) {
          wx.hideLoading()
          //余额不足，跳转余额充值页面
          wx.showModal({
            title: '提示',
            content: `您好！您有订单${Math.abs(userInfo.money)}元暂未结清，请前往充值结清并留意余额帐户，支付本次使用金额。`,
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/my/recharge/recharge'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          return
        }
        app.getOrderList('0', 1).then((list) => {
          if(!list || !list.length){
            this.getLockInfo(id).then((data)=>{
              if(data.state == 0){
                wx.hideLoading()
                if (data.unit_price){
                  app.globalData.hourly = (+data.unit_price) / 100
                }
                wx.navigateTo({
                  url: '/pages/payment/payment?num=' + id
                })
              }else{
                wx.hideLoading()
                var stateMap = {
                  1:'该设备存在故障，正在维修中',
                  2:'该设备目前禁用中',
                  3:'设备已被占用'
                }
                wx.showToast({
                  title: stateMap[data.state] || '设备异常',
                  icon: 'none',
                  duration:3000
                })
              }
            }).catch(()=>{
              wx.showToast({
                title:'设备异常',
                icon: 'none',
                duration: 2000
              })
              wx.hideLoading()
            })
          }else{
            wx.hideLoading()
            wx.showToast({
              title: '您有进行中的订单\n请结束后再使用',
              icon:'none',
              duration: 3000
            })
          }
        })
      },
      fail:()=>{
        
      },
      complete:()=>{

      }
    })
  },
  //获取锁相关信息
  getLockInfo(no) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: wx.envConfig.host + 'lockOrder/getLockInfo',
        method: 'post',
        header: {
          ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo').id
        },
        data: { qr_code_no: no },
        success: (res) => {
          if (res.statusCode >= 400 || res.data.code != '100') {
            reject(res)
            return
          }
          if (res.data.data) {
            resolve(res.data.data)
          } else {
            reject(res)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  //显示欢迎弹窗
  showWelcome(){
    if (!wx.getStorageSync('welcome')){
      wx.setStorageSync('welcome', true)
      this.setData({
        showLayer: true
      })
    }
  },
  /**
   * 关闭弹窗
   */
  closeLayer: function () {
    this.setData({ showLayer: false });
  },
})
