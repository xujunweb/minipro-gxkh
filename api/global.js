import ajax from '../utils/ajax.js'

//获取openid
export const getOpenId = (data)=>{
  return ajax({
    url: wx.envConfig.host + 'pay/wx/getWeixinUserInfo',
    data: {...data},
    method: 'post',
  })
}

//根据用户ID(ticket)获取用户信息
export const getNewUserInfo = (data)=>{
  return ajax({
    url: wx.envConfig.host + 'user/getUserInfo',
    data: { ...data },
    method: 'post',
  })
}
//
export const userUpdate = (data) => {
  return ajax({
    url: wx.envConfig.host + 'user/update',
    data: { ...data },
    method: 'post',
  })
}