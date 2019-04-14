var funcSeal = {
  toast:function(warning){
    wx.showToast({
      title: warning,
      icon: 'none',
      duration: 2500,
      mask: true
    })
  }
}

module.exports = funcSeal;