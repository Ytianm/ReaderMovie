const util = require('../../utils/util.js');
const app = getApp();

Page({

  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult:{},
    moviesContainerShow:true,
    searchPanelShow:false
  },

  onLoad: function (options) {
    let inTheaters = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=6';
    let comingSoon = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=6';
    let top250 = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=6';

    this.getMovieData(inTheaters, 'inTheaters','正在热映');
    this.getMovieData(comingSoon, 'comingSoon','即将上映');
    this.getMovieData(top250, 'top250','豆瓣电影Top250');
  },

  //请求电影数据
  getMovieData(url, settedKey,category) {
    wx.request({
      url,
      method: 'GET',
      header: {
        'Content-Type': 'application/xml'
      },
      success: res => {
        this.processMovieData(res, settedKey, category);
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  //处理请求到的数据
  processMovieData(res, settedKey, category) {
    let subjects = res.data.subjects;
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
    //把不同分类的电影数据保存到对应的{}里
    let movieData = {};
    //movieData[inTheater]-->{inTheater:movieData[inTheater]}; movieData[comingSoon]; movieData[top250]
    movieData[settedKey] = {
      movies: movies,   //嵌套一层movies,这样每组数据里都有用一个相同名字的json数据：{movies:{xxx}}
      title: category  //电影分类
    }
    this.setData(movieData);
  },

  //显示搜索页面
  onBindFocus(){
    this.setData({
      moviesContainerShow:false,
      searchPanelShow:true
    })
  },

  //隐藏搜索
  onSearchCancel(){
    this.setData({
      moviesContainerShow: true,
      searchPanelShow: false,
    })
  },

  //搜索,这里也可以用bindConfirm(回车确认)
  onBindInput(ev){  
    let text = ev.detail.value;
    let searchUrl = app.globalData.doubanBase +'/v2/movie/search?q='+text;
    this.getMovieData(searchUrl,'searchResult','');
  },

  //更多
  onMoreTap(ev) {
    let category = ev.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movies/more-movies?category=' + category,
    })
  },

  //电影详情
  onMovieDetailTap(ev){
    let movieId = ev.currentTarget.dataset.movieid; //注意：dataset里面的参数名都是小写！！！！
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId,
    })
  }

})