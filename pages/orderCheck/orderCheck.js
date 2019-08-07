// pages/orderCheck/orderCheck.js
const app = getApp()
var config_js = require('../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levels:[
      '五星',
      '四星',
      '三星',
      '二星',
      '一星',
    ],
    level:'',
    evaluation:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var clientInfoP = app.globalData.clientInfoP,
      code = app.globalData.code
    this.setData({
      orderID:options.orderID,
      clientInfoP:clientInfoP,
      code:code
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  choiceSection: function(options){
    var levels = this.data.levels
    console.log(options)
    this.setData({
      level: levels[options.detail.value]
    })
  },
  inputEvaluation: function (e) {
    this.setData({
      evaluation: e.detail.value
    })
  },
  submit:function(){
    var that = this,
      clientInfoP = this.data.clientInfoP,
      code = this.data.code,
      level = this.data.level,
      evaluation = this.data.evaluation,
      orderID = this.data.orderID
    wx.request({
      url: config_js.basehost + config_js.urlpatterns.orderCkeck,
      data: {
        orderID: orderID,
        unionCode: clientInfoP.unionCode,
        code: code,
        level: level,
        evaluation: evaluation
      },
      method: 'POST',
      header: { "Content-type": config_js.requestHeader },
      success: function (res) {
        console.log(res.data)
        if (res.data.status) {
          wx.showToast({
            title: '验收成功',
            duration: 2000
          })
          wx.navigateBack({
            
          })
        }
      }
    })
  }
})