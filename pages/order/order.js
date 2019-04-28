// pages/order/order.js
var config_js = require('../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp();
    var orderID = String(options.orderID),
      that = this;
    wx.request({
      url: config_js.basehost + config_js.urlpatterns.order,
      method: 'POST',
      header: { "Content-type": config_js.requestHeader },
      data: {
        orderID:orderID, 
        unionCode: app.globalData.userInfoP.unionCode,
        code: app.globalData.code,
      },
      success:function(res){
        if(res.data.status){
          that.setData({
            order:res.data.order,
          })
        }
      }
    })
  },
  cancel:function(e){
    const app = getApp();
    var that = this;
    if (this.data.order.orderStatus=='审核中'){
      wx.showModal({
        title: '撤销订单',
        content: '确定撤销该订单？',
        success:function(){
          wx.request({
            url: config_js.basehost + config_js.urlpatterns.cancel,
            method: 'POST',
            header: { "Content-type": config_js.requestHeader },
            data: {
              orderID: that.data.order.orderID,
              unionCode: app.globalData.userInfoP.unionCode,
              code: app.globalData.code,
            },
            success: function (res) {
              if (res.data.status) {
                wx.showToast({
                  title: '撤销成功',
                  duration: 2000
                })
              }
            }
          })
        }
      })
    }
  },
  remark:function(){

  }
})