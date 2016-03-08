/******************************* 平台组件封装 *********************************/
/**
 * 根据名称获取订单临时字段参数
 * @param extParam
 * @param name
 * @return
 */
function getOrderExtParamValue(extParam,name){
    var value = "";
    if(convertStr(extParam) == ""){
        return value;
    }
//        extParam.split("\\|")[0].split("_")[1];
    var paramArrs = extParam.split("|");
    if(paramArrs.length > 0){
        for (var i=0;i<paramArrs.length;i++){
            var param = paramArrs[i];
            if(param.split("_").length > 1){
                var key = param.split("_")[0];
                var value_ = param.split("_")[1];
                if(name == key){
                    return value_;
                }
            }
        }
    }

    return value;
}

/**
 * 设置订单临时参数
 * @param extParam
 * @param name
 * @param value
 * @return
 */
function setOrderExtParamValue(extParam,name,value){
    var result = "";

    if(convertStr(extParam) == ""){
        return name + "_" + value + "|";
    }
    if(!extParam.contains(name.toString())){
        return extParam + name + "_" + value + "|";
    }
    var paramArrs = extParam.split("|");
    if(paramArrs.length > 0){
        for (var i=0;i<paramArrs.length;i++){
            var param = paramArrs[i];
            var key = param.split("_")[0];
            if(param.split("_").length > 1) {
                var value_ = param.split("_")[1];
                if (name == key) {
                    result += key + "_" + value + "|";
                } else {
                    result += key + "_" + value_ + "|";
                }
            }else{
                if (name == key) {
                    result += key + "_" + value + "|";
                }
            }
        }
    }
    return result;
}

/**
 * 确认框
 * @param title
 * @param msg
 * @param callback
 */
function showConfirm(icon,title,msg,callback,btnId){
    icon = (icon==null || icon == "") ?"fa-refresh":icon;
    $.SmartMessageBox({
        title: "<i class='fa "+icon+"' style='color:green'></i> "+title,
        content: msg,
        buttons: '[取消][确认]'
    }, function (ButtonPressed) {
        if (ButtonPressed == "确认") {
            //$.root_.addClass('animated fadeOutUp');
            callback();
        }
        if(ButtonPressed == "取消"){
            cancelDisabled($("#"+btnId+".accessible"));
            $('#'+btnId).removeClass("disabled");
        }
    });
    //e.preventDefault();
}

/**
 * 显示异常消息
 */
function showErrorMsg(title,msg){
    title=(title=="")?"温馨提示":title;
    $.bigBox({
        title : title,
        content : msg,
        color : "#3a3633",
        icon : "fa fa-warning shake animated",
        //number : "1",
        timeout : 8000
    });
}
/**
 * 显示提示信息
 */
function showMsgs(title,msg,callback,ptimeout){
    var timeout = 5000;
    if(ptimeout !== undefined){
        timeout = ptimeout;
    }
    title=(title=="")?"温馨提示":title;
    $.smallBox({
        title: title,
        content: "<i class='fa fa-clock-o'></i> <i>"+msg+"</i>",
        color: "#5F895F",
        iconSmall: "fa fa-check bounce animated",
        timeout: timeout
    },callback);
}
/**
 * 控制台指定提示信息
 * @param title
 * @param msg
 * @param callback
 */
function showConsoleMsgs(title,msg,callback){
    title=(title=="")?"温馨提示":title;
    $.smallBox({
        title: title,
        content: "<i class='fa fa-clock-o'></i> <i>"+msg+"</i>",
        color: "#5F895F",
        iconSmall: "fa fa-check bounce animated",
        timeout: 0
    },callback);
}
function showMsg(title,msg,time){
    title=(title=="")?"温馨提示":title;
    var timeout=4000;
    if(undefined!=time && null!=time){
        timeout=time;
    }
    $.smallBox({
        title: title,
        content: "<i class='fa fa-clock-o'></i> <i>"+msg+"</i>",
        //color: "#5F895F",
        color: "#4c6e4c",
        iconSmall: "fa fa-check bounce animated",
        timeout: timeout
    });
}
function msgBox(msg) {
    window.alert(msg);
}
/********************************* keyup ************************************/
/**
 * 只能输入数字和.
 */
function keyPressCheck(event){
    var eve = event.keyCode;
    if(eve==0)
        eve = event.charCode;
    if((eve <48 ||  eve >57) && eve !=0 && eve!=46 && eve!=8){
        event.returnValue=false;
        event.preventDefault();
    }
}
/**
 * 只能输入数字
 */
function keyPressNum(event){
    var eve = event.keyCode;
    if(eve==0)
        eve = event.charCode;
    if((eve <48 ||  eve >57) && eve !=0 && eve!=8){
        event.returnValue=false;
        event.preventDefault();
    }
}
/********************************* keyup ************************************/

/********************************* checkbox ************************************/
/**
 * 复选框全选
 * @param name
 */
function selectAll(name){
    $("[name='"+name+"']").prop("checked",true);
}

/**
 * 全不选
 * @param name
 */
function uncheckAll(name){
    $("[name='"+name+"']").removeAttr("checked");
}

/**
 * 反选
 * @param name
 */
function reverseSelect(name){
    $("[name='"+name+"'] :checkbox").each(function () {
        $(this).attr("checked", !$(this).attr("checked"));
    });
}
/********************************* checkbox ************************************/

/********************************* disabled ************************************/
//设置下拉菜单列不可用
function setDisabled(obj){
    obj.addClass("disabled").addClass('btn').addClass("text-left");
}
//取消下拉菜单列不可用
function cancelDisabled(obj){
    obj.removeClass("disabled").removeClass('btn').removeClass("text-left");
}
/********************************* disabled ************************************/
/**
 * 显示异常信息

 function showErrorMsg(errorid,title,msg){
	//error_alert error_title error_msg
	(title=="")?"":$("."+errorid).find(".error_title").text(title);
	(msg=="")?"":$("."+errorid).find(".error_msg").text(msg);
	$("."+errorid).show();
}*/
/**
 * 隐藏异常信息

 function hideErrorMsg(errorid){
	$("."+errorid).hide();
	$("."+errorid).find(".error_title").text("提示");
	$("."+errorid).find(".error_msg").text("The request failed.");
}*/
/******************************* 平台组件封装 end*********************************/

//清空表单信息
function clearForm(id) {
    $("#" + id + "_modal input[type='text']").each(function(index, node) {
        $(this).val("");
    });
    $("#" + id + "_modal input[type='email']").each(function(index, node) {
        $(this).val("");
    });
    $("#" + id + "_modal textarea").each(function(index, node) {
        $(this).val("");
    });
    $("#" + id + "_modal input[type='hidden']").each(function(index, node) {
        // $(this).val("");
    });
    $("#" + id + "_modal input[type='password']").each(function(index, node) {
        $(this).val("");
    });
    $("#" + id + "_modal select").each(function(index, node) {
        $(this).val("");
        $(this).select2("val", "");
    });

    $("#" + id + "_modal .state-error em").each(function(index, node) {
        $(this).remove();
    });
}

function clearModalem(id){
    $("#" + id + "_modal em").each(function(index, node) {
        $(this).remove();
    });
}
/*********************************** select *****************************************/
// 清空
function clearOptions(obj) {
    var len = obj.length;
    for ( var i = len - 1; i >= 0; i--)
        obj.remove(i);
}
// 添加
function addOption(obj, key, val) {
    obj.add(new Option(key, val));
}
/***********************************************************************************/
// 参数返回空
function convertStr(obj,str) {
    if (obj == null || obj == "null" || obj == "undefined" || obj == undefined
        || obj == "0" || obj == 0) {
        if(str){
            return str;
        }else{
            return "";
        }
    }
    return obj;
}

function convertStrToLine(obj) {
    if (obj == null || obj == "null" || obj == "undefined" || obj == undefined) {
        return "--";
    }
    return obj;
}
Array.prototype.unique = function() {
    var res = [], hash = {};
    for(var i=0, elem; (elem = this[i]) != null; i++)  {
        if (!hash[elem])
        {
            res.push(elem);
            hash[elem] = true;
        }
    }
    return res;
}
/**********************************  datetime **************************************/
//计算时间
function calcTime(d, offset) {
    // create Date object for current location
    //d = new Date();

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000*offset));

    // return time as a string
    //return "The local time in " + city + " is " + nd.toLocaleString();
    return nd;
}

// 转换时间
function convertDates(obj){
    if(obj==null)
        return "";
    var year=obj.getFullYear();
    var month=obj.getMonth()+1;    //getMonth返回的月份是从0开始的，因此要加1
    var date=obj.getDate();
    var hh=obj.getHours();
    var mm=obj.getMinutes();
    var ss=obj.getSeconds();
    var temp;
    if(month<10)
        temp=year+"-0"+month;
    else
        temp=year+"-"+month;
    if(date<10)
        temp+="-0"+date;
    else
        temp+="-"+date;
    if(hh<10)
        hh="0"+hh;
    if(mm<10)
        mm="0"+mm;
    if(ss<10)
        ss="0"+ss;
    temp+=" "+hh+":"+mm+":"+ss;
    return temp;
}
/**
 * 转换时间格式字符串 dateString(必填)：时间字符串 formatter(选填) ：格式
 */
Date.prototype.parseString = function(dateString, formatter) {
    var today = new Date();
    if (!dateString || dateString == "") {
        return today;
    }
    if (!formatter || formatter == "") {
        formatter = "yyyy-MM-dd";
    }
    var yearMarker = formatter.replace(/[^y|Y]/g, '');
    var monthMarker = formatter.replace(/[^m|M]/g, '');
    var dayMarker = formatter.replace(/[^d]/g, '');
    var yearPosition = formatter.indexOf(yearMarker);
    var yearLength = yearMarker.length;
    var year = dateString.substring(yearPosition, yearPosition + yearLength) * 1;
    if (yearLength == 2) {
        if (year < 50) {
            year += 2000;
        } else {
            year += 1900;
        }
    }
    var monthPosition = formatter.indexOf(monthMarker);
    var month = dateString.substring(monthPosition, monthPosition
        + monthMarker.length) * 1 - 1;
    var dayPosition = formatter.indexOf(dayMarker);
    var day = dateString.substring(dayPosition, dayPosition + dayMarker.length) * 1;
    // alert(year+"-"+month+"-"+day);
    return new Date(year, month, day);
}

/**
 * 功能:格式化时间 示例:DateUtil.Format("yyyy/MM/dd","Thu Nov 9 20:30:37 UTC+0800 2006
 * "); 返回:2006/11/09
 */
function dateFormat(fmtCode, date) {
    var result, d, arr_d;

    var patrn_now_1 = /^y{4}-M{2}-d{2}\sh{2}:m{2}:s{2}$/;
    var patrn_now_11 = /^y{4}-M{1,2}-d{1,2}\sh{1,2}:m{1,2}:s{1,2}$/;

    var patrn_now_2 = /^y{4}\/M{2}\/d{2}\sh{2}:m{2}:s{2}$/;
    var patrn_now_22 = /^y{4}\/M{1,2}\/d{1,2}\sh{1,2}:m{1,2}:s{1,2}$/;

    var patrn_now_3 = /^y{4}年M{2}月d{2}日\sh{2}时m{2}分s{2}秒$/;
    var patrn_now_33 = /^y{4}年M{1,2}月d{1,2}日\sh{1,2}时m{1,2}分s{1,2}秒$/;

    var patrn_date_1 = /^y{4}-M{2}-d{2}$/;
    var patrn_date_11 = /^y{4}-M{1,2}-d{1,2}$/;

    var patrn_date_2 = /^y{4}\/M{2}\/d{2}$/;
    var patrn_date_22 = /^y{4}\/M{1,2}\/d{1,2}$/;

    var patrn_date_3 = /^y{4}年M{2}月d{2}日$/;
    var patrn_date_33 = /^y{4}年M{1,2}月d{1,2}日$/;

    var patrn_time_1 = /^h{2}:m{2}:s{2}$/;
    var patrn_time_11 = /^h{1,2}:m{1,2}:s{1,2}$/;
    var patrn_time_2 = /^h{2}时m{2}分s{2}秒$/;
    var patrn_time_22 = /^h{1,2}时m{1,2}分s{1,2}秒$/;

    if (!fmtCode) {
        fmtCode = "yyyy/MM/dd hh:mm:ss";
    }
    if (date) {
        d = new Date(date);
        if (isNaN(d)) {
            msgBox("时间参数非法\n正确的时间示例:\nThu Nov 9 20:30:37 UTC+0800 2006\n或\n2006/      10/17");
            return;
        }
    } else {
        d = new Date();
    }

    if (patrn_now_1.test(fmtCode)) {
        arr_d = splitDate(d, true);
        result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd + " " + arr_d.hh
            + ":" + arr_d.mm + ":" + arr_d.ss;
    } else if (patrn_now_11.test(fmtCode)) {
        arr_d = splitDate(d);
        result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd + " " + arr_d.hh
            + ":" + arr_d.mm + ":" + arr_d.ss;
    } else if (patrn_now_2.test(fmtCode)) {
        arr_d = splitDate(d, true);
        result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd + " " + arr_d.hh
            + ":" + arr_d.mm + ":" + arr_d.ss;
    } else if (patrn_now_22.test(fmtCode)) {
        arr_d = splitDate(d);
        result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd + " " + arr_d.hh
            + ":" + arr_d.mm + ":" + arr_d.ss;
    } else if (patrn_now_3.test(fmtCode)) {
        arr_d = splitDate(d, true);
        result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日" + " "
            + arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
    } else if (patrn_now_33.test(fmtCode)) {
        arr_d = splitDate(d);
        result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日" + " "
            + arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
    }

    else if (patrn_date_1.test(fmtCode)) {
        arr_d = splitDate(d, true);
        result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd;
    } else if (patrn_date_11.test(fmtCode)) {
        arr_d = splitDate(d);
        result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd;
    } else if (patrn_date_2.test(fmtCode)) {
        arr_d = splitDate(d, true);
        result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd;
    } else if (patrn_date_22.test(fmtCode)) {
        arr_d = splitDate(d);
        result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd;
    } else if (patrn_date_3.test(fmtCode)) {
        arr_d = splitDate(d, true);
        result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日";
    } else if (patrn_date_33.test(fmtCode)) {
        arr_d = splitDate(d);
        result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日";
    } else if (patrn_time_1.test(fmtCode)) {
        arr_d = splitDate(d, true);
        result = arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
    } else if (patrn_time_11.test(fmtCode)) {
        arr_d = splitDate(d);
        result = arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
    } else if (patrn_time_2.test(fmtCode)) {
        arr_d = splitDate(d, true);
        result = arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
    } else if (patrn_time_22.test(fmtCode)) {
        arr_d = splitDate(d);
        result = arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
    } else {
        msgBox("没有匹配的时间格式!");
        return;
    }

    return result;
}
function splitDate(d, isZero) {
    var yyyy, MM, dd, hh, mm, ss;
    if (isZero) {
        yyyy = d.getYear();
        MM = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1)
            : d.getMonth() + 1;
        dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        mm = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
    } else {
        yyyy = d.getYear();
        MM = d.getMonth() + 1;
        dd = d.getDate();
        hh = d.getHours();
        mm = d.getMinutes();
        ss = d.getSeconds();
    }
    return {
        "yyyy" : yyyy,
        "MM" : MM,
        "dd" : dd,
        "hh" : hh,
        "mm" : mm,
        "ss" : ss
    };
}

/**
 *  时间  new Date(Date.parse(billingEndDate.replace(/-/g,   "/")))
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
/**
 *  字符串格式时间
 */
function StringDate(str){
    return (new Date(Date.parse(str.replace(/-/g,   "/")))).Format("yyyy-MM-dd");

}
function dateCompare(startDate,endDate) {
    var arr=startDate.split("-");
    var starttime=new Date(arr[0],arr[1],arr[2]);
    var starttimes=starttime.getTime();

    var arrs=endDate.split("-");
    var lktime=new Date(arrs[0],arrs[1],arrs[2]);
    var lktimes=lktime.getTime();

    if(starttimes>=lktimes){
        return false;
    }
    return true;
}
function formatDate(date,format) {
    var o = {
        "M+" : date.getMonth()+1, //month
        "d+" : date.getDate(),    //day
        "h+" : date.getHours(),   //hour
        "m+" : date.getMinutes(), //minute
        "s+" : date.getSeconds(), //second
        "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
        "S" : date.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o) if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
                RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
/**********************************  String **************************************/
/**
 * 替换字符串
 * reallyDo ：被替换
 * replaceWith ：替换
 * ignoreCase ：是否忽略大小写
 * str.replaceAll("bb","aaa",false);
 */
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
};


/**********************************  string date **************************************/
//保留一位小数点

function returnFloat1(value) {
    value = Math.round(parseFloat(value) * 10) / 10;
    // if (value.toString().indexOf(".") < 0)
    // value = value.toString() + ".0";
    return value;
}


/**********************************  message **************************************/
/**
 * 提示信息
 * code：状态码
 * message:内容
 */
function rplMessage(code,errorThrown,message){
    if(code == 403 && errorThrown == "Forbidden"){
        window.location.href = "../../../../login.jsp";
    }else if(code == 400){

    }else if(code == 400){

    }else if(code == 400){

    }else{

    }
}
/**********************************  随机生成字符串 **************************************/

function randomString(len){
    len =len || 6;
    var $chars='abcdefghijklmnopqrstuvwxyz0123456789';//ABCDEFGHIJKLMNOPQRSTUVWXYZ
    var maxPos=$chars.length;
    var name="";
    for(i = 0; i < len; i++){
        name+=$chars.charAt(Math.floor(Math.random()*maxPos));
    }
    return name;
}

/**
 * 禁用鼠标右键
 */
function disableRightKey(){
    document.oncontextmenu = function(){return false;};
}
function enableRightKey(){
    document.oncontextmenu = function(){return true;};
}

/**
 * 处理键盘事件 禁止后退键（Backspace）,但是密码或单行、多行文本框除外
 */
function banBackSpace(e){
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源

    var t = obj.type || obj.getAttribute('type');//获取事件源类型

    //获取作为判断条件的事件类型
    var vReadOnly = obj.getAttribute('readonly');
    var vEnabled = obj.getAttribute('enabled');
    //处理null值情况
    vReadOnly = (vReadOnly == null) ? false : vReadOnly;
    vEnabled = (vEnabled == null) ? true : vEnabled;

    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readonly属性为true或enabled属性为false的，则退格键失效
    var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")
        && (vReadOnly==true || vEnabled!=true))?true:false;

    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
        ?true:false;

    //判断
    if(flag2){
        return false;
    }
    if(flag1){
        return false;
    }
}

//禁止后退键 作用于Firefox、Opera
document.onkeypress=banBackSpace;
//禁止后退键  作用于IE、Chrome
document.onkeydown=banBackSpace;



function showThisDetail(obj,id){
    if($(obj).find("span i").hasClass("fa-angle-double-up")){
        $('.'+id).hide();
        $(obj).parent().next().hide();
        $(obj).find("span i").addClass("fa-angle-double-down").removeClass("fa-angle-double-up")
    }else{
        $('.'+id).show();
        $(obj).parent().next().show();
        $(obj).find("span i").addClass("fa-angle-double-up").removeClass("fa-angle-double-down")
    }
}

/**
 * 判断keydown和上一个keyup事件的间隔时间
 * @param id (绑定keyup和keydown事件的元素id)
 * @param interval (触发回调方法的间隔时间)
 * @param callback (满足一定时间间隔后的回调方法)
 */
function getKeydownAndKeyupInterval(id,interval,callback){
    var objectElement = $("#"+ id);

    var timedown = new Date();//初始化keydown事件的触发时间
    var timeup = new Date();//初始化keyup事件的触发时间
    var timeoutID = null;//计时器ID,当需要取消计时器时，使用它

    //绑定keydown事件
    objectElement.on("keydown",function(){
        timedown = new Date();
        if((timedown - timeup) < (interval)){
            clearTimeout(timeoutID);
        }
    });

    //绑定keyup事件
    objectElement.on("keyup",function(){
        timeup = new Date();
        var timeout = Number(interval);
        timeoutID = setTimeout(callback,timeout);
    });
}
/**
 * 将rgba对象{r:0,g:0,b:0,a:1}转换为字符串（rgba(0,0,0,0)）
 * @param rgba rgba对象
 * @param a  重新设置a（透明度）的值
 * @returns {string}
 */
function rgbaToString(rgba,a){
    if(a !== "" && a !== null && a !== undefined ){rgba.a = a;}else{a=rgba.a;}
    return "rgba(" + rgba.r + ","+ rgba.g+ "," + rgba.b+ ","+ a +")";
}
/**参数说明：
 * element 需要做验证的元素
 * func 验证方法
 */
function onchangeEvent(element,func){
    // for IE Browser
    element.onpropertychange = function() {
        func();
    };
    // for not IE Browser
    if (window.addEventListener) {
        element.addEventListener('input', func,false);
    }
}

var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
String.prototype.colorRgba = function(){
    var sColor = this.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return sColorChange;
        /*return "rgba(" + sColorChange.join(",") + ",1)";*/
    }else{
        return sColor;
    }
};

function getGradientColor(sColor,value){
    for(var i=0;i<3;i++){
        if(sColor[i] > 128){
            sColor[i] = sColor[i] - value;
        }else{
            sColor[i] = sColor[i] + value;
        }
    }
    return "rgba(" + sColor.join(",") + ",1)";

}


/**
 * 获取URL中的参数
 * @param name 参数名称
 * @returns {*}
 */
function getQueryStringWithHash(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if(window.location.hash.split("?")[1] == undefined){
        return undefined;
    }else{
        var r = window.location.hash.split("?")[1].match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
}

/**
 * 判断所给Id 是否在制定数组中，如果没有添加进去
 * @param id
 * @param array
 * @returns {*}
 */

function getUniqueSet(id,array){

    if($.inArray(id,array)<0){
        array.push(id);

    }else{
        array.splice($.inArray(id,array),1);
    }

    return array;
}

/**
 * 删除数组中的元素
 * @param arraryObj 操作的数组
 * @param element  被删除的元素
 * @returns {boolean} 如果没有删除任何元素则返回false;
 */
function arrayDelete(arraryObj, element){
    var index = arraryObj.indexOf(element);
    if( index > 0){
        arraryObj.splice(index,index);
    }else if(index == 0){
        arraryObj.shift();
    }else{
        return false;
    }
}


/**
 * 复制到粘贴板
 * @param id  单击对象ID
 */
function copyToClipBoardInit(id){
    var client = new ZeroClipboard( document.getElementById(id) );

    client.on( "ready", function( readyEvent ) {
        // alert( "ZeroClipboard SWF is ready!" );

        client.on( "aftercopy", function( event ) {
            // `this` === `client`
            // `event.target` === the element that was clicked
            //event.target.style.display = "none";
            alert("复制成功！" );
        } );
    } );
}


//IP地址转换
//JavaScript版本的ip2long.php
function ip2long(IP) {

    var i = 0;
    // PHP allows decimal, octal, and hexadecimal IP components.
    // PHP allows between 1 (e.g. 127) to 4 (e.g 127.0.0.1) components.
    IP = IP.match(
        /^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i
    ); // Verify IP format.
    if (!IP) {
        // Invalid format.
        return false;
    }
    // Reuse IP variable for component counter.
    IP[0] = 0;
    for (i = 1; i < 5; i += 1) {
        IP[0] += !! ((IP[i] || '')
            .length);
        IP[i] = parseInt(IP[i]) || 0;
    }
    // Continue to use IP for overflow values.
    // PHP does not allow any component to overflow.
    IP.push(256, 256, 256, 256);
    // Recalculate overflow of last component supplied to make up for missing components.
    IP[4 + IP[0]] *= Math.pow(256, 4 - IP[0]);
    if (IP[1] >= IP[5] || IP[2] >= IP[6] || IP[3] >= IP[7] || IP[4] >= IP[8]) {
        return false;
    }
    return IP[1] * (IP[0] === 1 || 16777216) + IP[2] * (IP[0] <= 2 || 65536) + IP[3] * (IP[0] <= 3 || 256) + IP[4] * 1;
}


/**
 * 计算两个日期中年月日的差
 * @param fromDate
 * @param toDate
 * @returns {{year: number, month: number, day: number}}
 */
function caculateDate(fromDate, toDate){

    if(fromDate == undefined){
        fromDate = new Date();
    }else{
        fromDate = new Date(fromDate);
    }
    if(toDate == undefined){
        toDate = new Date();
    }else{
        toDate = new Date(toDate);
    }

    var years = toDate.getYear() - fromDate.getYear();
    var months = toDate.getMonth() - fromDate.getMonth();
    var days = toDate.getDate() - fromDate.getDate();

    return {year:years,month:months,day:days}

}
