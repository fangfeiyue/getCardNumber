# 卡号生成器
根据用户输入输出卡号，并导出卡号的csv文件和sql语句，便于服务器人员将产生的卡号存入数据库
# 采用的技术
因为只是一个工具，综合了一下掌握的技术点，感觉用react、vue等比较麻烦，无形中延长了开发周期，所以就没有使用什么太高大上的框架。
- js -- JQuery
- css -- bootstrap
# 使用步骤
- 直接打开项目中的index.html文件
- 依次输入所需内容（所有内容都不能为空）
- 点击生成卡号，等待卡号生成完成
- 根据需求，点击导出csv文件还是sql语句文件
# 遇到的问题
- 测试的一次性导出十万个卡号，虽然生成卡号成功，但导出的时候失败了，文件比较大，最后将数据进行了拆分，每一万条导出一个表，这样就能正常下载了。
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
- 实现导出卡号功能后，老大说为了方便后台将生成的卡号导入数据库，要增加了将卡号插入sql语句，并导出对应卡号的txt文档。将卡号插入sql语句这个简单，就是字符串的拼接而已，但导出txt遇到了点问题，因为我用的mac，老大的用的也是mac，如果用导出txt就必须使用IE浏览器，使用这么个功能还要让人专门安装IE，这太坑爹了。网上找了各种办法都不行，随后想到我上一步不是导出csv文件了吗，再用上面的代码导出txt不就行了吗，结果没有我想得那么简单，最多导出一张txt，其余全失败。。。这就尴尬了，最后修改了下导出看好的数据结构，让它符合导出csv文件的格式，成功导出。
# 项目截图

