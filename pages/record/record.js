// 小本本记录页面
const app = getApp();
// 获取当前时间
const getPreTime = require('../../utils/getPreTime.js');
// 获取当前位置
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  // 初始数据
  data: {
    title: '', // 小本本标题初值
    content0: '', // 小本本内容初值
    content1: '', // 小本本内容初值
    content2: '', // 小本本内容初值
    address: '', // 当前位置
    detailedAddress: '', // 当前详细位置
    detailedWeather: '', // 当前位置详细天气
    pictureData: [], // 图片的base64数据
    pictureNum: 0, // 图片数量
    editorFlag: 0, // 编辑模式标志
    editorData: '', // 编辑模式下的数据
  },

  // 页面加载（一个页面只会调用一次）
  onLoad: function () {
    let that = this;
    wx.showShareMenu(); // 开启分享
    qqmapsdk = new QQMapWX({
      key: '3XKBZ-WP4CG-KQVQM-IJ2WK-7QAE7-2ZFKZ' //腾讯位置服务密钥
    });
    const eventChannel = this.getOpenerEventChannel();
    // 接收上个页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      wx.setNavigationBarTitle({
        title: '编辑小本本',
      });
      that.showEditorData(data);
    });
  },

  // 页面显示（每次打开都会调用）
  onShow: function () {
    var that = this;
    that.getUserLocation();
  },

  // 显示要编辑的小本本数据
  showEditorData: function (data) {
    let that = this;
    let title = '';
    let content0 = '';
    let content1 = '';
    let content2 = '';
    let pictureData = [];
    let pictureNum = 0;
    let editorFlag = 0;
    if (data.data.title) title = data.data.title;
    if (data.data.content0) content0 = data.data.content0;
    if (data.data.content1) content1 = data.data.content1;
    if (data.data.content2) content2 = data.data.content2;
    if (data.data.pictureData) {
      pictureData = data.data.pictureData;
      pictureNum = data.data.pictureData.length;
    };
    if (data.data.editorFlag) editorFlag = 1;
    that.setData({
      title: title,
      content0: content0,
      content1: content1,
      content2: content2,
      pictureData: pictureData,
      pictureNum: pictureNum,
      editorFlag: editorFlag,
      editorData: data.data,
    });
  },

  // 点击记下来按钮事件
  recordSmallNotebookData: function (data) {
    let that = this;
    if (that.data.editorFlag == 0) {
      let oldSmallNotebookData = []; // 之前的小本本内容
      let preSmallNotebookData = data.detail.value; // 获取当前小本本记录内容
      if (preSmallNotebookData.title == '') {
        wx.showToast({
          title: '小本本标题未写',
          icon: 'none',
          duration: 1500,
        });
        return;
      };
      let key = "time";
      let value = getPreTime.formatTime(new Date());
      preSmallNotebookData[key] = value;
      key = "address";
      preSmallNotebookData[key] = that.data.address + ' ' + that.data.detailedWeather;
      key = "detailedAddress";
      preSmallNotebookData[key] = that.data.detailedAddress + ' ' + that.data.detailedWeather;
      key = "pictureData";
      preSmallNotebookData[key] = that.data.pictureData;
      // 小本本数据存在云数据库
      that.saveSmallNotebookDataInCloud(oldSmallNotebookData, preSmallNotebookData);

      // 小本本数据存在手机本地缓存
      // that.saveSmallNotebookDataInLocal(oldSmallNotebookData, preSmallNotebookData);
    } else {
      let oldSmallNotebookData = that.data.editorData; // 之前的小本本内容
      let preSmallNotebookData = data.detail.value; // 获取当前小本本记录内容
      let index = oldSmallNotebookData.index; // 获取小本本的编号
      if (preSmallNotebookData.title == '') {
        wx.showToast({
          title: '小本本标题未写',
          icon: 'none',
          duration: 1500,
        });
        return;
      };
      let key = "time";
      preSmallNotebookData[key] = oldSmallNotebookData.time;
      key = "address";
      preSmallNotebookData[key] = oldSmallNotebookData.address;
      key = "detailedAddress";
      preSmallNotebookData[key] = oldSmallNotebookData.detailedAddress;
      key = "pictureData";
      preSmallNotebookData[key] = that.data.pictureData;

      // 编辑小本本本地缓存数据
      // that.editorSmallNotebookInLocal(index, oldSmallNotebookData, preSmallNotebookData);
      // 编辑小本本云端数据
      that.editorSmallNotebookInCloud(index, oldSmallNotebookData, preSmallNotebookData);
    };
  },

  // 小本本数据缓存在本地
  saveSmallNotebookDataInLocal: function (oldSmallNotebookData, preSmallNotebookData) {
    let that = this;
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
            });
            wx.showToast({
              title: '成功记下',
              icon: 'none',
              duration: 400,
              success() {
                setTimeout(function () {
                  wx.navigateBack()
                }, 400);
              },
            });
          },
        });
      },
      fail() {
        oldSmallNotebookData.unshift(preSmallNotebookData);
        wx.setStorage({
          key: "smallNotebookData",
          data: oldSmallNotebookData,
          success() {
            that.setData({
              title: '',
            });
            wx.showToast({
              title: '成功记下',
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
  },

  // 编辑小本本本地缓存数据
  editorSmallNotebookInLocal: function (index, oldSmallNotebookData, preSmallNotebookData) {
    let that = this;
    wx.getStorage({
      key: 'smallNotebookData',
      success(res) {
        oldSmallNotebookData = res.data;
        oldSmallNotebookData[index] = preSmallNotebookData;
        wx.setStorage({
          key: "smallNotebookData",
          data: oldSmallNotebookData,
          success() {
            that.setData({
              title: '',
            });
            wx.showToast({
              title: '编辑成功',
              icon: 'none',
              duration: 400,
              success() {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 2,
                  });
                }, 400);
              },
            });
          },
        });
      },
    });
  },

  // 小本本数据存在云数据库
  saveSmallNotebookDataInCloud: function (oldSmallNotebookData, preSmallNotebookData) {
    let that = this;
    const db = wx.cloud.database(); // 获取默认的云开发数据库
    const smallNotebookData = db.collection('smallNotebookData'); // 获取云数据库中小本本数据的集合
    smallNotebookData.where({
      _openid: app.globalData.openid,
    }).get({
      success: function (res) {
        if (res.data != "" && res.data[0].smallNotebookData) {
          oldSmallNotebookData = res.data[0].smallNotebookData;
          oldSmallNotebookData.unshift(preSmallNotebookData);
          smallNotebookData.doc(res.data[0]._id).update({
            data: {
              smallNotebookData: oldSmallNotebookData,
            },
            success: function (res) {
              that.setData({
                title: '',
              });
              wx.showToast({
                title: '成功记下',
                icon: 'none',
                duration: 400,
                success() {
                  setTimeout(function () {
                    wx.navigateBack()
                  }, 400);
                },
              });
            },
          });
        } else {
          wx.getStorage({
            key: 'smallNotebookData',
            success(res) {
              oldSmallNotebookData = res.data;
              oldSmallNotebookData.unshift(preSmallNotebookData);
              smallNotebookData.add({
                data: {
                  smallNotebookData: oldSmallNotebookData,
                },
                success: function (res) {
                  that.setData({
                    title: '',
                  });
                  wx.showToast({
                    title: '成功记下',
                    icon: 'none',
                    duration: 400,
                    success() {
                      setTimeout(function () {
                        wx.navigateBack()
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

  // 编辑小本本云端数据
  editorSmallNotebookInCloud: function (index, oldSmallNotebookData, preSmallNotebookData) {
    let that = this;
    const db = wx.cloud.database(); // 获取默认的云开发数据库
    const smallNotebookData = db.collection('smallNotebookData'); // 获取云数据库中小本本数据的集合
    smallNotebookData.where({
      _openid: app.globalData.openid,
    }).get({
      success: function (res) {
        if (res.data != "" && res.data[0].smallNotebookData) {
          oldSmallNotebookData = res.data[0].smallNotebookData;
          oldSmallNotebookData[index] = preSmallNotebookData;
          smallNotebookData.doc(res.data[0]._id).update({
            data: {
              smallNotebookData: oldSmallNotebookData,
            },
            success: function (res) {
              that.setData({
                title: '',
              });
              wx.showToast({
                title: '编辑成功',
                icon: 'none',
                duration: 400,
                success() {
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 2,
                    });
                  }, 400);
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

  // 获取用户授权位置信息
  getUserLocation: function () {
    let that = this;
    wx.getSetting({
      success: function (res) {
        // res.authSetting['scope.userLocation'] == undefined  表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false  表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true  表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '小本本需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      });
                    };
                  },
                });
              };
            },
          });
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        } else {
          //调用wx.getLocation的API
          that.getLocation();
        };
      },
    });
  },

  // 微信获得经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: 'true',
      highAccuracyExpireTime: '3500',
      success: function (res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        that.getLocal(latitude, longitude);
      },
    });
  },

  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let detailedAddress = '';
        let province = '';
        let city = '';
        let district = '';
        if (res.result.address) detailedAddress = res.result.address;
        if (res.result.ad_info.province) province = res.result.ad_info.province;
        if (res.result.ad_info.city) city = res.result.ad_info.city;
        if (res.result.ad_info.district) district = res.result.ad_info.district;
        let address = province + city + district;
        that.setData({
          detailedAddress: detailedAddress,
          address: address,
        })
        if (district != '') that.getWeather(district); // 获取当前位置天气
        else if (city != '') that.getWeather(city);
      },
    });
  },

  // 获取当前天气
  getWeather: function (location) {
    let that = this;
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now',
      data: {
        location: location,
        key: "2ce65b27e7784d0f85ecd7b8127f5e2d",
      },
      success: function (res) {
        let weather = '';
        let temperature = '';
        if (res.data.HeWeather6[0].now.cond_txt) weather = res.data.HeWeather6[0].now.cond_txt;
        if (res.data.HeWeather6[0].now.fl) temperature = res.data.HeWeather6[0].now.fl + '℃';
        let detailedWeather = weather + ' ' + temperature;
        that.setData({
          detailedWeather: detailedWeather,
        });
      },
    });
  },

  // 拍照
  takePicture: function () {
    let that = this;
    let pictureNum = that.data.pictureNum;
    if (pictureNum >= 3) {
      wx.showToast({
        title: '图片最多保存3张',
        icon: 'none',
        duration: 1500,
      });
    } else {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success(res) {
          wx.showLoading({
            title: '正在保存',
            mask: 'true',
          });
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          wx.compressImage({
            src: tempFilePaths[0],
            quality: 80,
            success: function (res) {
              const tempFilePath = res.tempFilePath;
              let pictureData = that.data.pictureData;

              // 图片转为base64 由于传输数据过长报错 暂缓
              // wx.getFileSystemManager().readFile({
              //   filePath: tempFilePath, //选择图片返回的相对路径
              //   encoding: 'base64', //编码格式
              //   success: res => { //成功的回调
              //     pictureData.push("data:image/png;base64," + res.data);
              //     pictureNum++;
              //     that.setData({
              //       pictureData: pictureData,
              //       pictureNum: pictureNum,
              //     });
              //     wx.hideLoading();
              //   },
              // });

              // 本地路径
              pictureData.push(tempFilePath);
              pictureNum++;
              that.setData({
                pictureData: pictureData,
                pictureNum: pictureNum,
              });
              wx.hideLoading();
            },
          });
        },
      });
    };
  },

  // 相册
  photoAlbum() {
    let that = this;
    let pictureNum = that.data.pictureNum;
    if (pictureNum >= 3) {
      wx.showToast({
        title: '图片最多保存3张',
        icon: 'none',
        duration: 1500,
      });
    } else {
      let imgCount = 3 - pictureNum;
      wx.chooseImage({
        count: imgCount,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success(res) {
          wx.showLoading({
            title: '正在保存',
            mask: 'true',
          });
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          let pictureData = that.data.pictureData;
          for (var i = 0; i < tempFilePaths.length; i++) {
            wx.compressImage({
              src: tempFilePaths[i],
              quality: 80,
              success: function (res) {
                const tempFilePath = res.tempFilePath;

                // 转为base64 由于数据传输过长报错 暂缓
                // wx.getFileSystemManager().readFile({
                //   filePath: tempFilePath, //选择图片返回的相对路径
                //   encoding: 'base64', //编码格式
                //   success: res => { //成功的回调
                //     pictureData.push("data:image/png;base64," + res.data);
                //     pictureNum++;
                //     that.setData({
                //       pictureData: pictureData,
                //       pictureNum: pictureNum,
                //     });
                //   },
                // });

                // 本地地址
                pictureData.push(tempFilePath);
                pictureNum++;
                that.setData({
                  pictureData: pictureData,
                  pictureNum: pictureNum,
                });
              },
            });
          };
          wx.hideLoading();
        },
      });
    };
  },

  // 删除图片
  deletePicture: function (e) {
    let that = this;
    if (e.currentTarget.dataset) {
      wx.showModal({
        title: '温馨提示',
        content: '是否删除该图片',
        cancelText: '才不',
        confirmText: '删了删了',
        success(res) {
          if (res.confirm) {
            // 确定删除图片
            let index = e.currentTarget.dataset.index;
            let pictureData = that.data.pictureData;
            let pictureNum = that.data.pictureNum;
            pictureData.splice(index, 1);
            pictureNum--;
            that.setData({
              pictureData: pictureData,
              pictureNum: pictureNum,
            });
            if (index == 0) {
              that.setData({
                content0: that.data.content1,
                content1: that.data.content2,
                content2: '',
              });
            } else if (index == 1) {
              that.setData({
                content1: that.data.content2,
                content2: '',
              });
            } else {
              that.setData({
                content2: '',
              });
            };
          };
        },
      });
    };
  },
})