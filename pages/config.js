var config = {
  basehost:'http://127.0.0.1:8000/',
  requestHeader: "application/x-www-form-urlencoded",
  urlpatterns:{
    login:'snack/login/',
    changeUserInfo:'snack/changeUserInfo/',
    orderList:'snack/orderList/',
    newOrder:'snack/newOrder/',
    order:'snack/order/',
    cancel:'snack/cancel/',
    orderPic:'snack/orderPic/',
  },
  orderTypes:['个人订单','学校订单'],
  serviceTypes:['电脑维修','其他维修'],
  sections:{
    '工程技术大学':['机械学院','robby工作室'],
  }
}

module.exports = config;