var app = getApp()
var currentDevice = {};//ble设备
var indicateCharacteristic = {};//唤醒特征值
var writeService = {};//写入服务
var notifyService = {}
var writeCharacteristic = null;//写入特征值
var notifyCharacteristic = null;//唤醒特征值
var onSendSuccessCallBack = undefined;//成功回调
var onFailCallBack = undefined; //失败回调
var onConnectCallback = undefined;// 链接回调
var bleUtils = require('strUtils.js');
var isConnected = false;//是否已链接
var token = ''
var seachNum = 0
var password = '303030303030'
module.exports = {
  writeCommend: writeCommend,
  closeBLEConnection: closeBLEConnection,
  writeCommendToBle: writeCommendToBle
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
  onSendSuccessCallBack = params.onSendSuccessCallBack
  onFailCallBack = params.onFailCallBack
  writeCharacteristic = params.writeCharacteristicUUID
  openBluetoothAdapter(params);
}

//获取已经链接的设备列表
function getConnectedBluetoothDevices(params){
  wx.getConnectedBluetoothDevices({
    services: params.services,
    success:(res)=>{
      console.log('已经链接的设备-----',res.devices)
    }
  })
}
/**
* 监控链接状态
*/
function setConnectionStateChange(callback) {
  console.log('监控链接状态')
  wx.onBLEConnectionStateChange(function (res) {
    // 该方法回调中可以用于处理连接意外断开等异常情况
    console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
    // callback(res)
    // return res.connected;
  });
}
/**
 * 获取本机蓝牙适配器状态
 */
function getBluetoothAdapterState(callback){
  wx.getBluetoothAdapterState({
    success:(res)=>{
      callback(res)
    }
  })
}
/**
* 初始化蓝牙适配器
*/
function openBluetoothAdapter(params) {
  getBluetoothAdapterState((res)=>{
    if (!res.available){
      wx.openBluetoothAdapter({
        success: function (res) {
          console.log("初始化蓝牙适配器成功")
          console.log(res)
          startBluetoothDevicesDiscovery(params)
        }, fail: function (res) {
          console.log("初始化蓝牙适配器失败")
          params.onFailCallBack('1')
          console.log(res);
          return
        },
        complete: function (res) {
          console.log(res);
        }
      })
    }else {
      startBluetoothDevicesDiscovery(params)
    }
  })

  
}
/**
* 开始搜寻附近的蓝牙外围设备。注意，该操作比较耗费系统资源，请在搜索并连接到设备后调用 stop 方法停止搜索。
* @ params services:['4asdga'],根据主ServiceUUID进行搜索特定蓝牙，提高搜索效率
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
      return
    }
    else {
      console.log("搜索设备超时");
      seachNum++
      if (seachNum < 3){
        startBluetoothDevicesDiscovery(params, connectCallback)
      }else{
        params.onFailCallBack("3")
        stopBluetoothDevicesDiscovery();
      }
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
      params.onFailCallBack('2')
      return
    },
    complete: function (res) {
      // complete
      console.log(res);
    }
  })
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
        if (res.devices[i].localName === 'k06_YPP'){
          stopBluetoothDevicesDiscovery();
          isFound = true
          // clearInterval(delayTimer)
          currentDevice = res.devices[i]
          createBLEConnection(params)
        }
      }
    },
    fail: function (res) {
      // clearInterval(delayTimer)
      console.log("没有搜索到要链接的设备....")
      console.log(res)
      params.onFailCallBack("4")
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
  //监控连接状态
  setConnectionStateChange();
  isConnected = false
  setTimeout(function () {
    if (isConnected) return;
    console.log("连接设备超时");
    params.onFailCallBack("5")
    return
  }, 5000)
  wx.createBLEConnection({
    // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    deviceId: currentDevice.deviceId + "",
    timeout:5000,
    success: function (res) {
      console.log(res)
      console.log(`连接成功 : ${currentDevice.deviceId}`)
      isConnected = true
      getBLEDeviceServices(params);
    }, fail: function (res) {
      console.log(res)
      params.onFailCallBack('6')
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
      // initNotifyListener(params);
      getNotifyBLEDeviceCharacteristics(params)
    },
    fail:(res)=>{
      params.onFailCallBack('7')
    }
  })
}
/**
* 获取蓝牙设备唤醒characteristic（特征值）(不是必要操作)
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
        // if (res.characteristics[i].uuid == params.indicateCharacteristicUUID) {
        //   indicateCharacteristic = res.characteristics[i]
        // }
        // if (res.characteristics[i].uuid == params.writeCharacteristicUUID) {
        //   writeCharacteristic = res.characteristics[i]
        // }
      }
      // console.log("唤醒特征值 :", notifyCharacteristic)
      // console.log("特征值列表 :", res.characteristics)
      initNotifyListener(params);
    },
    fail:()=>{
      params.onFailCallBack('8')
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
      setTimeout(()=>{
        writeCommendToBle(params.sendCommend, params)
      },200)
    },
    fail: function (res) {
      console.log("开启监听失败" + res.errMsg);
      // params.onFailCallBack("9");
      setTimeout(() => {
        writeCommendToBle(params.sendCommend, params)
      }, 200)
    }
  });
  onBLECharacteristicValueChange();
}
/**
* 发送指令，不关心指令具体长度
* @param commond 指令
* @param onSuccess 指令执行成功回调
*/
function sendCmd(commond, onSuccess, onFailCallback,key) {
  var sendCommonds = commond
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
    // itemCmd = commond.substr(index);
    itemCmd = commond
  }
  writeCommendToBle(itemCmd, function (errMsg) {
    if (errMsg == 'ok' && !isLast) { // 发送成功并且不是最后一条时，执行下一条
      sendCmds(commond, index + 40);
    }
  }, onFailCallback)
}
// 向蓝牙中写入数据（ble蓝牙）
function writeCommendToBle(commonds) {
  var commond = commonds;
  console.log("commond ：" + commond)
  postAES(commond).then((res)=>{
    console.log('加密后的数据', res.data.data)
    let buffer = bleUtils.hexString2ArrayBuffer(res.data.data);
    console.log(`执行指令:${bleUtils.arrayBuffer2HexString(buffer)}`);
    wx.writeBLECharacteristicValue({
      deviceId: currentDevice.deviceId + "",
      serviceId: writeService.uuid + '',
      characteristicId: writeCharacteristic + '',
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success: function (res) {
        console.log('发送指令成功')
        console.log('writeBLECharacteristicValue success', res.errMsg)
        // onSendCallback('ok');
      },
      fail: function (res) {
        console.log(`执行指令失败${res.errMsg}`);
        onFailCallBack("10");
      }
    })
  })
}

//加密请求
function postAES(data){
  return app.ajaxSubmit({
    url: wx.envConfig.host + 'anon/common/encrypt',
    method: 'post',
    isHideLoading:true,
    data: { encrypt:data},
    header: {
      ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
    }
  })
}

//解密请求
function postAESdecrypt(data) {
  return app.ajaxSubmit({
    url: wx.envConfig.host + 'anon/common/decrypt',
    method: 'post',
    isHideLoading: true,
    data: { decrypt: data },
    header: {
      ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
    }
  })
}

/**
* 启用低功耗蓝牙设备特征值变化时的 notify 功能。注意：
* 必须设备的特征值支持notify才可以成功调用，具体参照 characteristic 的 properties 属性
*/
function onBLECharacteristicValueChange() {
  wx.onBLECharacteristicValueChange((res) => {
    var hexStr = bleUtils.arrayBuffer2HexString(res.value)
    console.log(`characteristic ${res.characteristicId} has changed, now is ${hexStr}`);
    //解密请求
    postAESdecrypt(hexStr.substr(0, 32)).then((res) => {
      console.log('解密之后的数据-------', res.data.data)
      if (res.data.data) {
        if (res.data.data.substr(0, 4) === '0602') {
          token = res.data.data.substr(6, 8)
          var open = '050106' + password + token + '000000'
          //发送开锁指令
          writeCommendToBle(open)
        }
        //获取GMI信息
        if (res.data.data.substr(0, 6) === '052306') {
          currentDevice.msgId = res.data.data.substr(7, 16)
          currentDevice.open = '050106' + password + token + '000000'
          onSendSuccessCallBack(currentDevice)
        }
        //开锁结果
        if (res.data.data.substr(0, 6) === '050201'){
          if (res.data.data.substr(7, 9) == '00') {   //开锁成功 
            //发送获取GSMID指令
            var gsm = '05230100' + token + '0000000000000000'
            writeCommendToBle(gsm)
          }else{
            //开锁失败
            onFailCallBack("11");
          }
        }
      }
    })
  })
}



