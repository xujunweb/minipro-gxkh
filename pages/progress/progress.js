// pages/progress/progress.js
const app = getApp()
import blue from '../../utils/blue/baseBleApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress:0,
    id:'',
    fee:'',
    fail:'',
    failMap:{
      1:'初始化蓝牙适配器失败',
      2:'开启搜索失败',
      3:'搜索设备超时',
      4:'没有搜索到要链接的设备',
      5:'连接设备超时',
      6:'链接失败',
      7:'获取服务失败',
      8:'唤醒特征值失败',
      9:'开启监听失败',
      10:'执行指令失败',
      11:'开锁失败'
    },
    num:0,
    hours:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面参数-----', options)
    if (options) {
      this.data.id = options.num
      this.data.fee = options.fee
      this.data.hours = options.hours
      console.log('设备编号-----------',this.data.id)
    }
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
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
    // this.unlock(this.data.num)
    this.bluetext()
    this.next()
    this.data.num = 0
  },
  //通过api开启蓝牙
  bluetext: function () {
    this.getLockInfo(this.data.id).then((data)=>{
      if(data.type === '1'){
        this.unlock(data.lock_no, 'v2')
      }else{
        var token = '060101012D1A683D48271A18316E471A'  //获取token的指令
        blue.writeCommend({
          services: ['FEE7'], sendCommend: token,
          indicateCharacteristicUUID: '000036F6-0000-1000-8000-00805F9B34FB',
          notifyCharacteristicUUID: '000036F6-0000-1000-8000-00805F9B34FB',
          writeCharacteristicUUID: '000036F5-0000-1000-8000-00805F9B34FB',
          writeServiceUUID: '0000FEE7-0000-1000-8000-00805F9B34FB',
          notifyServiceUUID: '0000FEE7-0000-1000-8000-00805F9B34FB',
          password: data.lock_pwd,
          MAC: data.lock_mac,
          qrCode: this.data.id,
          onSendSuccessCallBack: (result) => {
            console.log('完全成功-----', result)
            blue.closeBLEConnection(result.deviceId, () => {
              wx.showLoading({
                title: '解锁成功,生成订单中...',
                mask: true
              })
              this.data.currentDevice = result
              this.unlock(("0" + '' + result.msgId).substr(0, 12))
            })
          },
          onFailCallBack: (res, dev) => {
            if (dev.deviceId) {
              blue.closeBLEConnection(dev.deviceId, () => {
                this.again(res)
              })
            } else {
              this.again(res)
            }
          }
        })
      }
    })
    
  },
  //获取锁相关信息
  getLockInfo(no){
    return new Promise((resolve, reject)=>{
      wx.request({
        url: wx.envConfig.host + 'lockOrder/getLockInfo',
        method: 'post',
        header: {
          ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
        },
        data: { qr_code_no: no },
        success: (res) => {
          if (res.statusCode >= 400 || res.data.code != '100') {
            reject(res)
            return
          }
          if (res.data.data){
            resolve(res.data.data)
          }else{
            reject(res)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  //重试
  again(res){
    //只允许一次重试
    if (this.data.num < 1) {
      wx.showModal({
        title: '提示',
        content: this.data.failMap[res] + ',是否重试？',
        success: (res) => {
          if (res.confirm) {
            this.data.num = 1
            this.setData({
              progress: 0
            }, () => {
              this.next()
            })
            console.log('用户点击确定')
            this.bluetext()
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.redirectTo({
              url: '/pages/leasesuccess/index?result=0'
            })
          }
        }
      })
    } else {
      wx.redirectTo({
        url: '/pages/leasesuccess/index?result=0'
      })
    }
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
    }, 200);
  },
  //解锁请求
  unlock: function (lock,v) {
    var url = 'lockOrder/unLock'
    if(v){
      //GPRS解锁
      url = 'lockOrder/unLockV2'
    }
    return new Promise((resolve, reject)=>{
      wx.request({
        url: wx.envConfig.host + url,
        data: { lock_no: lock, fee: +this.data.fee, hours: this.data.hours },
        method: 'POST',
        header: {
          ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
        },
        success: (res) => {
          console.log('解锁请求--------', res)
          wx.hideLoading()
          if (res.data.code == 100) {
            this.setData({
              progress: 100
            })
            wx.redirectTo({
              url: '/pages/leasesuccess/index?result=1'
            })
            resolve()
          } else {
            reject(res.data)
            if(v)return
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
    })
  }
})