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
    duration: 1000
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    this.getImages()
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
      onlyFromCamera:false,   //可以从相册选择照片
      success:(e)=>{
        console.log(e)
        var id = this.GetUrlParam('id', e.result)
        wx.navigateTo({
          url: '/pages/payment/payment?num=' + id
        })
        // wx.navigateTo({
        //   url: '/pages/progress/progress?num=' + e.result
        // })
      },
      fail:()=>{
        
      },
      complete:()=>{

      }
    })
  }
})
