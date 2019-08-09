// pages/orderList/orderList.js
var config_js = require('../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCount: 0,
    //导航栏
    filterItems: [
      { 'status': '全部', 'style': "color:#2791fe;box-shadow: 0 1px 0 #2791fe;" },
      { 'status': '处理中', 'style': 'color: #d4d4d4;' },
      { 'status': '维修中', 'style': 'color: #d4d4d4;' },
      { 'status': '已完修', 'style': 'color: #d4d4d4;' },
      { 'status': '已验收', 'style': 'color: #d4d4d4;' },
    ],
    //订单
    orders_: [
      { 'orderID': '1', 'serviceType': "2", 'faultDescription': "3", 'orderStatus': "处理中" },
      { 'orderID': '1', 'serviceType': "2", 'faultDescription': "3", 'orderStatus': "已验收" },
    ],
    orders: [
      { 'orderID': '1', 'serviceType': "2", 'faultDescription': "3", 'orderStatus': "处理中" },
      { 'orderID': '1', 'serviceType': "2", 'faultDescription': "3", 'orderStatus': "已验收" },
    ],
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
        unionCode: app.globalData.clientInfoP.unionCode,
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
          unionCode: app.globalData.clientInfoP.unionCode,
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
  selected: function (index) {
    var that = this;
    var list = that.data.filterItems,
      i = 0,
      sty0 = 'color: #d4d4d4;',
      sty1 = 'color:#2791fe;box-shadow: 0 1px 0 #2791fe;';
    for (i; i < 5; i++) {
      if (list[i].style != sty0) {
        list[i].style = sty0;
        break;
      }
    }
    list[index].style = sty1;
    that.setData({
      filterItems: list
    })
  },
  filter: function (e) {
    var that = this,
      orders_ = that.data.orders_,
      index = e.currentTarget.dataset.index,
      filterItems = that.data.filterItems;
    var orders = orders_.filter(function (order) {
      if (index == 0) {
        return order
      }
      else return order.status == filterItems[index].status
    });
    this.selected(index)
    that.setData({
      orders: orders,
      filterItemsMode: index
    })
  },

  toOrder:function(e){
    var orderID = this.data.orders[e.currentTarget.dataset.index].orderID;
    wx.navigateTo({
      url: '../order/order?orderID='+orderID
    })
  },

  orders_add: function (e) {
    const app = getApp()
    var that = this;
    var index = that.data.index + 1,
      count = that.data.count;
    wx.request({
      url: app.globalData.host + 'PCfix/orders/',
      data: {
        openid: app.globalData.openid,
        isRepairGuy: app.globalData.userInfo2.isRepairGuy,
        count: count,
        index: index
      },
      method: 'POST',
      header: { "Content-type": "application/x-www-form-urlencoded" },
      success: function (res) {
        try {
          var orders_add_ = res.data.map(function (order) {
            if (order.isCheck) {
              order.status = '已验收'
            } else if (order.isComplete) {
              order.status = '已完修'
            } else {
              order.status = '维修中'
            }
            order.image = app.globalData.host + order.image
            return order
          });
          var orders_add = orders_add_.filter(function (order) {
            if (index == 0) {
              return order
            }
            else return order.status == that.data.filter[index].status
          });
          var orders_ = that.data.orders_,
            orders = that.data.orders,
            i;
          for (i in orders_add_) { orders_.push(orders_add_[i]) };
          for (i in orders_add) { orders.push(orders_add[i]) }
          console.log('orders', orders)
          console.log('orders_', orders_)
          console.log('orders_add', orders_add)
          console.log('orders_add_', orders_add_)
          that.setData({
            orders_: orders_,
            orders: orders_,
            index: index
          })
        } catch (err) {
          console.log(err)
        }
        console.log(res)
      }
    })
  },
})