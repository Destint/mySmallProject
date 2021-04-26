// 个人中心
const app = getApp();

Page({
  // 初始数据
  data: {
    userInfo: {}, // 用户信息
    isLogin: false, // 用户是否授权登录
    registrationDate: "2020-11-25 加入小本本",
  },
  // 页面加载（一个页面只会调用一次）
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        isLogin: app.globalData.isLogin,
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: app.globalData.userInfo,
          isLogin: app.globalData.isLogin,
        })
      }
    }
  },
  // 点击登录用户
  clickLoginBtn: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      // 用户点击了登录按钮
      // 获取到用户的信息
      app.globalData.userInfo = e.detail.userInfo;
      app.globalData.isLogin = true;
      that.setData({
        userInfo: app.globalData.userInfo,
        isLogin: app.globalData.isLogin,
      })
    } else {
      // 用户按了拒绝授权 弹出警告
      wx.showModal({
        title: '无法登录完成',
        content: '为了获取您的信息，请先进行授权噢',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            // 用户点了返回授权
          }
        }
      });
    }
  },
  // 点击获取当前位置
  getLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      altitude: 'true',
      isHighAccuracy: 'true',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          success(res) {
            wx.chooseLocation({
              latitude: 0,
              // longitude,
              success(res) {
                console.log(res)
              }
            })
          }
        })
      },
      fail(error) {
        console.log(error)
        // 用户点了拒绝授权 弹出警告
        wx.showModal({
          title: '授权位置失败',
          content: '如果您想记下小本本的同时也记下当前位置，需要您在右上角设置里打开位置消息的授权噢',
          showCancel: false,
          confirmText: '确认',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {

                }
              })
            }
          }
        });
      }
    })
  },
})