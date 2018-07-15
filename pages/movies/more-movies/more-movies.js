const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data: {
    movies: {},
    navigationBarTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true,
    loading:false
  },

  onLoad: function (options) {
    let category = options.category;
    this.data.navigationBarTitle = category;

    let dataUrl = '';
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case '豆瓣电影Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processMovieData); //发起请求
  },

  //处理请求到的数据
  processMovieData(res) {
    let subjects = res.subjects;
    let movies = [];
    for (let index in subjects) {
      let subject = subjects[index];
      let title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...';
      }
      let temp = {
        title,
        stars: util.convertToStarsArr(subject.rating.stars),
        coverImage: subject.images.large,
        average: subject.rating.average,
        movieId: subject.id
      }
      movies.push(temp);
    }

    if (this.data.isEmpty) {  //第一次加载
      this.data.isEmpty = false;
    } else {    //加载更多
      movies = this.data.movies.concat(movies); //将新加载的电影合并到原有电影列表里
    }
    this.setData({
      movies,
      loading:false
    });

    this.data.totalCount += 20; 
    wx.stopPullDownRefresh(); 
  },

  //下拉刷新
  onPullDownRefresh(){
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0; //如果回0，下拉刷新后再上拉加载将不会从count=20开始，而是从之前的count
    let nextUrl = this.data.requestUrl + '?start=0&count=20';
    util.http(nextUrl, this.processMovieData);
  },

  //上拉加载
  onReachBottom(){
    this.setData({
      loading : true
    })
    let nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount;
    util.http(nextUrl, this.processMovieData);
  },

  // //电影详情
  onMovieDetailTap(ev) {
    let movieId = ev.currentTarget.dataset.movieid; //注意：dataset里面的参数名都是小写！！！！
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigationBarTitle,
    })
  }

})