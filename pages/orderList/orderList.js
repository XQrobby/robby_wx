// pages/orderList/orderList.js
var config_js = require('../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCount: 0,
    filterItemsMode:0,
    //导航栏
    filterItems: [
      { 'status': '全部', 'style': "color:#FFF;box-shadow: 0 1px 0 #FFF;" },
      { 'status': '审核中', 'style': 'color: #d4d4d4;' },
      { 'status': '待维修', 'style': 'color: #d4d4d4;' },
      { 'status': '已完修', 'style': 'color: #d4d4d4;' },
      { 'status': '已验收', 'style': 'color: #d4d4d4;' },
    ]
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
        var count = that.data.showCount + res.data.orders.length
        console.log(res.data, 'length:', res.data.orders.length,'showcount',that.data.showCount,'count',count)
        that.setData({
          orders_: res.data.orders,
          orders: res.data.orders,
          showCount: that.data.showCount+res.data.orders.length
        })
      }
    })
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
      else return order.orderStatus == filterItems[index].status
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
    var orders_ = this.data.orders_,
     orders = this.data.orders
    var filterItemsMode = that.data.filterItemsMode,
      showCount = that.data.showCount
    wx.request({
      url: config_js.basehost + config_js.urlpatterns.orderList,
      data: {
        unionCode: app.globalData.clientInfoP.unionCode,
        code: app.globalData.code,
        showCount: showCount,
      },
      method: 'POST',
      header: { "Content-type": "application/x-www-form-urlencoded" },
      success: function (res) {
        try {
          //将新增的order数目计入
          var orders_add = res.data.orders
          console.log('add', res)
          showCount += orders_add.length
          //将orders_add 加入 orders_
          for(var i in orders_add){
            orders_.push(orders_add[i])
          }
          var ordersAdd = orders_add.filter(function (order) {
            if (filterItemsMode == 0) {
              return order
            }
            else return order.orderStatus == filterItems[filterItemsMode].status
          });
          //将orderAdd加入orders
          for (var j in ordersAdd){
            orders.push(ordersAdd[j])
          }
          that.setData({
            orders_:orders_,
            orders:orders,
            showCount: showCount
          })           

          /*
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
          */
        } catch (err) {
          console.log(err)
        }
        console.log(res)
      }
    })
  },
})