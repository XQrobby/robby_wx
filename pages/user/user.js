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
      userInfo: app.globalData.userInfo,
      userInfoP: app.globalData.userInfoP
    })
  },
  onShow:function(){
    this.onLoad()
  },
  toChangeUserInfo:function(){
    wx.navigateTo({
      url: '../changeUserInfo/changeUserInfo',
    })
  }
})