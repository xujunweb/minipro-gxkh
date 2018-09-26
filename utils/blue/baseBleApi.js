import aes from '../aes.js'
var currentDevice = {};//ble设备
var indicateCharacteristic = {};//唤醒特征值
var writeService = {};//写入服务
var notifyService = {}
var writeCharacteristic = {};//写入特征值
var notifyCharacteristic = {};//唤醒特征值
var onSendSuccessCallBack = undefined;//成功回调
var onConnectCallback = undefined;// 链接回调
var bleUtils = require('strUtils.js');
var crc = require('crc.js');
var isConnected = false;//是否已链接
module.exports = {
  writeCommend: writeCommend,
  closeBLEConnection: closeBLEConnection
  // disConnect, disConnect,
  // openBluetoothAdapter: openBluetoothAdapter
}
/**
* @param sendCommend 写入命令
* @param deviceName 锁具名称
* @param onSuccessCallBack 成功回调
* @param onFailCallBack 返回失败回调
* @param onCompleteCallBack 成功失败都会回调
*
* @param services 主服务serviceUUID
* @param writeServiceUUID 写入服务UUID
* @param notifyServiceUUID 唤醒服务UUID
*
* @param notifyCharacteristicUUID 唤醒特征值UUID
* @param writeCharacteristicUUID 写入特征值UUID
*/
function writeCommend(options) {
  var params = {};
  var defalt = {
    adviceId: "",
    sendCommend: "",
    onSuccessCallBack: function success(res) { },
    onFailCallBack: function success(res) { },
    onCompleteCallBack: function success(res) { },
    services: [],
    writeServiceUUID: "",
    notifyServiceUUID: "",
    notifyCharacteristicUUID: "",
    writeCharacteristicUUID: ""
  };
  params = Object.assign(defalt, options)
  // setConnectionStateChange(params.onFailCallBack)
  if (!setConnectionStateChange()) {
    openBluetoothAdapter(params);
  } else {
    // typeof str == 'string'
    sendCmd(params.sendCommend, params.onSuccessCallBack, params.onFailCallBack);
  }
}
/**
* 初始化蓝牙适配器
*/
function openBluetoothAdapter(params) {
  wx.openBluetoothAdapter({
    success: function (res) {
      console.log("初始化蓝牙适配器成功")
      console.log(res)
      startBluetoothDevicesDiscovery(params)
    }, fail: function (res) {
      console.log("初始化蓝牙适配器失败")
      params.onFailCallBack(res.errMsg)
      console.log(res);
      return
    },
    complete: function (res) {
      console.log(res);
    }
  })
}
/**
* 开始搜寻附近的蓝牙外围设备。注意，该操作比较耗费系统资源，请在搜索并连接到设备后调用 stop 方法停止搜索。
* @ params services:['4asdga'],根据主ServiceUUID进行搜索特定蓝牙，提高搜索效率
* 本ble设备主ServiceUUid: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
*/
var delayTimer;//停止循环获取tag
var isFound = false
function startBluetoothDevicesDiscovery(params, connectCallback) {
  if (typeof connectCallback == 'undefined') {
    connectCallback = function (errMsg) { }
  }
  onConnectCallback = connectCallback;
  setTimeout(function () {
    if (isFound) {
      return;
    }
    else {
      console.log("搜索设备超时");
      params.onFailCallBack("搜索设备超时")
      stopBluetoothDevicesDiscovery();
      clearInterval(delayTimer)
      return
    }
  }, 10000);
  wx.startBluetoothDevicesDiscovery({
    services: params.services,
    success: function (res) {
      console.log(res)
      console.log("开启搜索成功")
      getBluetoothDevices(params)
    }, fail: function (res) {
      console.log("开启搜索失败")
      console.log(res)
      params.onFailCallBack(res)
      return
    },
    complete: function (res) {
      // complete
      console.log(res);
    }
  })
  //每隔一秒获取一次
  // delayTimer = setInterval(function () {
  //   getBluetoothDevices(params)
  // }, 1000)
}
/**
* 获取所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备
*/
function getBluetoothDevices(params) {
  wx.getBluetoothDevices({
    success: function (res) {
      console.log("getBluetoothDevices");
      console.log(res.devices);
      for (var i = 0; i < res.devices.length; i++) {
        //忽略传入的deviceName大小写
        // isContains bleUtils
        console.log("搜索到要链接的设备....")
        var lockNameFinal = bleUtils.removeBytes(params.adviceId, ":")
        if (bleUtils.isContains(res.devices[i].name, lockNameFinal)) {
          // console.log("搜索到要链接的设备....")
          // stopBluetoothDevicesDiscovery();
          // isFound = true
          // clearInterval(delayTimer)
          // currentDevice = res.devices[0]
          // createBLEConnection(params)
        }
        if (res.devices[i].localName === 'k06_YPP'){
          stopBluetoothDevicesDiscovery();
          isFound = true
          clearInterval(delayTimer)
          currentDevice = res.devices[i]
          createBLEConnection(params)
        }
      }
    },
    fail: function (res) {
      clearInterval(delayTimer)
      console.log("没有搜索到要链接的设备....")
      console.log(res)
      params.onFailCallBack(res)
      stopBluetoothDevicesDiscovery();
      return
    }
  })
}
/**
* 停止搜寻附近的蓝牙外围设备。请在确保找到需要连接的设备后调用该方法停止搜索。
*/
function stopBluetoothDevicesDiscovery() {
  wx.stopBluetoothDevicesDiscovery({
    success: function (res) {
      console.log(res)
    }
  })
}
/**
* 连接低功耗蓝牙设备
*/
function createBLEConnection(params) {
  // setConnectionStateChange(params.onFailCallBack);
  setTimeout(function () {
    if (isConnected) return;
    console.log("连接设备超时");
    params.onFailCallBack("连接设备超时")
    return
  }, 5000)
  wx.createBLEConnection({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: currentDevice.deviceId + "",
    success: function (res) {
      console.log(res)
      console.log(`连接成功 : ${currentDevice.deviceId}`)
      isConnected = true
      getBLEDeviceServices(params);

    }, fail: function (res) {
      console.log(res)
      params.onFailCallBack(res)
      console.log(`连接失败 : ${currentDevice.deviceId}`)
    }
  })
}
/**
* closeBLEConnection
* 断开与低功耗蓝牙设备的连接
*/
function closeBLEConnection(deviceId) {
  wx.closeBLEConnection({
    deviceId: currentDevice.deviceId + "",
    success: function (res) {
      console.log(res)
    }
  })
}
/**
*
* 返回蓝牙是否正处于链接状态
*/
function setConnectionStateChange(onFailCallback) {
  wx.onBLEConnectionStateChange(function (res) {
    // 该方法回调中可以用于处理连接意外断开等异常情况
    console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
    return res.connected;
  });
}
/**
* 获取蓝牙设备所有 service（服务）
* @params writeServiceUUID:ble设备所具有的写入服务UUID
* @params notifyServiceUUID:ble设备具有的唤醒服务UUID
*/
function getBLEDeviceServices(params) {
  wx.getBLEDeviceServices({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: currentDevice.deviceId + "",
    success: function (res) {
      console.log(`获取服务成功 :`)
      console.log('device services:', res.services)
      for (var i = 0; i < res.services.length; i++) {
        if (res.services[i].uuid == params.writeServiceUUID) {
          writeService = res.services[i]
        }
        if (res.services[i].uuid == params.notifyServiceUUID) {
          notifyService = res.services[i]
        }
      }
      //获取
      getNotifyBLEDeviceCharacteristics(params);
    }
  })
}
/**
* 获取蓝牙设备唤醒characteristic（特征值）
*/
function getNotifyBLEDeviceCharacteristics(params) {
  wx.getBLEDeviceCharacteristics({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: currentDevice.deviceId + "",
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: notifyService.uuid + "",
    success: function (res) {
      console.log("唤醒特征值获取成功：")
      console.log('device getBLEDeviceCharacteristics:', res.characteristics)
      for (var i = 0; i < res.characteristics.length; i++) {
        if (res.characteristics[i].uuid == params.indicateCharacteristicUUID) {
          indicateCharacteristic = res.characteristics[i]
        }
        if (res.characteristics[i].uuid == params.writeCharacteristicUUID) {
          writeCharacteristic = res.characteristics[i]
        }
      }
      // getWriteBLEDeviceCharacteristics();
      console.log("唤醒特征值 :", notifyCharacteristic)
      console.log("特征值列表 :", res.characteristics)
      // getWriteBLEDeviceCharacteristics(params)
      initNotifyListener(params);
    }
  })
}
function getWriteBLEDeviceCharacteristics(params) {
  wx.getBLEDeviceCharacteristics({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: currentDevice.deviceId + "",
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: writeService.uuid + "",
    success: function (res) {
      console.log("写入特征值获取成功：")
      console.log('device getBLEDeviceCharacteristics:', res.characteristics)
      for (var i = 0; i < res.characteristics.length; i++) {
        if (res.characteristics[i].uuid == params.writeCharacteristicUUID) {
          writeCharacteristic = res.characteristics[i]
        }
      }
      console.log("xieru :", writeCharacteristic)
      initNotifyListener(params);
    }
  })
}
/**
*
* 连接成功后，初始化回调监听
*
* 启用低功耗蓝牙设备特征值变化时的 notify 功能。注意：\
* 必须设备的特征值支持notify才可以成功调用，具体参照 characteristic 的 properties 属性
*/
function initNotifyListener(params) {
  wx.notifyBLECharacteristicValueChanged({
    deviceId: currentDevice.deviceId + "",
    serviceId: notifyService.uuid + "",
    characteristicId: params.notifyCharacteristicUUID + "",
    state: true,
    success: function (res) {
      console.log(`开启监听成功${res.errMsg}`);
      // setTimeout( ()=> {
      //   onConnectCallback('ok');// 连接成功后，初始化回调监听回调
      //   sendCmd(params.sendCommend, params.onSuccessCallBack, params.onFailCallBack,params.key);
      // }, 200);
      //获取令牌并开锁
      gettoken()
    },
    fail: function (res) {
      console.log("开启监听失败" + res.errMsg);
      params.onFailCallBack("开启监听失败");
    }
  });
  onBLECharacteristicValueChange();
}
/**
* 启用低功耗蓝牙设备特征值变化时的 notify 功能。注意：
* 必须设备的特征值支持notify才可以成功调用，具体参照 characteristic 的 properties 属性
*/
function onBLECharacteristicValueChange() {
  wx.onBLECharacteristicValueChange((res) => {
    console.log(`characteristic ${res.characteristicId} has changed, now is ${bleUtils.arrayBuffer2HexString(res.value)}`);
    onSendSuccessCallBack(bleUtils.arrayBuffer2HexString(res.value));
    var readdata = wx.arrayBufferToBase64(res.value)
    wx.request({
      url: 'https://www.rocolock.com/aes.aspx',
      data: {
        cmd: 'updata', data: readdata, uid: currentDevice.deviceId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res)=> {
        if (res.data.cmd == "show") {
          
        }
      }
    })
  })
}
/**
* 发送指令，不关心指令具体长度
* @param commond 指令
* @param onSuccess 指令执行成功回调
*/
function sendCmd(commond, onSuccess, onFailCallback,key) {
  var sendCommonds = crc.getCRCCmd(commond);//对commond的CRC处理必须放在这里
  if (typeof onSuccess == 'undefined') {
    onSuccess = function (result) { }
  }
  onSendSuccessCallBack = onSuccess;
  sendCmds(sendCommonds, 0, onFailCallback,key);
}
/**
*
* 逐条发送指令
*/
function sendCmds(commond, index, onFailCallback) {
  var itemCmd;
  var isLast = false;// 判断是否是最后一条
  if (commond.length > index + 40) {
    itemCmd = commond.substr(index, 40);
  } else {
    isLast = true;
    itemCmd = commond.substr(index);
  }
  writeCommendToBle(itemCmd, function (errMsg) {
    if (errMsg == 'ok' && !isLast) { // 发送成功并且不是最后一条时，执行下一条
      sendCmds(commond, index + 40);
    }
  }, onFailCallback)
}

// 向蓝牙中写入数据（ble蓝牙）(增加指纹)
function writeCommendToBle(commonds, onSendCallback, onFailCallback,key) {
  var commond = commonds;
  console.log("commond ：" + commond)
  commond = aes.aesEncrypt(commond, key)
  console.log('加密后的数据', commond)
  let buffer = bleUtils.hexString2ArrayBuffer(commond);
  console.log(`执行指令:${bleUtils.arrayBuffer2HexString(buffer)}`);
  getBLEinfo()
  wx.writeBLECharacteristicValue({
    deviceId: currentDevice.deviceId + "",
    serviceId: writeService.uuid + '',
    characteristicId: writeCharacteristic.uuid + '',
    // 这里的value是ArrayBuffer类型
    value: buffer,
    success: function (res) {
      console.log('发送指令成功')
      console.log('writeBLECharacteristicValue success', res.errMsg)
      onSendCallback('ok');
      // getBLEinfo()
    },
    fail: function (res) {
      console.log(`执行指令失败${res.errMsg}`);
      onFailCallback("执行指令失败");
    }
  })
}

//发送消息(获取令牌)
function gettoken(){
  wx.request({
    url: 'https://www.rocolock.com/aes.aspx',
    data: {
      cmd: 'gettoken', uid: currentDevice.deviceId
    },
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log('获取令牌成功-----', res.data.data)
      if (res.data.cmd == "send") {
        var buffer = wx.base64ToArrayBuffer(res.data.data)
        wx.writeBLECharacteristicValue({
          deviceId: deviceId,
          serviceId: serviceId,
          characteristicId: characteristicIdW,
          value: buffer,
          success: function (res) {
            console.log('发送令牌成功-----',res.errMsg)
            //开锁
            open()
          }
        })
      }
    }
  })
}

//开锁指令
function open(){
  wx.request({
    url: 'https://www.rocolock.com/aes.aspx',
    data: {
      cmd: 'open', uid: currentDevice.deviceId
    },
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log('获取开锁指令------', res.data.data)
      if (res.data.cmd == "send") {
        var buffer = wx.base64ToArrayBuffer(res.data.data)
        wx.writeBLECharacteristicValue({
          deviceId: deviceId,
          serviceId: serviceId,
          characteristicId: characteristicIdW,
          value: buffer,
          success: function (res) {
            console.log('写入开锁指令成功----', res.errMsg)
          }
        })
      }
    }
  })
}



//接收消息
function getBLEinfo() {
  var that = this;
  // 必须在这里的回调才能获取
  wx.onBLECharacteristicValueChange(function (characteristic) {
    console.log('发生变法的特征值------', characteristic)
    let hex = bleUtils.arrayBuffer2HexString(characteristic.value)
    console.log(hex)
  })
  wx.readBLECharacteristicValue({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: currentDevice.deviceId + "",
    // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    serviceId: writeService.uuid + "",
    // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
    characteristicId: indicateCharacteristic.uuid + "",
    success: function (res) {
      console.log('readBLECharacteristicValue:', res.errMsg);
    }
  })
}