/**
 * ajax工具类
 * @param url
 * @param data
 * @param callback
 */

function doGet(url, data, callback) {
    get(url, data, callback);
}

function doPostLogin(url, data, callback) {
    post(url, data, callback);
}
function doPost(url, data,callback,inUse,a) {
    postHeaderJson(url, data, callback,inUse,a);
}


/**
 * get请求
 * @param url
 * @param data
 * @param callback
 */
function get(url, data, callback) {
    // 对请求数据进行编码
    var _data = null;
    /*if (data != null && data != "")
        _data = encodeURI($.toJSON(data));*/
    // 发送 Http:get 请求
    $.ajax({
        url : url,
        type : 'GET',
//        cache : false,
        //contentType: "application/json; charset=utf-8",
        data : data,
        success : function(json) {
            if(json=='<script type="text/javascript">window.location.href = "/login.jsp";</script>'){
                window.location.replace("/login.jsp");
            }else
            if(json.httpCode == 403 && json.code == "Forbidden.NoPermission"){
                console.log(rpL(json.code),rpL(json.message));
                showErrorMsg("","没有操作权限。");
            }else if(json.httpCode=="403" && json.code =="Forbidden"){
                console.log("code:403 , message:服务器拒绝请求，请检查帐号、口令等参数  ,  code:Frobidden");
                window.location.href = "../../login.jsp";
            }else if(json.httpCode=="400" && json.code =="Operation.UnKnown"){
                console.log("code:400 , message:未知的操作请求  ,  code:Operation.UnKnown");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Parameter.Invalid"){
                console.log("code:400 , message:请求参数无效  ,  code:Parameter.Invalid");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Parameter.Miss"){
                console.log("code:400 , message:缺少参数  ,  code:Parameter.Miss");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Resource.Duplicate"){
                console.log("code:400 , message:资源重复  ,  code:Resource.Duplicate");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Resource.InUse"){
                console.log("code:400 , message:该资源已被使用  ,  code:Resource.InUse");
                showErrorMsg(rpL(json.code),+rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Resource.NotFound"){
                console.log("code:400 , message:该资源已被使用  ,  code:Resource.NotFound");
                showErrorMsg(rpL(json.code),+rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="State.Incorrect"){
                console.log("code:400 , message:"+json.message +" ,  code:State.Incorrect");
                if(json.message.indexOf("notActive")>0){
                    showErrorMsg("温馨提示","未激活状态下不可进行该操作");
                }else if(json.message.indexOf("disable")>0){
                    showErrorMsg("温馨提示","禁用状态下不可进行该操作");
                }else{
                    showErrorMsg("温馨提示","该状态不可进行操作");
                }
            }else if(json.httpCode == 404){
                console.log(rpL(json.code),rpL(json.message));
                console.log("服务器内部出错啦！");
                window.location.href = "../../error404.jsp";
            }else if(json.httpCode == 500){
                console.log(rpL(json.code),rpL(json.message));
                console.log("服务器内部出错啦！");
                window.location.href = "../../error500.jsp";
            }else{
                callback(json);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus.error + "" + errorThrown);
            if(XMLHttpRequest.status == 403 && errorThrown == "Forbidden.NoPermission"){
                showErrorMsg("","没有操作权限。");
            }else if(XMLHttpRequest.status == 403 && errorThrown == "Forbidden"){
                window.location.href = "../../login.jsp";
            }else if(XMLHttpRequest.status == 400 && errorThrown == "Operation.UnKnown"){
                console.log("code:400 , message:未知的操作请求  ,  code:Operation.UnKnown");
                showErrorMsg("","未知的操作请求。");
            }else if(XMLHttpRequest.status == 400 && errorThrown == "Parameter.Invalid"){
                console.log("code:400 , message:请求参数无效  ,  code:Parameter.Invalid");
                showErrorMsg("","请求参数无效");
            }/*else if(XMLHttpRequest.status == 404){
                console.log(textStatus.error + "" + errorThrown);
                console.log("服务器内部出错啦！");
                window.location.href = "../../error404.jsp";
            }*/else if(XMLHttpRequest.status == 500){
                console.log(textStatus.error + "" + errorThrown);
                console.log("服务器内部出错啦！");
                window.location.href = "../../error500.jsp";
            }else{
                console.log("服务器内部出错啦！");
                callback('{"code":"500"}');
            }
        }
   //     dataType : 'json'
    });
}

/**
 * post请求，带Header json格式
 * @param url
 * @param data
 * @param key
 * @param val
 * @param callback
 * @returns
 */
function postHeaderJson(url,data,callback,inUse,a){
    if(a==undefined){
        a=true;
    }
    if(inUse==undefined){
        inUse=false;
    }
    $.ajax({
        type : 'POST',
        url : url,
        data : data,
        success : function(json) {
            if(json=='<script type="text/javascript">window.location.href = "/login.jsp";</script>'){
                window.location.replace("/login.jsp");
            }else
            if(json.httpCode == 403 && json.code == "Forbidden.NoPermission"){
                console.log(rpL(json.code),rpL(json.message));
                showErrorMsg("","没有操作权限。");
            }else if(json.httpCode=="403" && json.code =="Forbidden"){
                console.log("code:403 , message:服务器拒绝请求，请检查帐号、口令等参数  ,  code:Frobidden");
                window.location.href = "../../login.jsp";
            }else if(json.httpCode=="400" && json.code =="Operation.UnKnown"){
                console.log("code:400 , message:未知的操作请求  ,  code:Operation.UnKnown");
                callback(json);
            }else if(json.httpCode=="400" && json.code =="Parameter.Invalid" && !inUse){
                console.log("code:400 , message:请求参数无效  ,  code:Parameter.Invalid");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Parameter.Miss"){
                console.log("code:400 , message:缺少参数  ,  code:Parameter.Miss");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Resource.Duplicate"){
                console.log("code:400 , message:资源重复  ,  code:Resource.Duplicate");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Resource.InUse" && !inUse){
                console.log("code:400 , message:该资源已被使用  ,  code:Resource.InUse");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Resource.NotFound"){
                console.log("code:400 , message:该资源已被使用  ,  code:Resource.NotFound");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="State.Incorrect"){
                console.log("code:400 , message:"+json.message +" ,  code:State.Incorrect");
                if(json.message.indexOf("notActive")>0){
                    showErrorMsg("温馨提示","未激活状态下不可进行该操作");
                }else if(json.message.indexOf("disable")>0){
                    showErrorMsg("温馨提示","禁用状态下不可进行该操作");
                }else{
                    showErrorMsg("温馨提示","该状态不可进行操作");
                }
            }else if(json.httpCode == 404){
                console.log(rpL(json.code),rpL(json.message));
                console.log("服务器内部出错啦！");
                window.location.href = "../../error404.jsp";
            }else if(json.httpCode == 500){
                console.log(rpL(json.code),rpL(json.message));
                console.log("服务器内部出错啦！");
                window.location.href = "../../error500.jsp";
            }else{
                callback(json);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            //console.log(XMLHttpRequest.status)

            console.log(textStatus.error + "" + errorThrown);
            if(XMLHttpRequest.status == 403 && errorThrown == "Forbidden.NoPermission"){
                console.log("没有操作权限。");
            }else if(XMLHttpRequest.status == 403 && errorThrown == "Forbidden"){
                window.location.href = "../../login.jsp";
            }else if(XMLHttpRequest.status == 400 && errorThrown == "Operation.UnKnown"){
                console.log("code:400 , message:未知的操作请求  ,  code:Operation.UnKnown");
                console.log("","未知的操作请求。");
            }else if(XMLHttpRequest.status == 400 && errorThrown == "Parameter.Invalid"){
                console.log("code:400 , message:请求参数无效  ,  code:Parameter.Invalid");
                console.log("","请求参数无效");
            }/*else if(XMLHttpRequest.status == 404){
                console.log(textStatus.error + "" + errorThrown);
                console.log("服务器内部出错啦！");
                window.location.href = "../../error404.jsp";
            }*/else if(XMLHttpRequest.status == 500){
                console.log(textStatus.error + "" + errorThrown);
                console.log("服务器内部出错啦！");
                window.location.href = "../../error500.jsp";
            }else{
                console.log("服务器内部出错啦！");
                callback('{"code":"500"}');
            }

        },
        async : a

    });
}

function post(url, data, callback) {
    // 发送 Http:post 请求
    $.ajax({
        type : 'POST',
        url : url,
        data : data,
        success : function(json) {
            if(json=='<script type="text/javascript">window.location.href = "/login.jsp";</script>'){
                window.location.replace("/login.jsp");
            }else if(json.httpCode == 403 && json.code == "Forbidden.NoPermission"){
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="403" && json.code =="Forbidden"){
                console.log("code:403 , message:服务器拒绝请求，请检查帐号、口令等参数  ,  code:Frobidden");
                window.location.href = "../../login.jsp";
            }else if(json.httpCode=="400" && json.code =="Operation.UnKnown"){
                console.log("code:400 , message:未知的操作请求  ,  code:Operation.UnKnown");
                showErrorMsg(rpL(json.code),rpL(json.message));
                $(".note-error").html(objs.message).show();
            }else if(json.httpCode=="400" && json.code =="Resource.InUse"){
                console.log("code:400 , message:请求参数无效  ,  code:Resource.InUse");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="State.Incorrect"){
                console.log("code:400 , message:"+json.message +" ,  code:State.Incorrect");
                if(json.message.indexOf("notActive")>0){
                    $(".note-error").html("账户未激活").show();
                }else if(json.message.indexOf("disable")>0){
                    $(".note-error").html("账户已被禁用").show();
                }else{
                    $(".note-error").html(json.message).show();
                }
            }else if(json.httpCode=="400" && json.code =="Parameter.Invalid"){
                if(json.message.indexOf("name") >= 0 || json.message.indexOf("password") >= 0){
                    console.log("code:400 , 用户名或密码错误");
                    $(".note-error").html("用户名或密码错误").show();
                }else{
                    console.log("code:400 , message:请求参数无效  ,  code:Parameter.Invalid");
                    $(".note-error").html("服务器内部错误").show();
                }
            }else if(json.httpCode=="400" && json.code =="Parameter.Miss"){
                console.log("code:400 , message:缺少参数  ,  code:Parameter.Miss");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Resource.Duplicate"){
                console.log("code:400 , message:资源重复  ,  code:Resource.Duplicate");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else if(json.httpCode=="400" && json.code =="Resource.NotFound"){
                console.log("code:400 , message:该资源已被使用  ,  code:Resource.NotFound");
                showErrorMsg(rpL(json.code),rpL(json.message));
            }else{
                callback(json);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus.error + "" + errorThrown);
            if(XMLHttpRequest.status == 403 && errorThrown == "Forbidden.NoPermission"){
                showErrorMsg("","没有操作权限。");
                console.log(textStatus.error + "" + errorThrown);
            }else if(XMLHttpRequest.status == 403 && errorThrown == "Forbidden"){
                window.location.href = "../../login.jsp";
            }else if(XMLHttpRequest.status == 400 && errorThrown == "Operation.UnKnown"){
                console.log("code:400 , message:未知的操作请求  ,  code:Operation.UnKnown");
                showErrorMsg("","未知的操作请求。");
            }else if(XMLHttpRequest.status == 400 && errorThrown == "Parameter.Invalid"){
                console.log("code:400 , message:请求参数无效,code:Parameter.Invalid");
                showErrorMsg("","请求参数无效");
            }/*else if(XMLHttpRequest.status == 404){
                console.log(textStatus.error + "" + errorThrown);
                console.log("服务器内部出错啦！");
                window.location.href = "../../error404.jsp";
            }*/else if(XMLHttpRequest.status == 500){
                console.log("服务器内部出错啦！");
                console.log(textStatus.error + "" + errorThrown);
                window.location.href = "../../error500.jsp";
            }else{
                console.log("服务器内部出错啦！");
                callback('{"code":"500"}');
            }
        }
    });
}



/**
 * 功能:
 * 1)去除字符串前后所有空格, 需要设置第2个参数为: false
 * 2)去除字符串中所有空格(包括中间空格,需要设置第2个参数为: true)
 * @param str
 * @param is_global
 * @returns
 */
function trimByCondition(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global)
        result = result.replace(/\s/g,"");
    return result;
}

//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外 
function banBackSpace(e){
    //console.log(event.keyCode)
    var ev = e || window.event;//获取event对象   
    var obj = ev.target || ev.srcElement;//获取事件源     
    var t = obj.type || obj.getAttribute('type');//获取事件源类型     
    //获取作为判断条件的事件类型 
    var vReadOnly = obj.readOnly;
    var vDisabled = obj.disabled;
    //处理undefined值情况 
    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
    vDisabled = (vDisabled == undefined) ? true : vDisabled;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，  
    //并且readOnly属性为true或disabled属性为true的，则退格键失效  
    var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea")
        && (vReadOnly == true || vDisabled == true);
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效    
    var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
    //判断    
    if (flag2 || flag1) return false;
}

function logout(){
    doPost("/action/idcManager/logout",{},function(objs){
        window.location.replace("../../login.jsp");
    });
}