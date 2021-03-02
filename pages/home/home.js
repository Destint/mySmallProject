// 首页小本本
const app = getApp();

Page({
  // 初始数据
  data: {
    smallNotebookData: [],
  },
  // 页面加载（一个页面只会调用一次）
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'smallNotebookData',
      success(res) {
        that.setData({
          smallNotebookData: res.data,
        })
      }
    })
  },
  // 点击小本本进入标志事件
  clickEnterFlag: function (e) {
    var smallNotebookData = e.currentTarget.dataset.data; // 获取当前小本本数据
    var value = e.currentTarget.dataset.index; // 获取当前小本本数据的编号
    var key = "index";
    smallNotebookData[key] = value;
    wx.navigateTo({
      url: '/pages/smallNotebook/smallNotebook',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: smallNotebookData
        })
      }
    })
  }
})