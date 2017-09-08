var tableArr = document.getElementsByClassName("tableExcel");

var nnn = "";

function submt() {
  document.getElementById("submit").value = "";
}

var tableToExcel = (function() {
  var uri = "data:application/vnd.ms-excel;base64,",
    template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function(s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
    format = function(s, c) {
      return s.replace(/{(\w+)}/g, function(m, p) {
        return c[p];
      });
    };
  return function(table, name) {
    for (var i = 0; i < tableArr.length; i++) {
      if (!table.nodeType) table = document.getElementsByClassName("tableExcel");
      var ctx = {
        worksheet: name || "Worksheet",
        table: tableArr[i].innerHTML
      };

      document.getElementById("dlink").href =
        uri + base64(format(template, ctx));
      document.getElementById("dlink").download =
        document.getElementById("submit").value + ".xls";
      document.getElementById("dlink").click();
    }
    $("#tableBox").html("");
  };
})();
