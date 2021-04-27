// 小本本主页页面
const app = getApp();

Page({
  // 初始数据
  data: {
    smallNotebookData: [],
  },

  // 页面加载（每次打开页面都会调用一次）
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

  // 进入小本本内容页面
  goToSmallNotebook: function (e) {
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
  },

  //进入记录页面
  goToRecord: function () {
    wx.navigateTo({
      url: '/pages/record/record',
      success: function (res) {}
    })
  }
})