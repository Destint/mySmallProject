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
    const eventChannel = this.getOpenerEventChannel();
    // 接收上个页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        smallNotebookData: data.data,
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
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }
})