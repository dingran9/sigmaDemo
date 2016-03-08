<% String userId = "UserId"; %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8">
    <!--清除浏览器缓存 -->
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <title>登录</title>
    <link rel="stylesheet" media="screen" href="static/css/bootstrap.min.css?version=4.2.6.1">
    <link rel="stylesheet" media="screen" href="static/smartadmin/css/font-awesome.min.css?version=4.2.6.1">
    <link rel="stylesheet" media="screen" href="static/css/custom.css?version=4.2.6.1">
</head>
<body>



<div id="login-bg">
<span class="col-lg-4 col-md-4 col-sm-4 col-xs-4"></span>
<div id="login" class="col-lg-4  col-md-4 col-sm-4 col-xs-4" style="margin-top: 8%;padding-bottom: 15px;">
    <div class="col-lg-1 col-md-1"></div>
    <div class=" col-lg-10 col-md-10 col-sm-12 col-xs-12">
    <div class="text-center center-block ">
        <p class="text-center"><img style="margin:0 auto;max-height: 75px;" class="img img-responsive" src="static/images/logo-admin-login.png"></p>
    </div>

    <form id="login-box" class="" style="padding-bottom: 20px;">
        <div id="user-not-login-div"><div class="input-group1 input-group center-block">
            <h4 style="font-family: '微软雅黑';">管理员登录</h4>
        </div>
        <span class="note-error">密码错误</span>
        <div class="input-group1 input-group">
            <input type="text" name="user" class="form-control" placeholder="邮箱 / 手机号">
            <i class="icon-append fa fa-user"></i>
        </div>
        <!--<input style="display: none;">-->
        <div class="input-group1 input-group">
            <input type="password" name="password" class="form-control" placeholder="密码">
            <i class="icon-append fa fa-lock"></i>
        </div>
        <div class="row" style="height: 14px;"></div>
        <div class="input-group1 input-group input-group-sm center-block">
            <a id="loginBtn" onclick="login()" class="btn btn-primary col-lg-12 col-md-12 col-sm-12 " style="margin-top: -20px;">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</a>
        </div></div>
        <div id="user-login-div" style="display: none;height: 200px;padding-top: 50px;">
        <div class="input-group1 input-group" style="font-family: '微软雅黑';">
            您目前已登录账户:<%=session.getAttribute("userAccountEmail")%>
        </div>
        <div class="input-group1 input-group input-group-sm center-block" style="padding-top: 50px;">
            <a onclick="handleLogout()" class="btn btn-primary col-lg-12 col-md-12 col-sm-12 ">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出</a>
        </div>
<%--        <div class="row" style="padding-top: 50px;">
            <section>
                <span class="col col-12 form-group">
                <a href="javascript:void(0);"  onclick="handleLogout()">登出</a>
                </span>
                <span class="col col-12 form-group" style="padding-left: 20px;">
                <a href="javascript:void(0);"  onclick="handleLogout()">切换账号</a>
                </span>
            </section>
        </div>--%>
        </div>
    </form><div class="col-lg-12 col-sm-12 col-md-12" style="height: 14px;"></div>
    </div>
</div>
</div>


<div id="footer">
    Copyright @ 2014 biology.com
</div>
<script src="static/js/libs/jquery.min.js?version=4.2.6.1"></script>
<script src="static/js/libs/jquery-2.0.2.min.js?version=4.2.6.1"></script>
<script src="static/js/libs/bootstrap.js?version=4.2.6.1"></script>
<script src="static/js/jquery-validate/jquery.validate.min.js?version=4.2.6.1"></script>
<script src="static/js/jquery-validate/jquery.validate.additional-methods.js?version=4.2.6.1"></script>
<script src="static/smartadmin/js/libs/ajax.js?version=4.2.6.1"></script>
<script src="static/smartadmin/js/libs/tools.js?version=4.2.6.1"></script>
<script src="static/smartadmin/js/libs/md5.js?version=4.2.6.1"></script>
<script src="static/js/libs/i18n/dynamicLocale.js?version=4.2.6.1"></script>
<script src="static/js/libs/i18n/i18n_locale.js?version=4.2.6.1"></script>
<script src="static/js/login.js?version=4.2.6.1"></script>
<script type="text/javascript">
    if(null==<%=session.getAttribute("userAccountId")%>) {
        $("#user-login-div").hide();
        $("#user-not-login-div").show();
        //session.getAttribute(Constants.SESSION_ID）这是一个实体类，不是一个实体对象，明白？那怎么办？，你们登录的
    }else{
        $("#user-login-div").show();
        $("#user-not-login-div").hide();
        window.location.href = "/action/idcManager/index#../../action/biology/order/order1.html";
    }
    function handleLogout(){
        doPost("/action/idcManager/logout",{},function(objs){
            window.location.replace("login.jsp");
        /*    if(objs.httpCode=="200"){
                $("#user-login-div").hide();
                $("#user-not-login-div").show();
            }else{
                console.log("code :" + objs.code + "  msg:" + objs.message);
            }*/
        });
    }
</script>
</body>
</html>