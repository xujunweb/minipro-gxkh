// pages/my/deposit/deposit.js
var app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,       //支付开启
    showLayer: false, //展示登录弹窗层
    codeText: '获取验证码',
    isLogin: false, //登录按钮是否可点击
    phone: '', //手机号码
    code: '', //验证码
    uuid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  //跳转进度条
  
  //手机号验证码登录
  showPhoneLogin: function () {
    this.setData({ showLayer: true });
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
    this.data.uuid = util.getUUID()
    console.log(this.data.uuid)
    var that = this;
    var params = {
      templateCode: 'SMS_142590006',
      phoneNumbers:this.data.phone,
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

    app.getNewOpenId(function (openId) {

      var data = {
        openId: app.globalData.openid,
        orgId: app.globalData.orgId,
        phone: phone,
        validCode: code,
        xcxId: app.globalData.xcxId
      }

      loginM({
        ele: that,
        data: data,
        fn: function (res) {
          that.submitNavigator(); //下一步跳转逻辑
        }
      });
    });
  },
  /**
   * 绑定手机号码后跳转 
   */
  submitNavigator: function () {

    wx.showToast({ title: '登录成功' })

    var that = this;
    setTimeout(function () {
      wx.redirectTo({
        url: '/subPackage/vipCenter/pages/index/index?firstLogin=' + that.data.firstLogin
      })
    }, 10);
  },
  /**
   * 关闭弹窗
   */
  closeLayer: function () {
    this.setData({ showLayer: false });
  }
})