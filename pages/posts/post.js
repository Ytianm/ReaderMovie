var data = require('../../data/posts-data.js');

Page({
  data: {
    "indicator":true,
    "autoplay":true,
    "interval":3000
  },
  onLoad: function () {
    // this.data.postList = data.postList;
    this.setData({
      postList: data.postList
    })
  },

  //跳转到详情
  onPOstDetail(ev){
    let postId = ev.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})