// pages/newOrder/newOrder.js
var config_js = require('../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    console.log(Object.keys(app.globalData.sections))
    this.setData({
      orderTypes:config_js.orderTypes,
      serviceTypes: app.globalData.serviceTypes,
      sections_clases:app.globalData.sections,
      sections:Object.keys(app.globalData.sections),
      name: app.globalData.userInfoP.name,
      tel: app.globalData.userInfoP.tel,
      addrs: app.globalData.userInfoP.addrs,
    })
    console.log(this.data)
  },
  choosePic:function() {
    var that = this;
    const app = getApp();
    wx.chooseImage({
      success: function (res) {
        //console.log(res);
        var picData = {};
        picData.path = res.tempFilePaths;
        picData.url = config_js.basehost + config_js.urlpatterns.orderPic;
        that.setData({
          'picData': picData,
          'picCount': res.tempFilePaths.length
        })
        wx.showToast({
          title: '选择成功',
          icon: 'success',
          duration: 1000
        })
      },
    })
  },
  toast: function (title) {
    wx.showToast({
      title: title + '为空',
      duration: 1000,
      icon: 'none'
    })
  },
  //选择报修地址
  bindCasPickerChange: function (e) {
    this.setData({
      addr: this.data.addrs[e.detail.value]
    })
  },
  choiceOrderType:function(e){
    this.setData({
      orderType: this.data.orderTypes[e.detail.value]
    })
  },
  choiceServiceType: function (e) {
    this.setData({
      serviceType: this.data.serviceTypes[e.detail.value]
    })
  },
  //选择学校
  choiceSection: function (e) {
    var sections = this.data.sections,
      section = this.data.sections[e.detail.value],
      clases = this.data.sections_clases[section];
    this.setData({
      section: this.data.sections[e.detail.value],
      clases:clases
    })
  },
  //选择部门/学院
  choiceClas:function(e){
    this.setData({
      clas: this.data.clases[e.detail.value]
    })
  },
  //核查订单信息
  checkInfo: function () {
    var that = this;
    if (!that.data.model) {
      that.toast('机器型号');
      return 0;
    } else if (!that.data.faultDescription) {
      that.toast('问题描述');
      return 0;
    } 
    /*
    else if (!that.data.picCount) {
      that.toast('请选择图片')
      return 0;
    }
    */
    return 1;
  },
  //提交订单信息
  submitInfo() {
    const app = getApp();
    var that = this, 
      data = {
        unionCode: app.globalData.userInfoP.unionCode,
        code: app.globalData.code,
        orderType: that.data.orderType,
        serviceType: that.data.serviceType,
        model: that.data.model,
        faultDescription: that.data.faultDescription,
        addr: that.data.addr
      };
    if(that.data.orderType=='学校订单'){
      data['section'] = that.data.section;
      data['clas'] = that.data.clas
    }
    wx.request({
      url: config_js.basehost + config_js.urlpatterns.newOrder,
      data: data,
      method: 'POST',
      header: { "Content-type": config_js.requestHeader },
      success: function (res) {
        if(res.data.status){
          wx.showToast({
            title: '下单成功',
            duration: 2000
          })
        }
        that.setData({
          'orderID': res.data.orderID
        });
        if (that.data.picData) {
          that.uploadPic(that.data.picData)
        }
      }
    })
  },
  //上传图片
  //未完工
  uploadPic(data) {
    const app = getApp();
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: { 
        'orderID': that.data.orderID,
        'unionCode': app.globalData.userInfoP.unionCode,
        'code':app.globalData.code
       },//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        //console.log(resp)
        console.log('图片' + i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log('完成图片' + i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用    
          app.globalData.newOrderNo = that.data.no
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          console.log(that.data.no)
        } else {//若图片还没有传完，则继续调用函数
          console.log('开始上传图片' + i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadPic(data);
        }
      }
    });
  },
  //提交按钮动作
  submit: function (e) {
    const app = getApp();
    var that = this;
    if (that.checkInfo()) {
      that.submitInfo();
      app.globalData.haveNewOrder = true;
      wx.navigateBack({})
    }
  },
  inputFaultDescription:function(e){
    this.setData({
      faultDescription: e.detail.value
    })
  },
  inputModel: function (e) {
    this.setData({
      model: e.detail.value
    })
  }
})