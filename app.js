//app.js
var config_js = require('./pages/config.js'),
  funcSeal = require('./pages/funcSeal.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res.code)
        const app = getApp();
        app.globalData.code = res.code;
        wx.request({
          url: config_js.basehost+config_js.urlpatterns.login,
          method: 'POST',
          header: { "Content-type": config_js.requestHeader },
          data:{code:res.code},
          success:function(res){
            app.globalData.sections = res.data.sectionsForm;
            app.globalData.serviceTypes = res.data.serviceTypesForm;
            app.globalData.userInfoP = res.data.userInfoP;

            //检验返回信息，确认无误后将个人信息加入全局变量userInfoP
            if(res.data.status=='none'){
              funcSeal.toast('请输入注册信息');
              wx.navigateTo({
                url: '/pages/changeUserInfo/changeUserInfo',
              })
            }
          },
          fail:function(){
            funcSeal.toast('服务器连接失败')
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    haveNewOrder: false,
  }
})