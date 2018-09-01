var app = getApp();
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLayer: false, //展示登录弹窗层
    codeText: '获取验证码',
    isLogin: false, //登录按钮是否可点击
    phone: '', //手机号码
    code: '', //验证码
    uuid: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  //手机号验证码登录
  showPhoneLogin: function () {
    this.setData({ showLayer: true });
  },
  /**
   * 微信快捷登录
   */
  getPhoneNumber: function (e) {
    var that = this;
    const { iv, encryptedData, errMsg } = e.detail
    console.log(errMsg)
    console.log(iv)
    console.log(encryptedData)
    if (errMsg == 'getPhoneNumber:fail user deny' ||
      errMsg == 'getPhoneNumber:fail 该 appid 没有权限' ||
      errMsg == 'getPhoneNumber:fail:cancel to bind phone' ||
      errMsg == 'getPhoneNumber:fail:cancel to confirm login' ||
      errMsg == 'getPhoneNumber:fail:user cancel' ||
      errMsg == 'getPhoneNumber:fail 用户绑定的手机需要进行验证，请在客户端完成短信验证步骤') {
      return;
    }
    if (!iv || !encryptedData) {
      wx.showToast({
        title: '该小程序不支持快捷登录，请使用验证码登录', icon: 'none'
      })
      return;
    }
    wx.showLoading({ title: '加载中...',mask:true })
    wx.login({
      success: function (data) {
        var params = {
          encryptedData: encryptedData,
          iv: iv,
          code: data.code ? data.code : '',
          openId: app.globalData.openid
        }
        wx.request({
          url: app.globalData.shopMHost + 'xcx/member/wechat/phone/decrypt',
          method: "post",
          data: params,
          header: { 
            'content-type': 'application/json',
            ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
          },
          success: (res) => {
            wx.hideLoading();
            console.log('xcx/member/wechat/phone/decrypt', res.data)
            if (res.data.code != '000000') {
              return
            }
            var data = res.data.data;
            //将会员信息存入本地
            if (data.sessionId) {
              wx.setStorageSync('memberCardInfo', data);
            }
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({
              title: '网络连接失败', icon: 'none'
            })
          }
        })
      }
    })
  },
  /**
   * 手机号码输入监听
   */
  phoneChange: function (e) {
    let phone = e.detail.value;
    this.setData({ phone, isLogin: phone && this.data.code })
  },
  /**
   * 验证码输入监听
   */
  codeChange: function (e) {
    let code = e.detail.value;
    this.setData({ code, isLogin: code && this.data.phone });
  },
  //发送验证码
  sendCode: function () {
    if (this.data.codeText != '获取验证码') return;
    var phone = this.data.phone;
    if (!/^1[3578]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号码', icon: 'none'
      })
      return;
    }
    var that = this;
    this.data.uuid = util.getUUID()
    console.log(this.data.uuid)
    var params = {
      templateCode: 'SMS_142590006',
      phoneNumbers: this.data.phone,
      randomKey: this.data.uuid
    }
    wx.request({
      url: wx.envConfig.host + 'anon/common/sendVerifyCode',
      data: params,
      method: 'POST',
      success: (res) => {
        console.log('发送验证码--------', res)
        wx.showToast({
          title: '验证码已发送', icon: 'none'
        })
        that.countdown(60);
      }
    })
  },
  //倒计时
  countdown: function (second) {
    var that = this;
    this.setData({ codeText: '重新获取(' + second + 's)' });
    setTimeout(() => {
      second--;
      if (second == 0) {
        that.setData({ codeText: '获取验证码' });
      } else {
        that.countdown(second);
      }
    }, 1000);
  },
  /**
   * 提交手机号进行绑定
   */
  submitBind: function () {
    var that = this;
    if (!that.data.isLogin) return;
    let { phone, code } = this.data;
    if (!/^1[3578]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号码', icon: 'none'
      })
      return;
    }
    wx.showLoading({ title: '加载中...', mask: true })
    var data = {
      randomKey: this.data.uuid,
      phone: phone,
      validCode: code
    }
    wx.request({
      url: wx.envConfig.host + 'user/bindPhone',
      data: data,
      method: 'POST',
      header: {
        ticket: app.globalData.loginUserInfo.id || wx.getStorageSync('loginUserInfo')
      },
      success: (res) => {
        console.log('绑定手机号--------', res)
        if (res.data.data) {
          wx.redirectTo({
            url: '/pages/borrow/borrow'
          })
        }
      }
    })
  },
  /**
   * 绑定手机号码后跳转 
   */
  submitNavigator: function () {
    wx.showToast({ title: '登录成功' })
    wx.redirectTo({
      url: '/pages/borrow/borrow'
    })
  },
  /**
   * 关闭弹窗
   */
  closeLayer: function () {
    this.setData({ showLayer: false });
  },
  //协议
  readXieyi(){
    wx.showModal({
      title:'梦宝康护陪护床用户协议',
      content:' 请在注册成为梦宝康护陪护床用户之前，务必认真阅读《梦宝智能陪护床用户协议》及相关附属协议（以下简称为：“本协议”）。',
      showCancel:false,
      confirmText:'确定已阅',
      confirmColor:'#E85B96',
      success: (confirm)=>{
        
      }
    })
  }
})