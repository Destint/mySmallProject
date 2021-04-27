// 小本本记录页面
const app = getApp();
// 获取当前时间
const getPreTime = require('../../utils/getPreTime.js')

Page({
  // 初始数据
  data: {
    title: '', // 小本本标题初值
    content: '', // 小本本内容初值
  },

  // 页面加载（一个页面只会调用一次）
  onLoad: function () {},

  // 点击记下来按钮事件
  recordSmallNotebookData: function (data) {
    var that = this;
    var oldSmallNotebookData = []; // 之前的小本本内容
    var preSmallNotebookData = data.detail.value; // 获取当前小本本记录内容
    if (preSmallNotebookData.title == '') {
      wx.showToast({
        title: '小本本标题未写',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (preSmallNotebookData.content == '') {
      wx.showToast({
        title: '小本本内容未写',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var key = "time";
    var value = getPreTime.formatTime(new Date());
    preSmallNotebookData[key] = value;
    wx.getStorage({
      key: 'smallNotebookData',
      success(res) {
        oldSmallNotebookData = res.data;
        oldSmallNotebookData.unshift(preSmallNotebookData);
        wx.setStorage({
          key: "smallNotebookData",
          data: oldSmallNotebookData,
          success() {
            that.setData({
              title: '',
              content: ''
            })
            wx.showToast({
              title: '成功记下',
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
      },
      fail() {
        oldSmallNotebookData.unshift(preSmallNotebookData);
        wx.setStorage({
          key: "smallNotebookData",
          data: oldSmallNotebookData,
          success() {
            that.setData({
              title: '',
              content: ''
            })
            wx.showToast({
              title: '成功记下',
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
  },
})