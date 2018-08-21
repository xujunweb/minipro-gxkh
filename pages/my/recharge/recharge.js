// pages/my/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyList:[
      {
        money:5,
        select:true
      },
      {
        money: 10,
        select: false
      },
      {
        money: 20,
        select: false
      },
      {
        money: 30,
        select: false
      },
      {
        money: 50,
        select: false
      },
      {
        money: 100,
        select: false
      }
    ],
    selectMoney:5
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
  //选择金额
  select:function(e){
    var index = e.target.dataset.index
    for (var i = 0, len = this.data.moneyList.length;i<len;i++){
      this.data.moneyList[i].select = false
    }
    this.data.moneyList[index].select = true
    this.data.selectMoney = this.data.moneyList[index].money
    this.setData({
      moneyList: this.data.moneyList
    })
  }
})