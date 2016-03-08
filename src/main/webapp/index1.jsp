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
    <title>Sigma-demo</title>
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
    <link rel="shortcut icon" href="static/smartadmin/img/favicon/favicon.ico" type="image/png">
    <link rel="icon" href="static/smartadmin/img/favicon/favicon.ico" type="image/png">

    <!-- GOOGLE FONT -->
    <!--<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700">-->
    <link rel="stylesheet" href="static/smartadmin/fonts/fonts.googleapis.com.css?version=4.2.6.2">
    <link rel="stylesheet" media="screen" href="static/smartadmin/css/products.css?version=4.2.6.2">
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
        <span id="logo" style="margin-top: 7px;">  </span>
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

        <ul >
            <li>
                <a id="defalutPage" href="#"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >字典项管理</span></a>
                <ul>
           			<li>
		                <a id="dictInfoManager" href="#jsp/disease/getdiseaselist.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >字典项信息维护</span></a>
           			</li>
           		</ul>
            </li>
            <li>
                <a href="#"><i class="fa fa-lg fa-fw fa-random"></i> <span class="menu-item-parent" >信息管理</span></a>
                <ul>
           			<li>
		                <a id="diseaseInfoManager" href="#jsp/disease/getdiseaselist.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >疾病信息维护</span></a>
           			</li>
           			<li>
		                <a id="experimentalResultManager" href="#jsp/experimental/experimentallist.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >实验结果维护</span></a>
           			</li>
           			<li>
		                <a id="entryManager" href="#jsp/entry/documentlist.html"><i class="fa fa-lg fa-fw fa-clipboard"></i> <span class="menu-item-parent" >词条信息维护</span></a>
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
        <span class="ribbon-button-alignment" id="breadcrumd-i"> <i class="fa "></i> </span>

        <!-- breadcrumb -->
        <ol class="breadcrumb" style="margin-top: -7;">
            <li>sigma-demo</li><li></li>
        </ol>


    </div>
    <!-- END RIBBON -->

    <!-- MAIN CONTENT -->
    <div id="content" style="margin-left: 11px;height:500px" class="realContent"></div>
    <!-- END MAIN CONTENT -->

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
<script src="static/smartadmin/js/common.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/libs/md5.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/libs/i18n/dynamicLocale.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/libs/i18n/i18n_locale.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/biology/app.js?version=4.2.6.2"></script>
<script src="static/smartadmin/less/less-1.7.0.js?version=4.2.6.2"></script>

<script src="static/smartadmin/js/plugin/colorpicker/bootstrap-colorpicker.js?version=4.2.6.2"></script>
<script src="static/smartadmin/js/skin.js?version=4.2.6.2"></script>


<script>
    $("#main").css("overflow-y","auto");
    $("body").css("overflow-y","none");



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
//         checkURL();
		$("#defalutPage").click();
    });



</script>

</body>


</html>
