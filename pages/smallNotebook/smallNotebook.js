// 小本本内容页面
const app = getApp();

Page({
  // 初始数据
  data: {
    smallNotebookData: {}, // 小本本数据
  },

  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    let that = this;
    wx.showShareMenu(); // 开启分享
    const eventChannel = this.getOpenerEventChannel();
    // 接收上个页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      let newData;
      if (data.data.content) {
        newData = JSON.parse(JSON.stringify(data.data).replace(/content/g, 'content0'));
      } else {
        newData = data.data;
      }
      that.setData({
        smallNotebookData: newData,
      });
    });
  },

  // 点击删除小本本按钮事件
  deleteSmallNotebook: function () {
    let that = this;
    wx.showModal({
      title: '温馨提示',
      content: '真的要删除当前小本本吗',
      cancelText: '我后悔了',
      confirmText: '下定决心',
      success(res) {
        if (res.confirm) {
          let index = that.data.smallNotebookData.index;
          wx.getStorage({
            key: 'smallNotebookData',
            success(res) {
              let oldSmallNotebookData;
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
                        wx.navigateBack();
                      }, 400);
                    },
                  });
                },
              });
            },
          });
        };
      },
    });
  },

  // 分享给朋友的页面设置
  onShareAppMessage: function () {
    return {
      title: '我拿小本本记下了',
      path: '/pages/home/home',
      imageUrl: '/images/share.png',
    };
  },

  // 查看图片
  reviewImage: function (e) {
    if (e.currentTarget.dataset) {
      let url = e.currentTarget.dataset.data;
      wx.previewImage({
        urls: [url],
      });
    };
  },

  // 编辑小本本
  editorSmallNotebook: function () {
    let that = this;
    let smallNotebookData = that.data.smallNotebookData;
    let key = "editorFlag";
    let value = 1;
    smallNotebookData[key] = value;
    wx.navigateTo({
      url: '/pages/record/record',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: smallNotebookData,
        });
      },
    });
  },
})