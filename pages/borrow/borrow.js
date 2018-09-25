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
  //启动蓝牙
  startBlue:function(){
    wx.openBluetoothAdapter({
      success:(res)=>{
        console.log('蓝牙打开成功-----',res)
        //蓝牙打开成功后续执行
        this.executeBlue()
      },
      fail:(err)=>{
        console.log('蓝牙打开失败-----', err)
      }
    })
  },
  //启动蓝牙后续
  executeBlue:function(){
    //获取本机蓝牙适配器状态
    wx.getBluetoothAdapterState({
      success:(res)=>{
        //discovering(是否在搜索)available(蓝牙是否可用)errMsg
      }
    })
    //监听蓝牙适配器状态
    wx.onBluetoothAdapterStateChange( (res) => {
      console.log(`监听蓝牙适配器状态`, res)
    })
    //开始搜寻附近的蓝牙外围设备
    wx.startBluetoothDevicesDiscovery({
      // services: ['FEE7'],
      success:(res)=>{
        console.log('搜索成功------',res)
      }
    })
    //监听寻找新设备
    wx.onBluetoothDeviceFound((devices)=>{
      console.dir(devices)
      console.log(this.ab2hex(devices.devices[0].advertisData))
      console.log('新搜索到的设备列表',devices)
      //开始链接
      this.createBLE(devices.devices[0].deviceId)
    })
    //关闭蓝牙
    // wx.closeBluetoothAdapter({
    //   success:(res)=>{
    //     console.log('关闭蓝牙---------',res)
    //   }
    // })
  },
  //链接蓝牙
  createBLE: function (deviceId){
    console.log('链接的设备ID:',deviceId)
    //链接低功耗蓝牙
    wx.createBLEConnection({
      deviceId: deviceId,    //之前链接过的蓝牙设备id
      timeout: 100000,  //超时时间
      success: (res) => {
        console.log('链接蓝牙状态-----',res)
      },
      fail:(err)=>{
        console.log('链接蓝牙失败-----', err)
      }
    })
    
    //监听低功耗蓝牙连接状态的改变事件
    wx.onBLEConnectionStateChange((res)=>{
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
    //获取蓝牙设备所有 service（服务）
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接 
      deviceId: deviceId,
      success:(res)=>{
        console.log('链接的蓝牙服务', res.services)
      }
    })
  },
  //ArrayBuffer转16进度字符串示例
  ab2hex: function (buffer){
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('')
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
  scan:function(){
    if (!app.globalData.loginUserInfo.telphone){
      wx.navigateTo({
        url: '/pages/message/message',
      })
      return
    }
    this.startBlue()
    return

    wx.scanCode({
      onlyFromCamera:false,   //可以从相册选择照片
      success:(e)=>{
        console.log(e)
        wx.navigateTo({
          url: '/pages/payment/payment?num='+e.result
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
