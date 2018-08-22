// pages/progress/progress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress:0
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
    this.next()
  },
  //进度条增加
  next:function(){
    var that = this;
    if(this.data.progress >= 100){
        this.setData({
            disabled: false
        });
        return true;
    }
    this.setData({
        progress: ++this.data.progress
    });
    setTimeout(function(){
        that.next()
    }, 50);
  }
})