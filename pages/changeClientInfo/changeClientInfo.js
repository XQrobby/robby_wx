// pages/changeclientInfo/changeclientInfo.js
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
    var addrs = [''];
    if (app.globalData.clientInfoP.addrs.length>0){
      addrs = app.globalData.clientInfoP.addrs
    }
    this.setData({
      name: app.globalData.clientInfoP.name,
      tel: app.globalData.clientInfoP.tel,
      clas:app.globalData.clientInfoP.clas,
      section:app.globalData.clientInfoP.section,
      addrs: addrs
    })
    console.log(this.data)
  },
  add: function (e) {
    var that = this,
      addrs = that.data.addrs;
    var length = addrs.length;
    if ((length < 3) && (addrs[length - 1] != '')) {
      addrs.push('')
      that.setData({
        addrs: addrs
      })
    } else {
      wx.showToast({
        title: '请输入地址',
        duration: 1000,
        icon: 'none'
      })
    }
  },
  minusModel: function (addrs, index, minus) {
    wx.showModal({
      title: '删除地址',
      content: '确定要删除该地址？',
      showCancel: true,//是否显示取消按钮
      cancelText: "否",//默认是“取消”
      cancelColor: 'skyblue',//取消文字的颜色
      confirmText: "是",//默认是“确定”
      confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          minus(addrs, index)
        }
      },
    })
  },
  minusSetData: function (addrs, index) {
    var that = this;
    addrs.splice(index, 1);
    that.setData({
      addrs: addrs
    })
  },
  minus: function (e) {
    var that = this;
    var addrs = that.data.addrs,
      index = e.currentTarget.dataset.index
    if (addrs.length > 1) {
      console.log(addrs[index])
      if (addrs[index]) {
        this.minusModel(addrs, index, that.minusSetData)
      } else {
        this.minusSetData(addrs, index)
      }
    }
  },
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  inputAddr: function (e) {
    var that = this;
    var addrs = that.data.addrs;
    addrs[e.currentTarget.dataset.index] = e.detail.value;
    that.setData({
      addrs: addrs
    })
  },
  inputClas: function (e) {
    this.setData({
      clas: e.detail.value
    })
  },
  inputSection: function (e) {
    this.setData({
      section: e.detail.value
    })
  },
  toast: function (title) {
    wx.showToast({
      title: title + '为空',
      duration: 1000,
      icon: 'none'
    })
  },
  checkInfo: function () {
    var that = this;
    var addrs = that.data.addrs;
    if (that.data.name=='NaN') {
      that.toast('姓名');
      return 0;
    } else if (that.data.tel=='NaN') {
      that.toast('联系电话');
      return 0;
    } else if ((addrs.length == 1) && (addrs[0] == '')) {
      return 0;
    }
    return 1;
  },
  formSubmit: function (e) {
    const app = getApp();
    var that = this,
      value = e.detail.value,
      unionCode = app.globalData.clientInfoP.unionCode,
      name = that.data.name,
      tel = that.data.tel,
      addrs = that.data.addrs,
      clas = that.data.clas,
      section = that.data.section;
    app.globalData.clientInfoP.name = name;
    app.globalData.clientInfoP.tel = tel;
    app.globalData.clientInfoP.addrs = addrs;
    app.globalData.clientInfoP.clas = clas;
    app.globalData.clientInfoP.section = section;

    if (this.checkInfo()) {
      wx.request({
        url: config_js.basehost + config_js.urlpatterns.changeClientInfo, //后台服务器
        data: {
          unionCode: unionCode,
          code: app.globalData.code,
          name: name,
          tel: tel,
          addrs: addrs,
          clas:clas,
          section:section
        },
        method: 'POST',
        header: { "Content-type": config_js.requestHeader },
        success: function (res) {
          console.log(res)
        }
      })
      wx.showToast({
        title: '修改成功',
        duration: 2000,
        icon: 'success',
      })
      wx.navigateBack({})
    }
  }
})