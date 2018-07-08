const datas = require('../../../data/posts-data.js');

Page({
  data: {
 
  },
  onLoad: function (options) {
    let postId = options.id;
    this.data.currentPostId = postId;
    let detailItem = datas.postList[postId];  //id与index不相同时使用下面filter的方法
    // let detailItem = datas.postList.filter(item=>{
    //   if (item.postId == postId){
    //     return true;
    //   }
    // });
    this.setData({  //异步
      detailItem
    })

    //收藏图片显示
    let postsCollected = wx.getStorageSync('collected');  //全部文章的收藏状态
    if (postsCollected) {
      //当前文章的收藏状态(后面的false：第一次访问第一篇文章，生成一个postsCollected：{}，不收藏，第一篇文章
      //的状态为false，第二次访问第二篇时由于不再执行else，导致第二篇文章的收藏状态无法没有设置，所以在这里要||来
      //设置一下，不然下面的this.setData将报错)
      let postCollected = postsCollected[postId] || false; 
      this.setData({  
        collected: postCollected    //根据当前收藏状态改变收藏按钮图片的src
      })
    } else {
      let postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('collected', postsCollected);
    }
  },

  //点击收藏，取消收藏
  onCollectionTap() {
    let postsCollected = wx.getStorageSync('collected');  //全部文章的收藏状态
    let postCollected = postsCollected[this.data.currentPostId]; //当前文章的收藏状态
    postCollected = !postCollected; //收藏与否
    postsCollected[this.data.currentPostId] = postCollected;  //更新当前文章收藏状态
    wx.setStorageSync('collected', postsCollected);  //更新全部收藏状态
    this.setData({
      collected: postCollected
    })
  },

})