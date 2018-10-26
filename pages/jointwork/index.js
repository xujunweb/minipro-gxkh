// pages/jointwork/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content: '    深圳梦宝智能科技有限公司欢迎您的加入！成为我们项目的合作伙伴！共享共赢！创造共赢未来。\n\n    深圳梦宝康护智能陪护柜床是我司运用物联网技术开发的一款物联网智能专利产品，用于医院陪护、白领午休时租赁使用的智能柜床。'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.content = this.data.content.replace(/\n/g, '@@!!')
    this.data.content = this.data.content.replace(/\s/g, '&nbsp;')
    this.data.content = this.data.content.replace(/@@!!/g, '\n')
    this.setData({
      content: this.data.content
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {}
})