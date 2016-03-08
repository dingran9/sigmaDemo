<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8">
    <title>500</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Basic Styles -->
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/bootstrap.css?version=4.2.6.1">
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/font-awesome.min.css?version=4.2.6.1">

    <!-- SmartAdmin Styles : Please note (smartadmin-production.css) was created using LESS variables -->
    <link rel="stylesheet" type="text/css" media="screen" href="static/smartadmin/css/smartadmin-production.css?version=4.2.6.1">

    <!-- Demo purpose only: goes with demo.js, you can delete this css when designing your own WebApp -->
    <link rel="stylesheet" type="text/css" media="screen" href="static/css/biology.css?version=4.2.6.1">
    <!-- FAVICONS -->
    <link rel="shortcut icon" href="static/smartadmin/img/favicon/favicon.ico" type="image/png">
    <link rel="icon" href="static/smartadmin/img/favicon/favicon.ico" type="image/png">
    <!--[if IE 9]>
    <style>
        .error-text {
            color: #333 !important;
        }
    </style>
    <![endif]-->

</head>
<body class="">
<!-- MAIN PANEL -->
<div id="main" role="main" style="width: 100%;margin-left:0;">


    <!-- MAIN CONTENT -->
    <div id="content" style="width:100%;">

        <!-- row -->
        <div class="row" style="margin-top: 50px;">

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                <div class="row">
                    <div class="col-sm-12">
                        <div class="text-center error-box">
                            <h1 class="error-text tada animated"><i class="fa fa-times-circle"></i> Error 500</h1>
                            <h2 class="font-xl" style="color:#444;"><strong><i class="fa fa-fw fa-warning fa-lg text-warning"></i>很抱歉, 服务器内部错误...</strong></h2>
                            <br />
                            <p class="lead semi-bold">
                                <small style="color:#444;">
                                    我们正在努力纠正这一问题，您可以尝试一下操作：
                                </small>
                            </p>
                            <ul class="error-search font-md list-inline" >
                                <li><a href="javascript:history.go(-1);"><small><i class="fa fa-mail-forward"></i>返回重试</small></a></li>
                                <li><a href="/"><small><i class="fa fa-arrow-right"></i>去首页</small></a></li>
                            </ul>
                        </div>

                    </div>

                </div>

            </div>

        </div>
        <!-- end row -->
        <footer class="footer ms-yahei" style="background: url('static/smartadmin/img/mybg.png') repeat scroll 0 0 #fff;color:#444;">
            <div class="container">
                <div class="row row-fluid copyright">

                <p>Copyright © 2012 biology.cn , Inc. All Rights Reserved.  京ICP备12014329号</p>
            </div>
                </div>
        </footer>
    </div>
    <!-- END MAIN CONTENT -->

</div>
<!-- END MAIN PANEL -->


<!--================================================== -->

<!-- PACE LOADER - turn this on if you want ajax loading to show (caution: uses lots of memory on iDevices)-->
<script data-pace-options='{ "restartOnRequestAfter": true }' src="static/smartadmin/js/plugin/pace/pace.min.js?version=4.2.6.1"></script>

<!-- Link to Google CDN's jQuery + jQueryUI; fall back to local -->
<!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js?version=4.2.6.1"></script>-->
<script>
    if (!window.jQuery) {
        document.write('<script src="static/smartadmin/js/libs/jquery-2.0.2.min.js?version=4.2.6.1"><\/script>');
    }
</script>

<script>
    if (!window.jQuery.ui) {
        document.write('<script src="static/smartadmin/js/libs/jquery-ui-1.10.3.min.js?version=4.2.6.1"><\/script>');
    }
</script>

<!-- JS TOUCH : include this plugin for mobile drag / drop touch events
<script src="js/plugin/jquery-touch/jquery.ui.touch-punch.min.js?version=4.2.6.1"></script> -->

<!-- BOOTSTRAP JS -->
<script src="static/smartadmin/js/bootstrap/bootstrap.min.js?version=4.2.6.1"></script>
<!--[if IE 7]>

<h1>您所使用的浏览器版本过低，为保证使用体验，请升级到最新版本。</h1>

<![endif]-->

</body>

</html>