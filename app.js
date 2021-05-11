// app.js
App({
  // 小程序启动就会执行
  onLaunch() {
    let that = this;
    that.testVersion();
  },

  // 全局数据
  globalData: {},

  // 检测小程序版本提示更新
  testVersion: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            updateManager.applyUpdate()
          });
          // updateManager.onUpdateFailed(function () {
          //   // 新的版本下载失败
          //   wx.showModal({
          //     title: '已经有新版本了哟~',
          //     content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
          //   });
          // });
        };
      });
    };
  },
})