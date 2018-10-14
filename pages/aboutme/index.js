// pages/aboutme/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    company_name:'深圳市梦宝智能科技有限公司',
    phone:'0755-25320456',
    customer_phone:'0755-83667270  0755-83667199',
    address:'深圳市福田区八卦四路5号索泰克大厦四楼A区',
    email:'3523545862@qq.com',
    content:'    深圳市梦宝智能科技有限公司是一家专注于空间规划，服务提升，服务大众，便利大众的综合型专业型科技公司。公司有一支经验丰富、理念先进的管理团队，吸取国内外各方先进的理念和方案，结合国内特点进行优化和提升，以更专业更优秀的服务回馈大众。\n    梦宝智能科技关注到现有医护服务及环境的提升、白领午间休息问题，独立开发出一款用于此环境使用的休息柜床，以现在最流行的共享理念服务社会，为用户提供人性化、便利化的分时租赁服务，想用户之所想，急用户之所急，全方位推进服务，用不断创新为客户提供更好的服务。'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.content = this.data.content.replace(/\n/g, '@@!!')
    this.data.content = this.data.content.replace(/\s/g,'&nbsp;')
    this.data.content = this.data.content.replace(/@@!!/g, '\n')
    this.setData({
      content: this.data.content
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})