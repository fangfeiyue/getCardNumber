# 卡号生成器
根据用户输入输出卡号，并导出卡号的csv文件和sql语句，便于服务器人员将产生的卡号存入数据库
# 采用的技术
因为只是一个工具，综合了一下掌握的技术点，感觉用react、vue等还要比较麻烦，所以就没有使用什么太高大上的框架，js方面采用JQuery，css方面就是纯的css没有使用sass、less。
# 使用步骤
- 直接打开项目中的index.html文件
- 依次输入所需内容（所有内容都不能为空）
- 点击生成卡号，等待卡号生成完成
- 根据需求，点击导出csv文件还是sql语句文件
# 遇到的问题
- 刚开始采用将卡号插入table，然后将table导出成excel的方式，但是如果生成的卡号超过一万条就会非常耗时，有时页面还会崩溃。这样用户体验就相当的不好。还是老大提醒了下说可以导出成csv格式。试着将内容导出成csv格式，效率果然提升了好多，现在一次性导出十万条数据都不怎么卡。
导出csv的代码如下：
```
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

```
