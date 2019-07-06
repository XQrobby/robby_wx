// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options){
    const app = getApp();
    this.setData({
      clientInfo: app.globalData.clientInfo,
      clientInfoP: app.globalData.clientInfoP
    })
  },
  onShow:function(){
    this.onLoad()
  },
  toChangeClientInfo:function(){
    wx.navigateTo({
      url: '../changeClientInfo/changeClientInfo',
    })
  }
})