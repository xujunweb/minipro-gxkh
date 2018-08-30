// pages/fault/fault.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    faultList:['床坏了','柜锁坏了','还床失败','其他'],
    faultText:'',
    faultMap:{
      0:1,
      1:2,
      2:3,
      3:0
    },
    fault:1,
    describe:'',
    proNo:''
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
  //输入备注
  inputDesc:function(e){
    this.setData({
      describe: e.detail.value
    })
  },
  //输入编号
  inputNo:function(e){
    this.setData({
      proNo: e.detail.value
    })
  },
  //选择故障
  choiceFault:function(){
    wx.showActionSheet({
      itemList: this.data.faultList,
      success: (res)=>{
        this.setData({
          faultText: this.data.faultList[res.tapIndex],
          fault: this.data.faultMap[res.tapIndex]
        })
      }
    })
  },
  //选择相片
  getImage:function(){
    wx.chooseImage({
      count:6,
      success:(res)=>{
        console.log(res)
        this.setData({
          imgList:[...this.data.imgList,...res.tempFilePaths]
        })
      }
    })
  },
  //删除图片
  deleteImg:function(e){
    var index = e.currentTarget.dataset.index
    this.data.imgList.splice(index,1)
    this.setData({
      imgList: this.data.imgList
    })
  },
  //提交申报
  postFault:function(){
    var data = {
      fault_type: this.data.fault,
      device_no: this.data.proNo,
      desc: this.data.describe,
      imgs: this.data.imgList.join(',')
    }
    wx.showLoading({
      title:'提交中',
      mask:true
    })
    wx.request({
      url: wx.envConfig.host + 'faultFeedback/save',
      method: "POST",
      header: {
        ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
      },
      data: data,
      success: (res) => {
        wx.showToast({
          title:'提交成功',
          icon:'none'
        })
        wx.switchTab({
          url: 'pages/borrow/borrow',
        })
      },
      fail: (err) => { },
      complete: (data) => {
        wx.hideLoading()
      }
    })
  }
})