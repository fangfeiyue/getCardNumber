var header = ["Flag", "SerialNumber", "Password"];
var content = [];

function splitArr(data) {
  var result = [];

  for (var i = 0, len = data.length; i < len; i += 10000) {
    result.push(data.slice(i, i + 10000));
  }

  return result;
}

var dateFormat = function (date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

function doDownload() {
  var downloadLink = document.getElementById("downloadLink");
  var context = "";
  var context = header.join(",") + "\n";

  var resultArr = splitArr(content);

  for (var j = 0; j < resultArr.length; j++) {
    for (var i = 0 + 10000 * j; i <= (j + 1) * 10000-1; i++) {

      if (content[i] === undefined) {
        break;
      }

      var item = content[i];
      item.forEach(function (item, index, list) {
        context = context + item + ",";
      });
      context = context + "\n";
    }

    context = encodeURIComponent(context);

    downloadLink.download = dateFormat(new Date(), "yyyy-MM-dd") + '生成的序列号从' + $('.serialNumberLeft').val() + '到' + $('.serialNumberRight').val()+'之间的卡号' +'(' + j + ')' + ".csv"; // 下载的文件名称
    downloadLink.href = "data:text/csv;charset=utf-8,\ufeff" + context; //加上 \ufeff BOM 头
    downloadLink.click();
    context = '';
  }
  content = [];
}
