//index.js
//获取应用实例
const app = getApp()

var deviceId = 'C6:D0:21:F7:FB:7C';
var serviceId = '0000FEE7-0000-1000-8000-00805F9B34FB';
var characteristicIdR = '000036F6-0000-1000-8000-00805F9B34FB';
var characteristicIdW = '000036F5-0000-1000-8000-00805F9B34FB';

var alldevice;

function getMac(e)
{
  var uint8bytes = new Uint8Array(e);
  if (e.byteLength == 13)
  {
    return ('00' + uint8bytes[2].toString(16).toUpperCase()).substr(-2) + ':' + ('00' + uint8bytes[3].toString(16).toUpperCase()).substr(-2) + ':' + ('00' + uint8bytes[4].toString(16).toUpperCase()).substr(-2) + ':' + ('00' + uint8bytes[5].toString(16).toUpperCase()).substr(-2) + ':' + ('00' + uint8bytes[6].toString(16).toUpperCase()).substr(-2) + ':' + ('00' + uint8bytes[7].toString(16).toUpperCase()).substr(-2);
  }
  else
  {
    return "";
  }
}

function IsMacOk(ibytes,imac)
{
  //'C6:D0:21:F7:FB:7C'
  //var uint8bytes = new Uint8Array([1, 2, 0xc6, 0xd0, 0x21, 0xf7, 0xfb, 0x7c, 0xd0, 0x21, 0xf7, 0xfb, 0x7c]);
  var uint8bytes = new Uint8Array(ibytes);
  if (uint8bytes.length == 13) {
    var ss = imac.split(":");
    var re = true;
    for(var x = 0; x < ss.length; x++)
    {
      if (uint8bytes[2 + x] != parseInt(ss[x], 16))
      {
        re = false;
        break;
      }
    }
    return re;
  }
  else {
    return false;
  }
}

Page({
  data: {
    text: 'Hello World'
  },
  onLoad:function(e){

   /* wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        console.log(res.system)
      }
    })


    wx.request({
      url: 'https://www.rocolock.com/aes.aspx',
      data: {
        cmd: 'gettoken', data: ''
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        console.log("aaaaaa")
      }

    })*/

  },
  //事件处理函数
  openBluetoothAdapter: function (e) {//初始化蓝牙适配器
    var that = this;
 
    wx.openBluetoothAdapter({
      success: function (res) {
        that.setData({ "text": 'open ok' })
      }
    })
  },
  closeBluetoothAdapter: function (e) {//关闭蓝牙模块。调用该方法将断开所有已建立的链接并释放系统资源
    var that = this;
    wx.closeBluetoothAdapter({
      success: function (res) {
        that.setData({ "text": 'close ok' })
      }
    })
  },
  getBluetoothAdapterState: function (e) {//获取本机蓝牙适配器状态
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        that.setData({ "text": res.available + '-' + res.discovering })
      }
    })
  },
  onBluetoothAdapterStateChange: function (e) {//监听蓝牙适配器状态变化事件
    var that = this;
    wx.onBluetoothAdapterStateChange(function (res) {
      
      that.setData({ "text": res.available + '-' + res.discovering })
    })
  },
  startBluetoothDevicesDiscovery: function (e) {//开始搜寻附近的蓝牙外围设备。
    var that = this;
    alldevice = "";

    wx.startBluetoothDevicesDiscovery({
      services: ['FEE7'],
      success: function (res) {
        that.setData({ "text": 'start ok' })
      }
    })
  },
  stopBluetoothDevicesDiscovery: function (e) {//停止搜寻附近的蓝牙外围设备。请在确保找到需要连接的设备后调用该方法停止搜索。
    var that = this;

    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        
        that.setData({ 'text': res.errMsg})
      }
    })
  },
  getBluetoothDevices: function (e) {//获取所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备
    var that = this;
    wx.getBluetoothDevices({
      success: function (res) {

        that.setData({ "text": res.devices[0].deviceId})
        var aa = new Uint8Array(res.devices[0].advertisData);
        var bb = "";
        for(var i = 0; i < aa.length; i++)
        {
          bb = bb + ',' + aa[i].toString(16);
        }

        that.setData({ "text": res.devices[0].name + '-' + res.devices[0].localName + '-' + res.devices[0].RSSI + '-' + res.devices[0].deviceId + '-' + res.devices.length + '-' + bb + '-' + getMac(res.devices[0].advertisData) })
        
        
      }
    })

  },
  onBluetoothDeviceFound: function (e) {//监听寻找到新设备的事件
    var that = this;
    wx.onBluetoothDeviceFound(function (res) {
      for(var x in res.devices)
      {
        /*
        var mac = getMac(res.devices[x].advertisData)
        alldevice += '--' + mac
        that.setData({ "text": alldevice})
        
        if (mac == 'C6:D0:21:F7:FB:7C') {
        deviceId = res.devices[x].deviceId;
          wx.stopBluetoothDevicesDiscovery({
            success: function (res) {
              //that.setData({ "text": 'close' })
            }
          })
        }*/


        alldevice += '--' + res.devices[x].deviceId
        that.setData({ "text": alldevice })

        if (IsMacOk(res.devices[x].advertisData,'C6:D0:21:F7:FB:7C')) {
          deviceId = res.devices[x].deviceId;
          wx.stopBluetoothDevicesDiscovery({
            success: function (res) {
              //that.setData({ "text": 'stop ok' })
            }
          })
        }
      }
    })
  },
  getConnectedBluetoothDevices: function (e) {//根据 uuid 获取处于已连接状态的设备
    var that = this;
    wx.getConnectedBluetoothDevices({
      success: function (res) {
        that.setData({ "text": res.devices.length + '---' + res.devices[0].deviceId })
      }
    })
  },
  createBLEConnection: function (e) {//连接低功耗蓝牙设备
    var that = this;
    wx.createBLEConnection({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      success: function (res) {
        that.setData({ "text": 'create ok' })
      }
    })

  },
  closeBLEConnection: function (e) {//断开与低功耗蓝牙设备的连接
    var that = this;
    wx.closeBLEConnection({
      deviceId:deviceId,
      success: function (res) {
        that.setData({ "text": 'close ok' })
      }
    })
  },
  getBLEDeviceServices: function (e) {//获取蓝牙设备所有 service（服务）
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      success: function (res) {
        var allmes = "";
        for(var i in res.services)
        {
          allmes += '//' + res.services[i].uuid + '--' + res.services[i].isPrimary;

          wx.getBLEDeviceCharacteristics({
            // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
            deviceId: deviceId,
            // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
            serviceId: res.services[i].uuid,
            success: function (res) {
              for(var x in res.characteristics)
              {
                allmes += '==' + res.characteristics[x].uuid + '-' + res.characteristics[x].properties.read + '-' + res.characteristics[x].properties.write + '-' + res.characteristics[x].properties.notify + '-' + res.characteristics[x].properties.indicate;
              }
              that.setData({ "text": allmes })
            }
          })

        }
        that.setData({ "text": allmes })
      }
    })
  },
  getBLEDeviceCharacteristics: function (e) {//获取蓝牙设备所有 characteristic（特征值）
    var that = this;
    that.setData({ 'text': 'aa2a' })
   
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      success: function (res) {
        var allmes = ""
        that.setData({'text':'aaa'})
        for (var x in res.characteristics) {
          allmes += '==' + res.characteristics[x].uuid + '-' + res.characteristics[x].properties.read + '-' + res.characteristics[x].properties.write + '-' + res.characteristics[x].properties.notify + '-' + res.characteristics[x].properties.indicate;
        }
        that.setData({ "text": allmes })
      }
    })

  },
  readBLECharacteristicValue: function (e) {//读取低功耗蓝牙设备的特征值的二进制数据值
    // 必须在这里的回调才能获取
    var that = this;
    
    wx.readBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: characteristicIdR,
      success: function (res) {

        var aa = new Uint8Array(res.characteristic.value);
        var bb = "";
        for (var i = 0; i < aa.length; i++) {
          bb = bb + ',' + aa[i].toString(16);
        }
        that.setData({ 'text': 'read--' + bb })
      }
    })
  },
  writeBLECharacteristicValue: function (e) {//向低功耗蓝牙设备特征值中写入二进制数据
    // 向蓝牙设备发送一个0x00的16进制数据
    var that = this;
    let buffer = new ArrayBuffer(1)
    let dataView = new DataView(buffer)
    dataView.setUint8(0, 0)

    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: serviceId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: characteristicIdW,
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success: function (res) {
        that.setData({'text':res.errMsg})
      }
    })

  },
  notifyBLECharacteristicValueChange: function (e) {//启用低功耗蓝牙设备特征值变化时的 notify 功能 必须先启用 notify 才能监听到设备 characteristicValueChange 事件
    var that = this;
    this.setData({'text':'notify'})

    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicIdR,
      success: function (res) {
        that.setData({ 'text': res.errMsg })
        that.setData({ 'text': 'notify ok' })
      }
    })

  },
  onBLEConnectionStateChange: function (e) {
    var that = this;

    wx.onBLEConnectionStateChange(function (res) {
      that.setData({ 'text': res.connected })
    })
  },
  onBLECharacteristicValueChange: function (e) {
    var that = this;

    wx.onBLECharacteristicValueChange(function (res) {

      that.setData({ 'text': 'valuechange -- ' + res.deviceId })

      var readdata = wx.arrayBufferToBase64(res.value)
      that.setData({ 'text': 'ValueChange--' + readdata })


      wx.request({
        url: 'https://www.rocolock.com/aes.aspx',
        data: {
          cmd: 'updata', data: readdata
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

          if (res.data.cmd == "show") {
            that.setData({ 'text': res.data.cmd + '--' + res.data.data })
          }
        }

      })

    })
  },
  gettoken:function(e){
    var that = this;
    wx.request({
      url: 'https://www.rocolock.com/aes.aspx',
      data: {
        cmd: 'gettoken', data: ''
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        that.setData({ 'text': res.data.cmd + '--' + res.data.data })
          
          if (res.data.cmd == "send") {


            that.setData({ 'text': 'data--' + res.data.data })

            var buffer = wx.base64ToArrayBuffer(res.data.data)

            wx.writeBLECharacteristicValue({
              deviceId: deviceId,
              serviceId: serviceId,
              characteristicId: characteristicIdW,
              value: buffer,
              success: function (res) {
                that.setData({ 'text': res.errMsg })
              }
            })
          }
      }

    })
  },
  open:function(e){

    var that = this;

    wx.request({
      url: 'https://www.rocolock.com/aes.aspx',
      data: {
        cmd: 'open', data: ''
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        that.setData({ 'text': res.data.cmd + '--' + res.data.data })

        if (res.data.cmd == "send") {


          that.setData({ 'text': 'data--' + res.data.data })

          var buffer = wx.base64ToArrayBuffer(res.data.data)

          wx.writeBLECharacteristicValue({
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: characteristicIdW,
            value: buffer,
            success: function (res) {
              that.setData({ 'text': res.errMsg })
            }
          })
        }
      }

    })
  }
})
