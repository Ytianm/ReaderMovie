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

})