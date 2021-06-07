// 小本本主页页面
const app = getApp();

Page({
  // 初始数据
  data: {
    smallNotebookData: [], // 小本本数据
  },

  // 页面加载（只会调用一次）
  onLoad: function () {
    wx.showShareMenu(); // 开启分享
  },

  // 页面加载（每次打开页面都会调用一次）
  onShow: function () {
    let that = this;
    that.getSmallNotebookDataFromCloud();
  },

  // 获取微信中小本本的缓存数据
  getSmallNotebookData: function () {
    let that = this;
    // 获取缓存数据
    wx.getStorage({
      key: 'smallNotebookData',
      success(res) {
        that.setData({
          smallNotebookData: res.data,
        });
      },
    });
  },

  // 从云数据库中获取用户的小本本数据
  getSmallNotebookDataFromCloud: function () {
    let that = this;
    const db = wx.cloud.database(); // 获取默认的云开发数据库
    const smallNotebookData = db.collection('smallNotebookData'); // 获取云数据库中小本本数据的集合
    smallNotebookData.add({
      data: {},
      success: function (res) {
        smallNotebookData.where({
          _id: res._id,
        }).get({
          success: function (res) {
            app.globalData.openid = res.data[0]._openid;
            smallNotebookData.doc(res.data[0]._id).remove({
              success: function (res) {
                that.getSmallNotebookDataFromOpenid(app.globalData.openid);
              },
            });
          },
        });
      },
    });
  },

  // 根据用户的openid获取云数据库中的小本本数据
  getSmallNotebookDataFromOpenid: function (openid) {
    let that = this;
    const db = wx.cloud.database(); // 获取默认的云开发数据库
    const smallNotebookData = db.collection('smallNotebookData'); // 获取云数据库中小本本数据的集合
    smallNotebookData.where({
      _openid: openid,
    }).get({
      success: function (res) {
        if (res.data != "" && res.data[0].smallNotebookData) {
          that.setData({
            smallNotebookData: res.data[0].smallNotebookData,
          });
        } else {
          that.getSmallNotebookData();
        };
      },
    });
  },

  // 进入小本本内容页面
  goToSmallNotebook: function (e) {
    let smallNotebookData = e.currentTarget.dataset.data; // 获取当前小本本数据
    let value = e.currentTarget.dataset.index; // 获取当前小本本数据的编号
    let key = "index";
    smallNotebookData[key] = value;
    // 跳转到指定页面
    wx.navigateTo({
      url: '/pages/smallNotebook/smallNotebook',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: smallNotebookData,
        });
      },
    });
  },

  //进入记录页面
  goToRecord: function () {
    wx.navigateTo({
      url: '/pages/record/record',
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
})