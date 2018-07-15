const util = require('../../../utils/util.js');
const app = getApp();

Page({

  data: {
    movie: {}
  },

  onLoad: function (options) {
    let movieId = options.id;
    let url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    util.http(url, this.processMovieData);
  },

  //处理数据
  processMovieData(data) {
    // console.log(data);
    let director = {
      id: '',
      name: '',
      avatar: ''
    }
    //处理某些数据为空的情况(一般判断二级属性，data为空的情况很少)
    if (data.directors[0] != null && data.directors[0].avatars != null) {
      director.avatar = data.directors[0].avatars.large;
      director.id = data.directors[0].id;
      director.name = data.directors[0].name;
    }

    let movie = {
      movieImg: data.images ? data.images.large : '',
      title: data.title,
      originalTitle: data.original_title,
      country: data.countries[0],
      wishCount: data.wish_count,
      commentsCount: data.comments_count,
      year: data.year,
      genres: data.genres.join('、'),
      stars: util.convertToStarsArr(data.rating.stars),
      score: data.rating.average,
      director: director,
      summary: data.summary,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfoArr(data.casts)
    }
    this.setData({
      movie
    })
  },

  //电影海报预览
  onMovieImgTap(ev){
    let imgUrl = ev.currentTarget.dataset.src;
    wx.previewImage({
      urls: [imgUrl],
    })
  }
})