const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//电影评分星星->[1,1,2,0,0]
const convertToStarsArr = stars => {
  let firstNum = stars.toString().substring(0, 1);
  let lastNum = stars.toString().substring(1);
  let starsArr = [];
  if (lastNum == 0) {
    for (let i = 0; i < 5; i++) {
      if (i < firstNum) {
        starsArr.push(1);
      } else {
        starsArr.push(0);
      }
    }
  } else {
    for (let i = 0; i < 5; i++) {
      if (i < firstNum) {
        starsArr.push(1);
      } else if (i == firstNum) {
        starsArr.push(2);    //半个星
      } else {
        starsArr.push(0);
      }
    }
  }

  return starsArr;
}

//请求电影数据
function http(url, callBack) {
  wx.request({
    url,
    method: 'GET',
    header: {
      'Content-Type': 'application/xml'
    },
    success: res => {
      callBack(res.data);
    },
    fail(err) {
      console.log(err);
    }
  })
}

//详情中演员拼接'/'
function convertToCastString(casts){
  let castString = '';
  for(let index in casts){
    castString += casts[index].name + ' / ';
  }
  return castString.substring(0,castString.length-2); //去掉最后一个'/ '
}

//详情中演员信息
function convertToCastInfoArr(casts) {
  let castsInfo = [];
  for (let index in casts) {
    let castJson = {
      avatar:casts[index].avatars?casts[index].avatars.large:'',
      name:casts[index].name
    }
    castsInfo.push(castJson);
  }
  return castsInfo;
}

module.exports = {
  formatTime: formatTime,
  convertToStarsArr,
  http,
  convertToCastString,
  convertToCastInfoArr
}