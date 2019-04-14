var urlconfig = {
  basehost:'http://127.0.0.1:8000/',
  requestHeader: "application/x-www-form-urlencoded",
    urlpatterns:{
      login:'snack/login/',
      changeUserInfo:'snack/changeUserInfo/',
      orderList:'snack/orderList/'
    }
}

module.exports = urlconfig;