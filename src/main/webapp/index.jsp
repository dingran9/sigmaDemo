<%--
  Created by IntelliJ IDEA.
  User: dingRan
  Date: 2014/9/15
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8">
    <title>管理中心</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <!--清除浏览器缓存 -->
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Basic Styles -->
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/bootstrap.css?version=4.2.6.2">
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/font-awesome.min.css?version=4.2.6.2">

    <!-- SmartAdmin Styles : Please note (smartadmin-production.css) was created using LESS variables -->
    <link rel="stylesheet" type="text/less" media="screen" href="static/smartadmin/less/custom-style.less">
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/smartadmin-production.css?version=4.2.6.2">
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/smartadmin-skins.css?version=4.2.6.2">

    <!-- Demo purpose only: goes with demo.js, you can delete this css when designing your own WebApp -->
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/demo.css?version=4.2.6.2">
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/your_style.css?version=4.2.6.2">

    <!-- FAVICONS -->
<!--     <link rel="shortcut icon" href="static/smartadmin/img/favicon/favicon.ico" type="image/png"> -->
<!--     <link rel="icon" href="static/smartadmin/img/favicon/favicon.ico" type="image/png"> -->

    <!-- GOOGLE FONT -->
    <!--<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">-->
    <%--<link rel="stylesheet" href="../../static/smartadmin/fonts/fonts.googleapis.com.css?version=4.2.6.2">--%>


    <link rel="stylesheet" media="screen" href="static/css/biology.css?version=4.2.6.2">
    <link rel="stylesheet" media="screen" href="static/css/transaction.css?version=4.2.6.2">
    <link rel="stylesheet" media="screen" href="static/css/userCenter.css?version=4.2.6.2">
    <link rel="stylesheet" media="screen" href="static/css/custom.css?version=4.2.6.2">
    <link rel="stylesheet" media="screen" href="static/css/jquery-ui.css?version=4.2.6.2">
    <link rel="stylesheet" media="screen" href="static/css/products.css?version=4.2.6.2">
    <link rel="stylesheet" media="screen" href="static/css/nav.css?version=4.2.6.2">
    <style>
        #logout > span {
            margin: 0 5px;
        }

    </style>
</head>
<body class="smart-style-3">
<!-- possible classes: minified, fixed-ribbon, fixed-header, fixed-width-->

<!-- HEADER -->
<header id="header" class="custom-header" >
    <div id="logo-group" class="nominify-logo-group">

        <!-- PLACE YOUR LOGO HERE -->
        <span id="logo" style="margin-top: 0;"> <img id="logo-img" class="img img-responsive" src="static/smartadmin/img/logo_biology.png" alt="SmartAdmin"> </span>
        <!-- END LOGO PLACEHOLDER -->

    </div>


    <!-- pulled right: nav area -->
    <div class="pull-right" style="right: 10px; position: relative;">


        <!-- logout button -->
        <div id="logout" class="btn-header transparent pull-right" style="line-height: 49px;">
            <%--<span>${accountEmail}</span>--%>
            <%--<span><i class="fa fa-lg fa-envelope"></i><span style="height: 15px;left: 20px;padding-left: 4px;padding-right: 3px;padding-top:2px;position: absolute;top: 10px;width: 15px;background: #ED6636;" class="badge bg-color-red1 inbox-badge" id="user-notice-noRead-size">1</span></span>--%>
            <%--<span> <a style="background-image:none;background-color: #f2f2f2;border: 1px solid #F2f2f2;" href="#" title="修改密码"><i class="fa fa-lg fa-use" style="color: #1b1e24;"></i></a> </span>--%>
                <span data-toggle="dropdown" class="popover-trigger-element dropdown-toggle" style="cursor: pointer;"> <i class="fa fa-lg fa-user"></i></span>


                <!-- Suggestion: populate this list with fetch and push technique -->
                <ul class="dropdown-menu" style="background: #fff;">
                    <li>
                        <span style="cursor: default;clear: both;color: #333333; display: block;font-weight: normal;line-height: 1.42857;padding: 3px 20px;white-space: nowrap;"><span>${accountEmail}</span></span>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a id="editPasswordBtn" href="javascript:void(0);">修改密码</a>
                    </li>

                </ul>
            <span> <a style="background-image:none;background-color: #f2f2f2;border: 1px solid #F2f2f2;" href="#" title="退出"><i class="fa fa-lg fa-power-off" style="color: #1b1e24;"></i></a> </span>
        </div>
        <!-- end logout button -->

    </div>
    <!-- end pulled right: nav area -->


</header>
<!-- END HEADER -->

<!-- Left panel : Navigation area -->
<!-- Note: This width of the aside area can be adjusted through LESS variables -->
<aside id="left-panel" class="icon-not" style="background-color: #1b1e24;">
    <nav>
        <!-- NOTE: Notice the gaps after each icon usage <i></i>..
        Please note that these links work a bit different than
        traditional hre="" links. See documentation for details.
        -->
        <ul class="ms-yahei">
            <li id="defalutPage" >
                <a href="#"><i class="fa fa-lg fa-fw fa-random"></i> <span class="menu-item-parent" >信息管理</span></a>
                <ul>
                    <li>
                        <a id="diseaseInfoManager" href="#jsp/disease/getdiseaselist.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >疾病信息维护</span></a>
                    </li>
                    <li>
                        <a id="entryManager" href="#jsp/entry/documentlist.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >文献信息维护</span></a>
                    </li>
                    <li>
                        <a id="experimentalResultManager" href="#jsp/experimental/experimentallist.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >实验结果维护</span></a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >字典项管理</span></a>
                <ul>
                    <li>
                        <a id="dictInfoManager" href="#jsp/dict/dictmanager.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >字典项信息维护</span></a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >实验检索</span></a>
                <ul>
                    <li>
                        <a id="expSearch" href="#showMe.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >实验检索</span></a>
                    </li>
                </ul>
            </li>
        </ul>

    </nav>
    <span class="minifyme"> <i class="fa fa-arrow-circle-left hit" style="margin-top: 4px;"></i> </span>

</aside>
<!-- END NAVIGATION -->

<!-- MAIN PANEL -->
<div id="main" role="main" style="padding-right: 15px;overflow-x: hidden;">

    <!-- RIBBON -->
    <div id="ribbon" style="margin-left: 14px;">
        <span style="display: none;" id="manager-is-staff"></span>
        <span style="display: none;" id="manager-is-da"></span>
        <span style="display: none;" id="managerId"></span>
        <span class="ribbon-button-alignment" id="breadcrumd-i"> <i class="fa "></i> </span>

        <!-- breadcrumb -->
        <ol class="breadcrumb" style="margin-top: -7;">
            <li>管理中心</li><li></li>
        </ol>


    </div>
    <!-- END RIBBON -->

    <!-- MAIN CONTENT -->
    <div id="content" style="margin-left: 11px;" class="realContent">
<!--     <span><img alt="搜索" src="static/images/search/search.jpg" onclick="searchDisease()"></span> -->
    <span> <img src='static/images/testee.png'></span>
    </div> 
    <!-- END MAIN CONTENT -->

</div>
<!-- 详情 Modal -->
<div class="modal fade" id="edit_password_modal" tabindex="-1" role="dialog" aria-labelledby="edit_password_modal_label" aria-hidden="true">
    <div class="modal-dialog">
        <div class="col-sm-12   col-xs-12 col-md-12 col-lg-12">
            <div class="modal-content">
                <div class="modal-header biology">
                    <a class="close" href="#"  data-dismiss="modal" aria-hidden="true">&times;</a>
                    <h3 class="modal-title" id="disk_d_modal_label">修改密码</h3>
                </div>
                <div class="modal-body">
                    <div class="form-horizontal">
                        <form id="editPassword">
                            <div class="form-group">
                                <label class="col-md-3 col-xs-3 col-sm-3 col-lg-3 control-label">原密码：</label>
                                <div class="col-md-7  col-sm-7 col-xs-7 col-lg-7 ">
                                    <input type="password" placeholder="" maxlength="64" name="oldPassword" class="form-control">

                                </div>
                                <span class="col-md-1 col-xs-1 col-sm-1 col-lg-1" style="color: red;text-align: left;line-height: 30px;">*</span>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 col-xs-3 col-sm-3 col-lg-3 control-label">新密码：</label>
                                <div class="col-md-7  col-sm-7 col-xs-7 col-lg-7 ">
                                    <input type="password" placeholder="" maxlength="64" name="newPassword" id="newPassword" class="form-control">

                                </div>
                                <span class="col-md-1 col-xs-1 col-sm-1 col-lg-1" style="color: red;text-align: left;line-height: 30px;">*</span>
                            </div>
                            <div class="form-group">
                                <label class="col-md-3 col-xs-3 col-sm-3 col-lg-3 control-label">确认密码：</label>
                                <div class="col-md-7  col-sm-7 col-xs-7 col-lg-7 ">
                                    <input type="password" placeholder="" maxlength="64" name="confirmPassword" class="form-control">

                                </div>
                                <span class="col-md-1 col-xs-1 col-sm-1 col-lg-1" style="color: red;text-align: left;line-height: 30px;">*</span>
                            </div>


                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="edit_password_close" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" id="edit_password_confirm"  onclick="editpassword();" class="btn txt-color-darken disabled" data-dismiss="modal">确定</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 详情 end -->
<!-- END MAIN PANEL -->

<!--==================================================-->

<!-- PACE LOADER - turn this on if you want ajax loading to show (caution: uses lots of memory on iDevices)-->
<script data-pace-options='{ "restartOnRequestAfter": true }' src="static/smartadmin/js/plugin/pace/pace.min.js?version=4.2.6.2"></script>

<script>
    if (!window.jQuery) {
        document.write('<script src="static/smartadmin/js/libs/jquery-2.0.2.min.js?version=4.2.6.2"><\/script>');
    }
</script>

<script>
    if (!window.jQuery.ui) {
        document.write('<script src="static/smartadmin/js/libs/jquery-ui-1.10.3.min.js?version=4.2.6.2"><\/script>');
    }
</script>

<!-- JS TOUCH : include this plugin for mobile drag / drop touch events
<script src="js/plugin/jquery-touch/jquery.ui.touch-punch.min.js?version=4.2.6.2"></script> -->

<!-- BOOTSTRAP JS -->
<script src="static/smartadmin/js/bootstrap/bootstrap.min.js?version=4.2.6.2"></script>

<!-- CUSTOM NOTIFICATION -->
<script src="static/smartadmin/js/notification/SmartNotification.js?version=4.2.6.2"></script>

<!-- JARVIS WIDGETS -->
<script src="static/smartadmin/js/smartwidgets/jarvis.widget.min.js?version=4.2.6.2"></script>

<!-- EASY PIE CHARTS -->
<script src="static/smartadmin/js/plugin/easy-pie-chart/jquery.easy-pie-chart.min.js?version=4.2.6.2"></script>

<!-- SPARKLINES -->
<script src="static/smartadmin/js/plugin/sparkline/jquery.sparkline.min.js?version=4.2.6.2"></script>

<!-- JQUERY VALIDATE -->
<script src="static/smartadmin/js/plugin/jquery-validate/jquery.validate.min.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/plugin/jquery-validate/jquery.validate.additional-methods.js?version=4.2.6.2"></script>

<!-- JQUERY MASKED INPUT -->
<%--<script src="../../static/smartadmin/js/plugin/masked-input/jquery.maskedinput.min.js?version=4.2.6.2"></script>--%>

<!-- JQUERY SELECT2 INPUT -->
<script src="static/smartadmin/js/plugin/select2/select2.min.js?version=4.2.6.2"></script>

<!-- JQUERY UI + Bootstrap Slider -->
<script src="static/smartadmin/js/plugin/bootstrap-slider/bootstrap-slider.min.js?version=4.2.6.2"></script>

<!-- browser msie issue fix -->
<script src="static/smartadmin/js/plugin/msie-fix/jquery.mb.browser.min.js?version=4.2.6.2"></script>

<!-- FastClick: For mobile devices -->
<%--<script src="../../static/smartadmin/js/plugin/fastclick/fastclick.js?version=4.2.6.2"></script>--%>

<!--[if IE 8]>

<h1>您的浏览器版本较低，请使用IE9以上版本,也可以使用firefox或者Chrome</h1>

<![endif]-->

<!-- Demo purpose only -->
<!--<script src="js/demo.js?version=4.2.6.2"></script>-->

<!-- MAIN APP JS FILE -->
<script src="static/smartadmin/js/libs/ajax.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/libs/tools.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/biology/common.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/libs/md5.js?version=4.2.6.2"></script>
<script src="static/js/libs/i18n/dynamicLocale.js?version=4.2.6.2"></script>
<script src="static/js/libs/i18n/i18n_locale.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/biology/app.js?version=4.2.6.2"></script>
<script src="static/smartadmin/less/less-1.7.0.js?version=4.2.6.2"></script>
<script src="static/js/libs/jquery.event.drag-2.2.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/libs/copyToClipboard/ZeroClipboard.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/libs/copyToClipboard/ZeroClipboard.swf?version=4.2.6.1"></script>
<script src="static/smartadmin/js/plugin/colorpicker/bootstrap-colorpicker.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/skin.js?version=4.2.6.2"></script>


<script>
    $("#main").css("overflow-y","auto");
    $("body").css("overflow-y","none");

    function editpassword(){
        var managerId = $("#managerId").html();
        var oldPassword = $("input[name='oldPassword']").val();
        var password = $("input[name='newPassword']").val();
        doPost("/action/idcManager/editPassword",{managerId:managerId,oldPassword:hex_md5(oldPassword),password:hex_md5(password)},function(objs){
            if(objs.httpCode === "200"){
                showMsg("操作成功","已成功修改密码",3000);
            }else{
                console.log(objs);
                showErrorMsg("操作失败",rpLRespond(objs.message));
            }
        });
    }

    function validateEditPwdBtn(){
        $("#editPassword").validate({
            onfocusout: function (element) {
                $(element).valid();
            },
            rules:{
                oldPassword:{
                    required:true
                },
                newPassword:{
                    required:true,
                    rangelength:[8,20]
                },
                confirmPassword:{
                    required:true,
                    equalTo:"#newPassword"
                }
            },
            messages:{
                oldPassword:{
                    required:"请输入原密码"
                },
                newPassword:{
                    required:"请输入新密码",
                    rangelength:"密码长度在8到20位之间"
                },
                confirmPassword:{
                    required:"请输入确认密码",
                    equalTo:"两次输入密码不一致"
                }
            },
            highlight: function(element){
                $(element).removeClass('hsa-success').addClass('hsa-error');
                setEditPwdBtnState();
            },

            unhighlight: function(element){
                $(element).removeClass('hsa-error').addClass('hsa-success');
                $(element).nextAll("em").remove();
                setEditPwdBtnState();
            },
            errorPlacement: function (error, element) {
                error.css('text-align','left').css('color','#FC4343').css("float","left");
                element.after(error);
            }
        });
    }

    function setEditPwdBtnState(){
        var size = 0;
        $("#editPassword").find(".hsa-success").each(function(){
            size++;
        });
        if(size === 3){
            $("#edit_password_confirm").addClass("btn-primary").removeClass("disabled").removeClass("txt-color-darken");
        }else{
            $("#edit_password_confirm").removeClass("btn-primary").addClass("disabled").addClass("txt-color-darken");
        }
    }
    $(document).ready(function() {
        // DO NOT REMOVE : GLOBAL FUNCTIONS!
        pageSetUp();
        //$("body").css("width", $(window).width());
        $("body").css("overflow-x","hidden");

        $(window).on('hashchange', function () {
            checkURL();
        });
        $("#left-panel.icon-not > nav > ul > li > a,#left-panel.icon-not > nav > ul > li > ul > li > a")
                .bind("click",function(){if($(this).attr("href")=== window.location.hash){$(window).trigger('hashchange');}});
//        checkURL();
        $("#defalutPage").click();
    });
    
</script>

</body>


</html>
