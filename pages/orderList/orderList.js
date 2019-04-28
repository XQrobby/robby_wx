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
    const app = getApp();
    var that = this;
    wx.request({
      url: config_js.basehost + config_js.urlpatterns.orderList,
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
          orders: res.data.orders,
          showCount: that.data.showCount+res.data.orders.length
        })
      }
    })
  },
  onShow: function(){
    this.setData({
      showCount: 0
    })
    this.onLoad()
    /*
    var that = this;
    const app = getApp();
    if(app.globalData.haveNewOrder){
      wx.request({
        url: config_js.basehost + config_js.urlpatterns.orderList,
        method: 'POST',
        header: { "Content-type": config_js.requestHeader },
        data: {
          unionCode: app.globalData.userInfoP.unionCode,
          code: app.globalData.code,
          showCount: this.data.showCount
        },
        success: function (res) {
          if (res.data.orders.length) {
            var orders_ = that.data.orders_.concat(res.data.orders);
            that.setData({
              orders_: orders_,
              orders: orders_,
              showCount: that.data.showCount + res.data.orders.length
            })
            app.globalData.haveNewOrder = false;
          }
        }
      })
    }
    */
  },
  toOrder:function(e){
    var orderID = this.data.orders[e.currentTarget.dataset.index].orderID;
    wx.navigateTo({
      url: '../order/order?orderID='+orderID
    })
  }
})