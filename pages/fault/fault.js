// pages/fault/fault.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    faultList:['床坏了','柜锁坏了','还床失败','其他'],
    faultText:''
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
  //选择故障
  choiceFault:function(){
    wx.showActionSheet({
      itemList: this.data.faultList,
      success: (res)=>{
        this.setData({
          faultText: this.data.faultList[res.tapIndex]
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
  }
})