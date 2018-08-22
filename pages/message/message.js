var app = getApp();
// import { phoneValidCodeM } from '../../../../components/model/my/my_m'; //会员卡开关
// import { loginM } from '../../components/model/member_m';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orgLogo: '', //门店logo
    orgName: '', //门店名字
    showLayer: false, //展示登录弹窗层
    codeText: '获取验证码',
    isLogin: false, //登录按钮是否可点击
    phone: '', //手机号码
    code: '', //验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
  },
  //手机号验证码登录
  showPhoneLogin: function () {
    this.setData({ showLayer: true });
  },
  /**
   * 微信快捷登录
   */
  getPhoneNumber: function (e) {

    var that = this;
    const { iv, encryptedData, errMsg } = e.detail;

    console.log(errMsg)
    console.log(iv)
    console.log(encryptedData);

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

    wx.showLoading({ title: '加载中...' });

    wx.login({
      success: function (data) {

        var params = {
          encryptedData: encryptedData,
          iv: iv,
          code: data.code ? data.code : '',
          openId: app.globalData.openid,
          xcxId: app.globalData.xcxId,
          orgId: app.globalData.orgId
        }

        wx.request({
          url: app.globalData.shopMHost + 'xcx/member/wechat/phone/decrypt',
          method: "post",
          data: params,
          header: { 'content-type': 'application/json' },
          success: (res) => {

            wx.hideLoading();
            console.log('xcx/member/wechat/phone/decrypt', res.data)
            if (res.data.code != '000000') {

              // wx.showToast({
              //   title: res.data.msg, icon: 'none'
              // })
              return;
            }

            var data = res.data.data;

            that.setData({
              balance: data.balance,
              cardNo: data.cardNo,
              id: data.id,
              showLayer: false,
              firstLogin: data.firstLogin,
            });

            //将会员信息存入本地
            if (data.sessionId) {
              wx.setStorageSync('memberCardInfo', data);
            }
            that.submitNavigator(); //下一步跳转逻辑
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
    phoneValidCodeM({
      ele: that,
      data: { phone: phone },
      fn: function () {
        wx.showToast({
          title: '验证码已发送', icon: 'none'
        })
        that.countdown(60);
      }
    });

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