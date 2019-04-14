// pages/orderList/orderList.js
var config_js = require('../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    var url = config_js.basehost+config_js.urlpatterns.orderList,
      that = this;
    wx.request({
      url: url,
      method: 'POST',
      header: { "Content-type": config_js.requestHeader },
      data: {
        unionCode: app.globalData.userInfoP.unionCode,
        code: app.globalData.code,
        showCount: this.data.showCount
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          orders_: res.data.orders,
          showCount: that.data.showCount+res.data.orders.length
        })
      }
    })
  },
})