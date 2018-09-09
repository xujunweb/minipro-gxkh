// pages/progress/progress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress:0,
    num:'',
    fee:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.data.num = options.num
      this.data.fee = options.fee
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
    this.unlock(this.data.num)
    this.next()
  },
  //进度条增加
  next:function(){
    var that = this;
    if(this.data.progress >= 99){
        this.setData({
            disabled: false
        });
        return true;
    }
    this.setData({
        progress: ++this.data.progress
    });
    setTimeout(function(){
        that.next()
    }, 50);
  },
  //解锁请求
  unlock: function (lock) {
    console.log(app.globalData.loginUserInfo, wx.getStorageSync('loginUserInfo'))
    wx.request({
      url: wx.envConfig.host + 'lockOrder/unLock',
      data: { lock_no: lock, fee: +this.data.fee },
      method: 'POST',
      header: {
        ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
      },
      success: (res) => {
        console.log('解锁请求--------', res)
        if (res.data.code == 100) {
          this.setData({
            progress:100
          })
          wx.redirectTo({
            url:'/pages/leasesuccess/index?result=1'
          })
        }else{
          wx.showToast({
            title: app.globalData.typeMap[res.data.code] || '未知错误',
            icon: 'none'
          })
          wx.redirectTo({
            url: '/pages/leasesuccess/index?result=0'
          })
        }
      }
    })
  }
})