// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 页面跳转到newOrder
   */
  toNewOrder:function(){
    wx.navigateTo({
      url: '../newOrder/newOrder',
    })
  }
})