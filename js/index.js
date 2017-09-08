var mainJs = {
    minValue:'',
    maxValue:'',
    flagValue: '',
    sqlTemplate: '',
    passwordCount: '',
    serialNumberCount:'',
    serialNumberLeft: '1',
    serialNumberRight: '',
    passwordBox: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    init: function(){
        this.bindEvent();
    },
    bindEvent: function(){
        var _this = this;
        
        //生成卡号
        $('.btnLeft').click(function(){
            if (_this.validate()){
                _this.insertDataToTable(parseInt($('.passwordCount').val()));
                $('#submit').val(_this.dateFormat(new Date(), "yyyy-MM-dd")+'生成的序列号从'+$('.serialNumberLeft').val()+'到'+$('.serialNumberRight').val()+'之间的卡号');
            }
        });

        $('.serialNumberLeft').on('input',function(){
            _this.minValue = $.trim($('.serialNumberLeft').val());
        });

        $('.serialNumberRight').on('input',function(){
            _this.maxValue = $.trim($('.serialNumberRight').val());
        });

        $('.serialNumberLeft').blur(function(){
            if ($.trim($('.serialNumberLeft').val()).length < parseInt(_this.serialNumberCount)){
                alert('序列号范围左边值的长度不能小于序列号位数');
                return false;
            }
        });

        $('.serialNumberRight').blur(function(){
            if ($.trim($('.serialNumberRight').val()).length < parseInt(_this.serialNumberCount)){
                alert('序列号范围右边值的长度不能小于序列号位数');
                return false;
            }
        });

        $('.serialNumberCount').blur(function(){
            _this.serialNumberCount = $('.serialNumberCount').val();
            _this.getSearialNumberRange(parseInt(_this.serialNumberCount) || 1);
            $('.serialNumberLeft').val(_this.serialNumberLeft);
            $('.serialNumberRight').val(_this.serialNumberRight);
            _this.maxValue = _this.serialNumberRight;
            _this.minValue = _this.serialNumberLeft;

            _this.serialNumberLeft = '1';
            _this.serialNumberRight = '';
        });
    },
    //输入框校验
    validate: function(){
        var reg = new RegExp("^[0-9]*$");

        this.flagValue = $.trim($('.flagInput').val());
        this.passwordCount = $.trim($('.passwordCount').val());
        this.serialNumberLeft = $.trim($('.serialNumberLeft').val());
        this.serialNumberCount = $.trim($('.serialNumberCount').val());
        this.serialNumberRight = $.trim($('.serialNumberRight').val());
        console.log(this.minValue);
        console.log(this.maxValue);
        if (!this.flagValue || !this.passwordCount || !this.serialNumberLeft || !this.serialNumberCount || !this.serialNumberRight||!$.trim($('.cardId').val())){
            alert('所有需要输入的内容都不能为空');
            return false;
        }else if(!reg.test(this.flagValue)||!reg.test(this.passwordCount)||!reg.test(this.serialNumberLeft)||!reg.test(this.serialNumberCount)||!reg.test(this.serialNumberRight)){
            alert('所有输入的内容只能为正整数');
            return false;
        }else if(parseInt(this.minValue) > parseInt(this.maxValue)){
            alert('序列号左边的值不能大于右边的值');
            return false;
        }else if(parseInt(this.flagValue)<0||parseInt(this.passwordCount)<0||parseInt(this.serialNumberLeft)<0||parseInt(this.serialNumberCount)<0||parseInt(this.serialNumberRight)<0){
            alert('所有输入的数字不能小于零');
            return false;
        }else{
            return true;
        }
    },
    //获得序列号的范围
    getSearialNumberRange: function(count){
        this.serialNumberLeft = '1';
        this.serialNumberRight = '';

        if (count == 1){
            this.serialNumberLeft -= 1;
            this.serialNumberRight = 9;
        }else{
            for (var i = 0; i < count; i++){
                this.serialNumberRight+='9';
                if (i == 0){
                    continue;
                }
                this.serialNumberLeft+='0';
            }
        }
    },
    //补零
    fillZero: function(num, n){
        //return (num/Math.pow(10,length)).toFixed(length).substr(2);
        return (Array(n).join(0) + num).slice(-n);
    },
    checkList: function(){
        var tableCount = 0;
        var tables = Math.ceil(((parseInt(this.maxValue) - parseInt(this.minValue)) / 10000));
        var tableStr = '<table width="100%" class="table table-hover tableExcel" style="display:block"><thead><tr><td>标志位</td><td>序列号</td><td>密码</td></tr></thead><tbody></tbody></table>';

        console.log('tables====>', tables);
        if (tables==1){
            tableCount = 1;
        }else{
            tableCount = tables + 1;
        }
        console.log('tableCount====>', tableCount);
        for (var k = 0; k < tableCount; k++){
            $('#tableBox').append(tableStr);
        }

        return tableCount;
    },
    //将生成的数据插入table
    insertDataToTable: function(count){

        var cardItem = [];
        var _this = this;
        var cardId = $.trim($('.cardId').val());
        var sqlTemplate = $.trim($('.template').val());
        
        $('.tipInfo').html('正在生成卡号。。。');

        var time = setTimeout(function() {
            for (var i = parseInt(_this.minValue); i <= parseInt(_this.maxValue); i++){
                var str = _this.flagValue+','+_this.fillZero(i, parseInt(_this.serialNumberCount))+','+_this.getPassword(count);

                var arr = str.split(',');
                window.content.push(arr);

                //txt
                var text = _this.flagValue+_this.fillZero(i, parseInt(_this.serialNumberCount))+_this.getPassword(count);

                var strr = sqlTemplate.replace(/<cardId>/g, cardId);
                var strrr = strr.replace(/<cardNumber>/g, text);
                var strrrr = [strrr];
                window.contentText.push(strrrr);
            }
            clearTimeout(time);
            $('.tipInfo').html('生成完成');
        }, 100);

        return 'csv';

        var content = '';
        var _this = this;

        $('.tipInfo').html('正在生成卡号。。。');
        
        var tableCount = this.checkList();
        var minValue = parseInt(this.minValue);
        var maxValue = parseInt(this.maxValue);

        var time = setTimeout(function() {
            for (var g = 0; g < tableCount; g++){
                for (var q = minValue+g*10000; q <= (g+2)*10000&&q<=maxValue; q++){
                    content += '<tr><td>' + _this.flagValue + '</td><td>' + _this.fillZero(q, parseInt(_this.serialNumberCount)) +'</td><td>' + _this.getPassword(count) + '</td></tr>';
                }
                $($('.tableExcel')[g]).append(content);
                content = '';
            }
            $('.tipInfo').html('生成完成');
        }, 100);

        return '';
        var time = setTimeout(function() {

            for (var i = _this.minValue; i <= _this.maxValue; i++){
                content += '<tr><td>' + _this.flagValue + '</td><td>' + _this.fillZero(i, parseInt(_this.serialNumberCount)) +'</td><td>' + _this.getPassword(count) + '</td></tr>';
            }
            
            $('#tBody').append(content);
            $('.tipInfo').html('生成完成');
            clearTimeout(time);
        }, 100);
    },
    //获取密码
    getPassword: function(count){
        var password = '';
        for (var j = 0; j < count; j++){
            password += this.passwordBox[Math.floor(Math.random()*(this.passwordBox.length-1))];;
        }
        return password;
    },
    dateFormat: function(date, fmt){
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
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
                    .length)));
            }
        }
        return fmt;
    }
};

mainJs.init();
