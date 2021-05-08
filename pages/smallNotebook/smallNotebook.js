// 小本本内容页面
const app = getApp();

Page({
  // 初始数据
  data: {
    smallNotebookData: {}, // 小本本数据
  },

  // 页面加载（一个页面只会调用一次）
  onLoad() {
    var that = this;
    wx.showShareMenu(); // 开启分享
    const eventChannel = this.getOpenerEventChannel();
    // 接收上个页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      if (data.data.content) {
        var newData = JSON.parse(JSON.stringify(data.data).replace(/content/g, 'content0'))
      } else {
        var newData = data.data
      }
      that.setData({
        smallNotebookData: newData,
      })
    })
  },

  // 点击删除小本本按钮事件
  deleteSmallNotebook: function () {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '真的要删除当前小本本吗',
      cancelText: '我后悔了',
      confirmText: '下定决心',
      success(res) {
        if (res.confirm) {
          var index = that.data.smallNotebookData.index;
          wx.getStorage({
            key: 'smallNotebookData',
            success(res) {
              var oldSmallNotebookData;
              oldSmallNotebookData = res.data;
              oldSmallNotebookData.splice(index, 1);
              wx.setStorage({
                key: "smallNotebookData",
                data: oldSmallNotebookData,
                success() {
                  wx.showToast({
                    title: '成功删除',
                    icon: 'none',
                    duration: 400,
                    success() {
                      setTimeout(function () {
                        wx.navigateBack()
                      }, 400)
                    }
                  })
                }
              })
            }
          })
        } else if (res.cancel) {}
      }
    })
  },

  // 分享给朋友的页面设置
  onShareAppMessage: function () {
    return {
      title: '我拿小本本记下了',
      path: '/pages/home/home',
      imageUrl: '/images/share.png'
    }
  }
})