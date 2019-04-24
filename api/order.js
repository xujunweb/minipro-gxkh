import ajax from '../utils/ajax.js'
//获取代理商订单列表
export const getOrderList = (data) => {
  var app = getApp()
  return ajax({
    url: wx.envConfig.host + 'lockOrder/pageByLockOrder',
    data: { ...data, agency_user_id: app.globalData.loginUserInfo.id },
    method: 'post',
    loading:true,
  })
}

//获取代理商设备列表
export const getDeviceList = (data) => {
  var app = getApp()
  return ajax({
    url: wx.envConfig.host + 'lockInfo/pageByLockInfo',
    data: { ...data, user_id: app.globalData.loginUserInfo.id },
    method: 'post',
    loading: true,
  })
}