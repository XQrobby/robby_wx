var config_js = require('../config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindDisabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  order: function (orderID) {
    var that = this;
    wx.request({
      url: config_js.basehost + config_js.urlpatterns.order,
      method: 'POST',
      header: { "Content-type": config_js.requestHeader },
      data: {
        orderID: orderID,
        unionCode: app.globalData.clientInfoP.unionCode,
        code: app.globalData.code,
      },
      success: function (res) {
        if (res.data.status) {
          var order = res.data.order,
            repairButton = that.data.repairButton
          console.log('order:data', order)
          that.setData({
            order: res.data.order,
            bindDisabled: true,
          })
        }
        if (that.orderCallback) {
          console.log('函数回调')
          that.orderCallback(order)
        }
      },
    })
  },
  onLoad: function (options) {
    var that = this
    console.log('order:onLoad')
    var orderID = String(options.orderID)
    this.order(orderID)
    if (!this.data.order) {
      this.orderCallback = order => {
        this.setData({
          order: order,
          bindDisabled: true
        })
      }
    }
  },
  onShow: function () {
    console.log('order:onShow')
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
              unionCode: app.globalData.clientInfoP.unionCode,
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
  toOrderCheck:function(){
    var orderID = this.data.order.orderID
    wx.navigateTo({
      url: '../orderCheck/orderCheck?orderID='+orderID,
    })
  }
})