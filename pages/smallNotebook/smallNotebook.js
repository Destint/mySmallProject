// 个人中心
const app = getApp();

Page({
  // 初始数据
  data: {
    smallNotebookData: {}, // 小本本数据
  },
  // 页面加载（一个页面只会调用一次）
  onLoad() {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        smallNotebookData: data.data,
      })
    })
  },
  // 点击删除小本本按钮事件
  clickDeleteSmallNotebook: function () {
    var that = this;
    var index = that.data.smallNotebookData.index;
    wx.getStorage({
      key: 'smallNotebookData',
      success(res) {
        var oldSmallNotebookData;
        oldSmallNotebookData = res.data;
        oldSmallNotebookData.splice(index,1);
        wx.setStorage({
          key: "smallNotebookData",
          data: oldSmallNotebookData
        })
      }
    })
    wx.showToast({
      title: '删除成功',
      icon: 'none',
      duration: 1500
    })
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
})