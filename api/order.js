import ajax from '../utils/ajax.js'
var acc = [100000003, 100000009, 100000001 ]
//获取代理商订单列表
export const getOrderList = (data) => {
  var app = getApp()
  var agency_user_id = app.globalData.loginUserInfo.id
  if (acc.indexOf(app.globalData.loginUserInfo.id)>-1){
    agency_user_id = ''
  }
  return ajax({
    url: wx.envConfig.host + 'lockOrder/pageByLockOrder',
    data: { ...data, agency_user_id: agency_user_id },
    method: 'post',
    loading:true,
  })
}

//获取代理商设备列表
export const getDeviceList = (data) => {
  var app = getApp()
  var user_id = app.globalData.loginUserInfo.id
  if (acc.indexOf(app.globalData.loginUserInfo.id) > -1) {
    user_id = ''
  }
  return ajax({
    url: wx.envConfig.host + 'lockInfo/pageByLockInfo',
    data: { ...data, user_id: user_id },
    method: 'post',
    loading: true,
  })
}
//统计订单数据
export const sumByLockOrder = (data) => {
  var app = getApp()
  var agency_user_id = app.globalData.loginUserInfo.id
  if (acc.indexOf(app.globalData.loginUserInfo.id) > -1) {
    agency_user_id = ''
  }
  return ajax({
    url: wx.envConfig.host + 'lockOrder/sumByLockOrder',
    data: { ...data, agency_user_id: agency_user_id },
    method: 'post',
  })
}