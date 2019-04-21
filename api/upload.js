
//上传文件
export const uploadFile = ({ filePath, name, formData,url}) => {
  var app = getApp()
  return new Promise((resolve, reject)=>{
    wx.uploadFile({
      url: wx.envConfig.host + (url || 'file/upload'),
      filePath: filePath,
      name: name,
      formData: { ...formData},
      header: {
        ticket: app.globalData.userInfo.id
      },
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}