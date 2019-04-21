/** 
 * ajax公用方法
 */
function ajax(options) {
  let app = getApp()
  options.loading && wx.showLoading({
    title: '加载中...',
    icon: 'loading'
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      method: options.method,
      header: { 'content-type': 'application/json;charset=utf-8', ...options.header, ticket: (app.globalData.loginUserInfo && app.globalData.loginUserInfo.id) || (wx.getStorageSync('loginUserInfo') && wx.getStorageSync('loginUserInfo').id) },
      data: options.data,
      success: (res) => {
        if (res.statusCode !== 200 || res.data.code !== 100) {
          wx.showToast({
            title: '操作异常' + res.data.code,
            icon: 'none'
          })
          reject(res.data)
          return
        }
        resolve(res.data)
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      },
      complete: () => {
        options.loading && wx.hideLoading()
      }
    })
  })
}
export default ajax