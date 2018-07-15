const datas = require('../../../data/posts-data.js');
const app = getApp();
Page({
  data: {
    isMusicPlaying: false
  },
  onLoad: function (options) {
    let postId = options.id;
    this.data.currentPostId = postId;
    let detailItem = datas.postList[postId]; //id与index不相同时使用下面filter的方法
    // let detailItem = datas.postList.filter(item=>{
    //   if (item.postId == postId){
    //     return true;
    //   }
    // });
    this.setData({ //异步
      detailItem
    })

    //收藏图片显示
    let postsCollected = wx.getStorageSync('collected'); //全部文章的收藏状态
    if (postsCollected) {
      //当前文章的收藏状态(后面的false：第一次访问第一篇文章，生成一个postsCollected：{}，不收藏，第一篇文章
      //的状态为false，第二次访问第二篇时由于不再执行else，导致第二篇文章的收藏状态无法没有设置，所以在这里要||来
      //设置一下，不然下面的this.setData将报错)
      let postCollected = postsCollected[postId] || false;
      this.setData({
        collected: postCollected //根据当前收藏状态改变收藏按钮图片的src
      })
    } else {
      let postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('collected', postsCollected);
    }

    //检测音乐播放
    if (app.globalData.g_isMusicPlaying) {
      this.setData({
        isMusicPlaying: true
      })
    }
  },

  //点击收藏，取消收藏
  onCollectionTap() {
    let postsCollected = wx.getStorageSync('collected'); //全部文章的收藏状态
    let postCollected = postsCollected[this.data.currentPostId]; //当前文章的收藏状态
    postCollected = !postCollected; //收藏与否
    postsCollected[this.data.currentPostId] = postCollected; //更新当前文章收藏状态
    wx.setStorageSync('collected', postsCollected); //更新全部收藏状态
    this.setData({
      collected: postCollected
    })


    //提示消息
    wx.showToast({
      title: postCollected ? '收藏成功' : '已取消收藏',
      icon: 'none',
      duration: 1000
    })
  },

  //分享
  onShareTap() {
    let itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享给QQ好友'
    ];
    wx.showActionSheet({
      itemList,
      success(res) {
        wx.showModal({
          title: '分享',
          content: '是否' + itemList[res.tapIndex],
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#ccc',
          confirmText: '分享',
          confirmColor: '#0B2F3A',
          success(res) {
            if (res.confirm) {

            } else if (res.cancel) {

            }
          }
        })
      }
    })
  },

  //音乐
  onMusicTap() {
    let currentPostId = this.data.currentPostId;
    let postData = datas.postList[currentPostId];
    if (this.data.isMusicPlaying) {
      wx.pauseBackgroundAudio();
      this.setData({
        isMusicPlaying: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isMusicPlaying: true
      })
    }

    //监听音乐播放
    wx.onBackgroundAudioPlay(()=>{
      this.setData({
        isMusicPlaying: true
      })
      app.globalData.g_isMusicPlaying = true;
    })

    //监听音乐暂停
    wx.onBackgroundAudioPause( ()=> {
      this.setData({
        isMusicPlaying: false
      })
      app.globalData.g_isMusicPlaying = false;
    })
  }

})