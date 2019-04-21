import ajax from '../utils/ajax.js'

//获取代理商订单列表
export const getOrderList = (data) => {
  return ajax({
    url: wx.envConfig.host + 'lockOrder/pageByLockOrder',
    data: { ...data },
    method: 'post',
    loading:true,
  })
}

//获取代理商设备列表
export const getDeviceList = (data) => {
  return ajax({
    url: wx.envConfig.host + 'lockInfo/pageByLockInfo',
    data: { ...data },
    method: 'post',
    loading: true,
  })
}