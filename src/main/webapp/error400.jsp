<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8">
<title>400</title>
<meta name="description" content="">
<meta name="author" content="">
<meta name="HandheldFriendly" content="True">
<meta name="MobileOptimized" content="320">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<!-- Basic Styles -->
<link rel="stylesheet" type="text/css" media="screen" href="../../static/smartadmin/css/bootstrap.css?version=4.2.6.1">
<link rel="stylesheet" type="text/css" media="screen" href="../../static/smartadmin/css/font-awesome.min.css?version=4.2.6.1">

<!-- SmartAdmin Styles : Please note (smartadmin-production.css) was created using LESS variables -->
<link rel="stylesheet" type="text/css" media="screen" href="../../static/smartadmin/css/smartadmin-production.css?version=4.2.6.1">

<!-- Demo purpose only: goes with demo.js, you can delete this css when designing your own WebApp -->
<link rel="stylesheet" type="text/css" media="screen" href="../../static/css/biology.css?version=4.2.6.1">
<!-- FAVICONS -->
<link rel="shortcut icon" href="../../static/smartadmin/img/favicon/favicon.ico" type="image/png">
<link rel="icon" href="../../static/smartadmin/img/favicon/favicon.ico" type="image/png">

<style>
#header{
    background-image:none !important;background-color: #464543;
}
.error-text-2 {
    text-align: center;
    font-size: 700%;
    font-weight: bold;
    font-weight: 100;
    color: #333;
    line-height: 1;
    letter-spacing: -.05em;
    background-image: -webkit-linear-gradient(92deg,#333,#ed1c24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.particle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    background-color: #ed1c24;
    background-image: -webkit-linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.3) 75%,rgba(0,0,0,0));
    box-shadow: inset 0 0 1px 1px rgba(0,0,0,.25);
}
.particle--a {
    -webkit-animation: particle-a 1.4s infinite linear;
    -moz-animation: particle-a 1.4s infinite linear;
    -o-animation: particle-a 1.4s infinite linear;
    animation: particle-a 1.4s infinite linear;
}
.particle--b {
    -webkit-animation: particle-b 1.3s infinite linear;
    -moz-animation: particle-b 1.3s infinite linear;
    -o-animation: particle-b 1.3s infinite linear;
    animation: particle-b 1.3s infinite linear;
    background-color: #00A300;
}
.particle--c {
    -webkit-animation: particle-c 1.5s infinite linear;
    -moz-animation: particle-c 1.5s infinite linear;
    -o-animation: particle-c 1.5s infinite linear;
    animation: particle-c 1.5s infinite linear;
    background-color: #57889C;
}@-webkit-keyframes particle-a {
     0% {
         -webkit-transform: translate3D(-3rem,-3rem,0);
         z-index: 1;
         -webkit-animation-timing-function: ease-in-out;
     } 25% {
           width: 1.5rem;
           height: 1.5rem;
       }

     50% {
         -webkit-transform: translate3D(4rem, 3rem, 0);
         opacity: 1;
         z-index: 1;
         -webkit-animation-timing-function: ease-in-out;
     }

     55% {
         z-index: -1;
     }

     75% {
         width: .75rem;
         height: .75rem;
         opacity: .5;
     }

     100% {
         -webkit-transform: translate3D(-3rem,-3rem,0);
         z-index: -1;
     }
 }

@-moz-keyframes particle-a {
    0% {
        -moz-transform: translate3D(-3rem,-3rem,0);
        z-index: 1;
        -moz-animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.5rem;
        height: 1.5rem;
    }

    50% {
        -moz-transform: translate3D(4rem, 3rem, 0);
        opacity: 1;
        z-index: 1;
        -moz-animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .75rem;
        height: .75rem;
        opacity: .5;
    }

    100% {
        -moz-transform: translate3D(-3rem,-3rem,0);
        z-index: -1;
    }
}

@-o-keyframes particle-a {
    0% {
        -o-transform: translate3D(-3rem,-3rem,0);
        z-index: 1;
        -o-animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.5rem;
        height: 1.5rem;
    }

    50% {
        -o-transform: translate3D(4rem, 3rem, 0);
        opacity: 1;
        z-index: 1;
        -o-animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .75rem;
        height: .75rem;
        opacity: .5;
    }

    100% {
        -o-transform: translate3D(-3rem,-3rem,0);
        z-index: -1;
    }
}

@keyframes particle-a {
    0% {
        transform: translate3D(-3rem,-3rem,0);
        z-index: 1;
        animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.5rem;
        height: 1.5rem;
    }

    50% {
        transform: translate3D(4rem, 3rem, 0);
        opacity: 1;
        z-index: 1;
        animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .75rem;
        height: .75rem;
        opacity: .5;
    }

    100% {
        transform: translate3D(-3rem,-3rem,0);
        z-index: -1;
    }
}

@-webkit-keyframes particle-b {
    0% {
        -webkit-transform: translate3D(3rem,-3rem,0);
        z-index: 1;
        -webkit-animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.5rem;
        height: 1.5rem;
    }

    50% {
        -webkit-transform: translate3D(-3rem, 3.5rem, 0);
        opacity: 1;
        z-index: 1;
        -webkit-animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .5rem;
        height: .5rem;
        opacity: .5;
    }

    100% {
        -webkit-transform: translate3D(3rem,-3rem,0);
        z-index: -1;
    }
}

@-moz-keyframes particle-b {
    0% {
        -moz-transform: translate3D(3rem,-3rem,0);
        z-index: 1;
        -moz-animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.5rem;
        height: 1.5rem;
    }

    50% {
        -moz-transform: translate3D(-3rem, 3.5rem, 0);
        opacity: 1;
        z-index: 1;
        -moz-animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .5rem;
        height: .5rem;
        opacity: .5;
    }

    100% {
        -moz-transform: translate3D(3rem,-3rem,0);
        z-index: -1;
    }
}

@-o-keyframes particle-b {
    0% {
        -o-transform: translate3D(3rem,-3rem,0);
        z-index: 1;
        -o-animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.5rem;
        height: 1.5rem;
    }

    50% {
        -o-transform: translate3D(-3rem, 3.5rem, 0);
        opacity: 1;
        z-index: 1;
        -o-animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .5rem;
        height: .5rem;
        opacity: .5;
    }

    100% {
        -o-transform: translate3D(3rem,-3rem,0);
        z-index: -1;
    }
}

@keyframes particle-b {
    0% {
        transform: translate3D(3rem,-3rem,0);
        z-index: 1;
        animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.5rem;
        height: 1.5rem;
    }

    50% {
        transform: translate3D(-3rem, 3.5rem, 0);
        opacity: 1;
        z-index: 1;
        animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .5rem;
        height: .5rem;
        opacity: .5;
    }

    100% {
        transform: translate3D(3rem,-3rem,0);
        z-index: -1;
    }
}

@-webkit-keyframes particle-c {
    0% {
        -webkit-transform: translate3D(-1rem,-3rem,0);
        z-index: 1;
        -webkit-animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.3rem;
        height: 1.3rem;
    }

    50% {
        -webkit-transform: translate3D(2rem, 2.5rem, 0);
        opacity: 1;
        z-index: 1;
        -webkit-animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .5rem;
        height: .5rem;
        opacity: .5;
    }

    100% {
        -webkit-transform: translate3D(-1rem,-3rem,0);
        z-index: -1;
    }
}

@-moz-keyframes particle-c {
    0% {
        -moz-transform: translate3D(-1rem,-3rem,0);
        z-index: 1;
        -moz-animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.3rem;
        height: 1.3rem;
    }

    50% {
        -moz-transform: translate3D(2rem, 2.5rem, 0);
        opacity: 1;
        z-index: 1;
        -moz-animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .5rem;
        height: .5rem;
        opacity: .5;
    }

    100% {
        -moz-transform: translate3D(-1rem,-3rem,0);
        z-index: -1;
    }
}

@-o-keyframes particle-c {
    0% {
        -o-transform: translate3D(-1rem,-3rem,0);
        z-index: 1;
        -o-animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.3rem;
        height: 1.3rem;
    }

    50% {
        -o-transform: translate3D(2rem, 2.5rem, 0);
        opacity: 1;
        z-index: 1;
        -o-animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .5rem;
        height: .5rem;
        opacity: .5;
    }

    100% {
        -o-transform: translate3D(-1rem,-3rem,0);
        z-index: -1;
    }
}

@keyframes particle-c {
    0% {
        transform: translate3D(-1rem,-3rem,0);
        z-index: 1;
        animation-timing-function: ease-in-out;
    }

    25% {
        width: 1.3rem;
        height: 1.3rem;
    }

    50% {
        transform: translate3D(2rem, 2.5rem, 0);
        opacity: 1;
        z-index: 1;
        animation-timing-function: ease-in-out;
    }

    55% {
        z-index: -1;
    }

    75% {
        width: .5rem;
        height: .5rem;
        opacity: .5;
    }

    100% {
        transform: translate3D(-1rem,-3rem,0);
        z-index: -1;
    }
}
</style>

<!--[if IE 9]>
<style>
    .error-text {
        color: #333 !important;
    }
    .particle {
        display:none;
    }

</style>
<![endif]-->

</head>
<body class="">

<!-- MAIN PANEL -->
<div id="main" role="main" style="width:100%;margin-left:0;">


    <!-- MAIN CONTENT -->
    <div id="content">

        <!-- row -->
        <div class="row" style="margin-top: 50px;">

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                <div class="row">
                    <div class="col-sm-12">
                        <div class="text-center error-box">
                            <h1 class="error-text tada animated"><i class="fa fa-spinner fa-spin"></i> Error 400</h1>
                            <h2 class="font-xl"><strong><i class="fa fa-fw fa-warning fa-lg text-warning"></i> 由于语法格式有误，服务器无法理解此请求</strong></h2>
                            <br>
                            <br>

                            <div class="row">

                                <div class="col-sm-12">
                                    <ul class="error-search list-inline font-md ">
                                        <li><a href="javascript:history.go(-1);"><small><i class="fa fa-mail-forward"></i>返回上一页面</small></a></li>
                                        <li><a href="/"><small><i class="fa fa-arrow-right"></i>去首页</small></a></li>
                                    </ul>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <!-- end row -->

</div>
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
<script data-pace-options='{ "restartOnRequestAfter": true }' src="../../static/smartadmin/js/plugin/pace/pace.min.js?version=4.2.6.1"></script>

<!-- Link to Google CDN's jQuery + jQueryUI; fall back to local -->
<!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js?version=4.2.6.1"></script>-->
<script>
    if (!window.jQuery) {
        document.write('<script src="../../static/smartadmin/js/libs/jquery-2.0.2.min.js?version=4.2.6.1"><\/script>');
    }
</script>

<script>
    if (!window.jQuery.ui) {
        document.write('<script src="../../static/smartadmin/js/libs/jquery-ui-1.10.3.min.js?version=4.2.6.1"><\/script>');
    }
</script>

<!-- JS TOUCH : include this plugin for mobile drag / drop touch events
<script src="js/plugin/jquery-touch/jquery.ui.touch-punch.min.js?version=4.2.6.1"></script> -->

<!-- BOOTSTRAP JS -->
<script src="../../static/smartadmin/js/bootstrap/bootstrap.min.js?version=4.2.6.1"></script>

<!--[if IE 7]>

<h1>您所使用的浏览器版本过低，为保证使用体验，请升级到最新版本。</h1>

<![endif]-->

</body>

</html>