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

  //列表跳转到详情
  onPostDetail(ev){
    //ev.currentTarget->事件捕获的组件
    let postId = ev.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  //轮播图跳转到详情
  onSwiperTap(ev){
    //ev.target->当前点击的组件
    let postId = ev.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})