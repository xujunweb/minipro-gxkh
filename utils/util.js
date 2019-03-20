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

const timeToStr = (time, option)=> {
  const d = new Date(time)
  //获取当天0点的时间戳
  const etime = new Date(new Date(new Date().toLocaleDateString()).getTime() + (1000 * 60 * 60 * 24 - 1)).getTime()
  const ztime = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()
  const wlasttime = new Date(new Date(new Date().toLocaleDateString()).getTime() + (1000 * 60 * 60 * 24 * (7 - new Date().getDay()))).getTime()

  //获取本周一0点的时间戳
  const wtime = etime - (new Date().getDay()) * 1000 * 60 * 60 * 24
  const now = Date.now()
  const diff = (now - d) / 1000
  if (ztime < time && time < etime) {
    return this.parseTime(time, "{h}:{i}") //Math.ceil(diff / 3600) + '小时前'
  } else if (ztime < time && time < (ztime + 3600 * 24)) {
    return '昨天'
  } else if (time > wtime && time < wlasttime) {
    return "星期" + this.parseTime(time, "{a}")
  }
  if (option) {
    return this.parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日'
  }
}

const getUUID = ()=>{
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//获取url的参数
function GetUrlParam(paraName, lurl) {
  var url = lurl;
  var arrObj = url.split("?");
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split("&");
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}
function urlTo(lurl){
  var url = lurl
  url = url.replace(/%3A/g,':')
  url = url.replace(/%2F/g, '/')
  url = url.replace(/%3F/g, '?')
  url = url.replace(/%3D/g, '=')
  url = url.replace(/%26/g, '&')
  return url
}

module.exports = {
  formatTime: formatTime,
  timeToStr: timeToStr,
  getUUID: getUUID,
  GetUrlParam,
  urlTo
}
