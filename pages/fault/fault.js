// pages/fault/fault.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    faultList: ['柜床不良', '开锁失败', '还床失败','二维码损坏','其他'],
    faultText:'',
    faultMap:{
      0:1,
      1:2,
      2:3,
      3:4,
      4:0
    },
    fault:null,
    describe:'',
    proNo:'',
    orderNo:'',
    postImgList:[]  //传给后台的文件
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.order){
      this.setData({
        orderNo: options.order
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

  },
  //输入备注
  inputDesc:function(e){
    this.setData({
      describe: e.detail.value
    })
  },
  //输入订单编号
  inputOder(e){
    this.setData({
      orderNo: e.detail.value
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
    if (this.data.imgList.length == 6){
      wx.showToast({
        title:'最多选择6张图片',
        icon:'none'
      })
      return
    }
    wx.chooseImage({
      count: 6 - this.data.imgList.length,
      success:(res)=>{
        console.log(res)
        wx.showLoading({
          title:'上传中...',
          mask:true
        })
        var pro = []
        for (let i = 0, img; img = res.tempFilePaths[i];i++){
          pro.push(this.uploadFile(img))
        }
        Promise.all(pro).then(()=>{
          wx.hideLoading()
          console.log(this.data.postImgList)
        })
      }
    })
  },
  //文件上传
  uploadFile:function(file){
    return new Promise((resolve, reject)=>{
      wx.uploadFile({
        url: wx.envConfig.host + 'file/upload',
        filePath: file,
        name: 'file',
        header: {
          ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
        },
        formData: {},
        success: (res) => {
          console.log(res)
          var data = JSON.parse(res.data)
          this.setData({
            imgList: [...this.data.imgList, ...[file]],
            postImgList: [...this.data.postImgList, ...[data.data[0].url]]
          })
          resolve(res.data)
        },
        fail: () => {
          reject()
        }
      })
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
      imgs: this.data.postImgList.join(',')
    }
    if (!this.data.fault){
      wx.showToast({
        title: '请选择故障类型',
        icon: 'none'
      })
      return
    }
    if (!this.data.proNo){
      wx.showToast({
        title: '请输入编号',
        icon: 'none'
      })
      return
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
        if(res.data.code == 100 && res.data.data){
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            mask:true
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/borrow/borrow',
            })
          },1000)
        }
      },
      fail: (err) => { },
      complete: (data) => {
        
      }
    })
  }
})