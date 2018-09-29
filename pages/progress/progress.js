// pages/progress/progress.js
const app = getApp()
import blue from '../../utils/blue/baseBleApi.js'
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
  //通过api开启蓝牙
  bluetext: function () {
    var pwd = "050106303030303030FFFFFFFFAEAEAE"    //开锁指令
    var token = '060101012D1A683D48271A18316E471A'  //获取token的指令
    var token2 = [0x06, 0x01, 0x01, 0x01, 0x2D, 0x1A, 0x68, 0x3D, 0x48, 0x27, 0x1A, 0x18, 0x31, 0x6E, 0x47, 0x1A]
    blue.writeCommend({
      services: ['FEE7'], sendCommend: token,
      indicateCharacteristicUUID: '000036F6-0000-1000-8000-00805F9B34FB',
      notifyCharacteristicUUID: '000036F6-0000-1000-8000-00805F9B34FB',
      writeCharacteristicUUID: '000036F5-0000-1000-8000-00805F9B34FB',
      writeServiceUUID: '0000FEE7-0000-1000-8000-00805F9B34FB',
      notifyServiceUUID: '0000FEE7-0000-1000-8000-00805F9B34FB',
      key: '3A60432A5C01211F291E0F4E0C132825',
      onSendSuccessCallBack: (result) => {
        console.log('完全成功-----', result)
        this.data.currentDevice = result
      }
    })
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