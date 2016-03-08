/*
 * VARIABLES
 * Description: All Global Vars
 */
$.throttle_delay = 350;
$.menu_speed = 235;
$.navbar_height = 49;

$.root_ = $('body');
$.left_panel = $('#left-panel');
$.shortcut_dropdown = $('#shortcut');

var idc_id="";
var jarvismenu="";
var nav_type=0;

/*
 * DOCUMENT LOADED EVENT
 * Description: Fire when DOM is ready
 */
$(document).ready(function () {

    /*
     * Fire tooltips
     */
    if ($("[rel=tooltip]").length) {
        $("[rel=tooltip]").tooltip();
    }

    //TODO: was moved from window.load due to IE not firing consist
    nav_page_height()

    // 初始化左侧导航
    if (!null) {
        jarvismenu = $('nav ul').jarvismenu({
            accordion: true,
            speed: $.menu_speed,
            closedSign: '<em class="fa fa-expand-o"></em>',
            openedSign: '<em class="fa fa-collapse-o"></em>'
        });
    } else {
        alert("Error - menu anchor does not exist")
    }

    // 收缩左侧导航
    $('.minifyme').click(function (e) {
        $('body').toggleClass("minified");
        if($('body').hasClass("minified")){
            $(".nav_lines").hide();
        }else{
            $(".nav_lines").show();
        }
        $(this).effect("highlight", {}, 500);

        e.preventDefault();
    });
    //点击logo收缩左侧导航
    $('#logo').click(function (e) {
        $('body').toggleClass("minified");
        e.preventDefault();
    });

    // 隐藏导航
    $('#hide-menu >:first-child > a').click(function (e) {
        $('body').toggleClass("hidden-menu");
        e.preventDefault();
    });

    // 高光效果
    $(".login-info").effect("highlight", {}, 1000);

    // 快捷键 (用户名点击时出现的按钮) start
    $('#show-shortcut').unbind("click");
    $('#show-shortcut').click(function (e) {
        if ($.shortcut_dropdown.is(":visible")) {
            shortcut_buttons_hide()
        } else {
            shortcut_buttons_show()
        }
        e.preventDefault();
    });

    // 快捷键 (buttons that appear when clicked on user name)
    // $.shortcut_dropdown.find('a').unbind("click");
    $.shortcut_dropdown.find('a').click(function (e) {
        e.preventDefault();

        window.location = $(this).attr('href');
        setTimeout(shortcut_buttons_hide, 300);

    });

    // 点击区域外，快捷键摁扭消失
    $(document).mouseup(function (e) {
        if (!$.shortcut_dropdown.is(e.target) // 如果点击的目标不是容器...
            && $.shortcut_dropdown.has(e.target).length === 0) {
            shortcut_buttons_hide();
        }
    });

    // 快捷键动画隐藏
    function shortcut_buttons_hide() {
        $.shortcut_dropdown.animate({
            height: "hide"
        }, 300, "easeOutCirc");
        $.root_.removeClass('shortcut-on');
    }

    // 快捷键动画显示
    function shortcut_buttons_show() {
        $.shortcut_dropdown.animate({
            height: "show"
        }, 200, "easeOutCirc")

        $.root_.addClass('shortcut-on');
    }
    //快捷键 (用户名点击时出现的按钮) end


    // 显示隐藏移动搜索领域
    $('#search-mobile').unbind("click");
    $('#search-mobile').click(function () {
        $.root_.addClass('search-mobile');
    });

    $('#cancel-search-js').unbind("click");
    $('#cancel-search-js').click(function () {
        $.root_.removeClass('search-mobile');
    });

    // ACTIVITY 图标边上的头像提示
    // ajax drop
    //$("#activity").hide();
    /*$('#activity').click(function (e) {
     $this = $(this);

     if ($this.find('.badge').hasClass('bg-color-red')) {
     $this.find('.badge').removeClassPrefix('bg-color-');
     $this.find('.badge').text("0");
     // console.log("Ajax call for activity")
     }

     if (!$this.next('.ajax-dropdown').is(':visible')) {
     $this.next('.ajax-dropdown').fadeIn(150);
     $this.addClass('active');
     } else {
     $this.next('.ajax-dropdown')
     $this.removeClass('active')
     }

     var mytest = $this.next('.ajax-dropdown')
     .find('.btn-group > .active > input')
     .attr('id');
     //console.log(mytest)

     e.preventDefault();
     });

     $('input[name="activity"]').change(function () {
     //alert($(this).val())
     $this = $(this);

     url = $this.attr('id');
     container = $('.ajax-notifications');

     loadURL(url, container);
     });

     $(document).mouseup(function (e) {
     // if the target of the click isn't the container...
     if (!$('.ajax-dropdown').is(e.target) && $('.ajax-dropdown').has(e.target).length === 0) {
     $('.ajax-dropdown').fadeOut(150);
     $('.ajax-dropdown').prev().removeClass("active")
     }
     });

     $('button[data-loading-text]').on('click', function () {
     var btn = $(this)
     btn.button('loading')
     setTimeout(function () {btn.button('reset')}, 3000)
     });
     // NOTIFICATION IS PRESENT
     function notification_check() {
     $this = $('#activity > .badge');

     if (parseInt($this.text()) > 0) {
     $this.addClass("bg-color-red bounceIn animated")
     }
     }

     notification_check();
     */
    //ACTIVITY END


    // reset 窗口部件
    $('#refresh').unbind("click");
    $('#refresh').click(function (e) {
        $.SmartMessageBox({
            title: "<i class='fa fa-refresh' style='color:green'></i> 清除缓存",
            content: "你确认要重置所有的个性化定制页面吗?",
            buttons: '[否][是]'
        }, function (ButtonPressed) {
            if (ButtonPressed == "是" && localStorage) {
                //清空本地存储
                localStorage.clear();
                //刷新
                location.reload();
            }
        });
        e.preventDefault();
    });
    //您可以进一步改善您的安全！注销后，关闭浏览器打开。
    $("#hide-editP a").click(function(e){
        validatePwduser();
        //showConfirm("fa-pencil","修改密码","是否要修改密码?",function(){
        //disableRightKey();
        $("#u_pwd_modal").modal("show");
        // });
    });
    $('#u_pwd_modal').on('hidden.bs.modal', function () {
        enableRightKey();
        clearForm("u_pwd");
        $("#btn_uPwd_confirm").addClass("txt-color-darken").addClass("disabled").removeClass("btn-primary");
        $('#u_pwd_modal .form-group').removeClass("has-error").removeClass("has-success");
        $("#u_pwd_modal .help-block,#u_pwd_modal .help-block1").html("");
        $("#u_PwdE_note").show();
    });
    $("#btn_uPwd_confirm").unbind("click");
    $("#btn_uPwd_confirm").on("click",function(){
        $("#u_pwd_modal").modal("hide");
        $("#btn_uPwd_confirm").addClass('disabled');
        var oldPwd = $("#edit_uold_pwd").val();
        var pwd = $("#pwd_u_Pwd").val();

        if(pwd==""||pwd==null){
            showErrorMsg("","用户密码不能为空。");
            return;
        }
        if(oldPwd==""||oldPwd==null){
            showErrorMsg("","原密码不能为空。");
            return;
        }
        getAppUser(function (obj){
            var targetPath = "user" ;
            var idc_id=obj.idcUuid;
            var data = '{"action":"edit_user_password","idcUuid":"'+idc_id+'","password":"'+hex_md5(pwd)+'","oldPassword":"'+hex_md5(oldPwd)+'"}';
            doPost("/action/router.action",data,targetPath,function (objs){
                if(objs.httpCode=="200"){
                    // showMsg("温馨提示","成功修改用户密码!");
                    $("#u_edit_modal").modal('hide');
                    // ask verification
                    $.SmartMessageBox({
                        title: "<i class='fa fa-sign-out txt-color-orangeDark'></i>  <span class='txt-color-orangeDark'><strong>" +
                            $('#a_show-shortcut-name')
                                .text() + "</strong></span> 密码修改成功,请重新登录。",
                        //content: "在你退出之后,关掉浏览器以改善你的安全。",
                        buttons: '[确认]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed == "确认") {
                            $.root_.addClass('animated fadeOutUp');
                            $.root_.removeClass('pace-done');
                            $('#content').show();
                            $("#index_page").hide();
                            setTimeout(userLogout, 1000)
                        }
                    });
                }else if(objs.httpCode=="400" && objs.code=="Parameter.Invalid"){
                    showErrorMsg(rpL(objs.code),"原密码错误");
                }else{
                    console.log("code :" + objs.code + "  msg:"+objs.message);
                    showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
                }
            });
        });
    });
    /**
     * 修改密码验证
     */

    function validatePwduser(){
        var $validator1 = $("#u-pwd-wizard-1").validate({
            onkeyup: function(element) { $(element).valid(); },
            rules: {
                user_editPwd: {
                    required: true,
                    rangelength:[8,20],
                    pwdStrengthValidator:true
                },
                user_editrePwd:{
                    required: true,
                    equalTo:"#pwd_u_Pwd"
                },
                user_oldPwd:{
                    required: true
                }
            },

            messages: {
                user_editPwd:"密码必须为8-20位数字，字母以及@!%+_，如Abcabc123!@是一个合法的密码符",
                user_editrePwd:{
                    required: "请输入重复密码",
                    equalTo:"两次密码不一致"
                },
                user_oldPwd:"请输入原密码"

            },

            highlight: function (element) {
                $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
                if(element.getAttribute("id")=="pwd_u_Pwd"){
                    $('#u_PwdE_note').hide();
                }
                u_v_index3();
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
                if(element.getAttribute("id")=="pwd_u_Pwd"){
                    $('#u_PwdE_note').show();
                }
                u_v_index3();
            },
            errorElement: 'span',
            errorClass: 'help-block',
            errorPlacement: function (error, element) {
                if (element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });
    }

    function u_v_index3(){
        var size=0;
        $('#u_pwd_modal .form-group').each(function () {
            if($(this).hasClass("has-success")){
                size+=1;
            }
        });
        if(3==size){
            $("#btn_uPwd_confirm").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
        }else{
            $("#btn_uPwd_confirm").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
        }
    }

    // logout摁扭
    $('#logout a').unbind("click");
    $('#logout a').click(function (e) {
        //get the link
        $.loginURL = $(this).attr('href');

        // ask verification TODO
        $.SmartMessageBox({
            title: "<i class='fa fa-sign-out txt-color-orangeDark'></i>  <span class='txt-color-orangeDark'><strong> " +
                $('#a_show-shortcut-name')
                    .text()+"</strong></span> 是否登出?",
            //content: "在你退出之后,关掉浏览器以改善你的安全。",
            buttons: '[取消][确认]'
        }, function (ButtonPressed) {
            if (ButtonPressed == "确认") {
                $.root_.addClass('animated fadeOutUp');
                setTimeout(userLogout, 1000)
            }
        });
        e.preventDefault();
    });

    /*
     * logout操作
     */
    function logout() {
        window.location = $.loginURL;
    }
    function userLogout(){
        $.loginURL = 'login.html';
        doPostLogin("/action/logout.action",{},function (objs){
            if(objs.httpCode=="200"){
                window.location = $.loginURL;
            }else{
                if(objs.httpCode=="403"){
                    console.log("code :" + objs.code + "  msg:"+objs.message);
                    window.location = $.loginURL;
                }
            }
        });

    }
});

/*
 * resizer 调整带节流(with throttle)
 * Source: http://benalman.com/code/projects/jquery-resize/examples/resize/
 */

(function ($, window, undefined) {

    var elems = $([]),
        jq_resize = $.resize = $.extend($.resize, {}),
        timeout_id, str_setTimeout = 'setTimeout',
        str_resize = 'resize',
        str_data = str_resize + '-special-event',
        str_delay = 'delay',
        str_throttle = 'throttleWindow';

    jq_resize[str_delay] = $.throttle_delay;

    jq_resize[str_throttle] = true;

    $.event.special[str_resize] = {

        setup: function () {
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);
            elems = elems.add(elem);
            $.data(this, str_data, {
                w: elem.width(),
                h: elem.height()
            });
            if (elems.length === 1) {
                loopy();
            }
        },
        teardown: function () {
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);
            elems = elems.not(elem);
            elem.removeData(str_data);
            if (!elems.length) {
                clearTimeout(timeout_id);
            }
        },

        add: function (handleObj) {
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }
            var old_handler;

            function new_handler(e, w, h) {
                var elem = $(this),
                    data = $.data(this, str_data);
                data.w = w !== undefined ? w : elem.width();
                data.h = h !== undefined ? h : elem.height();

                old_handler.apply(this, arguments);
            }
            if ($.isFunction(handleObj)) {
                old_handler = handleObj;
                return new_handler;
            } else {
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }
    };

    function loopy() {
        timeout_id = window[str_setTimeout](function () {
            elems.each(function () {
                var elem = $(this),
                    width = elem.width(),
                    height = elem.height(),
                    data = $.data(this, str_data);
                if (width !== data.w || height !== data.h) {
                    elem.trigger(str_resize, [data.w = width, data.h = height]);
                }

            });
            loopy();

        }, jq_resize[str_delay]);

    };
})(jQuery, this);

/*
 * 净资产值或＃左杆调整检测 (nav or #left-bar resize detect)
 * Description: changes the page min-width of #CONTENT and NAV when navigation is resized.
 * This is to counter bugs for min page width on many desktop and mobile devices.
 * Note: This script uses JSthrottle technique so don't worry about memory/CPU usage
 */
// 修复页面和导航的高度
function nav_page_height() {
    setHeight = $('#main').height();
    menuHeight = $.left_panel.height();
    windowHeight = $(window).height() - $.navbar_height;
    //set height

    if (setHeight > windowHeight) { // if content height exceedes actual window height and menuHeight
        $.left_panel.css('min-height', setHeight + 'px');
        $.root_.css('min-height', setHeight + $.navbar_height + 'px');
    } else {
        $.left_panel.css('min-height', windowHeight + 'px');
        $.root_.css('min-height', windowHeight + 'px');
    }
}
$('#main').resize(function () {
    nav_page_height();
    check_if_mobile_width();
})

$('nav').resize(function () {
    nav_page_height();
})

function check_if_mobile_width() {
    if ($(window).width() < 979) {
        $.root_.addClass('mobile-view-activated')
    } else if ($.root_.hasClass('mobile-view-activated')) {
        $.root_.removeClass('mobile-view-activated');
    }
}
/* ~ end: nav or #left-bar resize detect */


/*
 * 检测IE版本(detect IE version)
 * Description: A short snippet for detecting versions of IE in JavaScript
 * without resorting to user-agent sniffing
 * RETURNS:
 * If you're not in IE (or IE version is less than 5) then:
 * //ie === undefined
 *
 * If you're in IE (>=5) then you can determine which version:
 * // ie === 7; // IE7
 *
 * Thus, to detect IE:
 * // if (ie) {}
 *
 * And to detect the version:
 * ie === 6 // IE6
 * ie > 7 // IE8, IE9 ...
 * ie < 9 // Anything less than IE9
 */
var ie = (function () {
    var undef, v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);

    return v > 4 ? v : undef;
}());
/* ~ END: DETECT IE VERSION */

/*
 * 自定义菜单插件(custom menu plugin)
 */
$.fn.extend({
    //pass the options variable to the function
    jarvismenu: function (options) {
        var defaults = {
            accordion: 'true',
            speed: 200,
            closedSign: '[+]',
            openedSign: '[-]'
        };

        // Extend our default options with those provided.
        var opts = $.extend(defaults, options);
        //Assign current element to variable, in this case is UL element
        var $this = $(this);

        //add a mark [+] to a multilevel menu
        $("nav li").each(function () {
            if ($(this).find("ul").size() != 0) {
                //add the multilevel sign next to the link
                //if($(this).find("a:first").querySelectorAll("b").length <=0){
                if(!$(this).find("a:first").find("b:first").hasClass("collapse-sign")){
                    $(this).find("a:first")
                        .append("<b class='collapse-sign'>" + opts.closedSign + "</b>");
                    //  }
                }

                //avoid jumping to the top of the page when the href is an #
                if ($(this).find("a:first").attr('href') == "#") {
                    $(this).find("a:first").click(function () {
                        return false;
                    });
                }
            }
        });

        //open active level
        $("nav li.biologyActive").each(function () {
            $(this).parents("ul").slideDown(opts.speed);
            $(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
            $(this).parents("ul").parent("li").addClass("open");
        });
        $("nav li.active").each(function () {
            $(this).parents("ul").slideDown(opts.speed);
            $(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
            $(this).parents("ul").parent("li").addClass("open");
        });
        $("nav li a").unbind("click");
        $("nav li a").click(function () {
            if($(this).parent().hasClass("auth")){
                nav_type=1;
                //可以直接添加 active 但注意此时需要 更新痕迹(update breadcrumb)
                $('nav .biologyActive').removeClass("biologyActive");
                // $('nav .active').removeClass("active");
                $(this).parent().addClass("biologyActive");
            }else{
                nav_type=0;
            }

            if ($(this).parent().find("ul").size() != 0) {
                var li= $(this).parent;
                if (opts.accordion) {
                    //Do nothing when the list is open
                    if (!$(this).parent().find("ul").is(':visible')) {
                        parents = $(this).parent().parents("ul");
                        visible = $this.find("ul:visible");
                        visible.each(function (visibleIndex) {
                            var close = true;
                            parents.each(function (parentIndex) {
                                if (parents[parentIndex] == visible[visibleIndex]) {
                                    close = false;
                                    return false;
                                }
                            });
                            if (close) {
                                if ($(this).parent().find("ul") != visible[visibleIndex]) {
                                    $(visible[visibleIndex]).slideUp(opts.speed, function () {
                                        $(this).parent("li").find("b:first").html(opts.closedSign);
                                        $(this).parent("li").removeClass("open");
                                    });
                                }
                            }
                        });
                    }
                } // end if
                var ac="active";
                if(nav_type==1){
                    ac="biologyActive";
                }
                if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass(ac)) {
                    $(this).parent().find("ul:first").slideUp(opts.speed, function () {
                        $(this).parent("li").removeClass("open");
                        $(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
                    });
                } else {
                    $(this).parent().find("ul:first").slideDown(opts.speed, function () {
                        /*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
                        // $(this).parent("li").addClass("open");
                        $(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
                    });
                } // end else

                if($(this).hasClass("idc_li")){
                    $('nav li.active').removeClass("active");
                    $('nav li.biologyActive').removeClass("biologyActive");
                    var con = $('#content');
                    loadURL("biology/idc.html",con);
                    $(this).parent("li").addClass("active");
                    window.location.hash="#biology/idc.html";
                }
                //点击不同的IDC 时会将地域切换的列表修改成当前IDC下的
                /*  if($(this).hasClass("idcChange")){
                 var idcId=  $(this).attr("id");
                 $("#idc_change_id").text(idcId);
                 initRegion(function(){});//修改地域切换
                 }*/
                if($(this).hasClass("idcChange")){
                    var idcId=  $(this).attr("id");
                    $("#idcId_change_getSource").text(idcId);
                }
            } // end if
            if($(this).hasClass("auth_change_li")){
                $('nav li.active').removeClass("active");
                $('nav li.open').addClass("active");
                $(this).parent().addClass("active");
                var url=$(this).attr("href");
                var con = $('#content');
                loadURL(url,con);
                var hash="#"+url;
                if(window.location.hash!=hash){
                    window.location.hash=hash;
                    $(this).parent().parents("li").addClass("open");
                }
            }
        });
    } // end function
});
/* ~ end: custom menu plugin */

/*
 * 元素存不存在 (element exist or not)
 * Description: returns true or false
 * Usage: $('#myDiv').doesExist();
 */
jQuery.fn.doesExist = function () {
    return jQuery(this).length > 0;
};
/* ~ END: ELEMENT EXIST OR NOT */

/*
 * 初始化表单 (initialize forms)
 * Description: Select2, Masking, Datepicker, Autocomplete
 */
function runAllForms() {
    /*
     * bootstrap滑块插件 (bootstrap slider plugin)
     * Usage:
     * Dependency: js/plugin/bootstrap-slider
     */
    if ($('.slider').length) {
        $('.slider').slider();
    }

    /*
     * select2插件 (select2 plugin)
     * Usage:
     * Dependency: js/plugin/select2/
     */
    if ($('.select2').length) {
        $('.select2').each(function () {
            $this = $(this);
            var width = $this.attr('data-select-width') || '100%',
                _showSearchInput = $this.attr('data-select-search') === 'true';
            $this.select2({
                showSearchInput: _showSearchInput,
                allowClear: true,
                width: width
            });
        });
    }

    /*
     * 遮蔽 (masking)
     * Dependency: js/plugin/masked-input/
     */
    if ($('[data-mask]').length) {
        $('[data-mask]').each(function () {
            $this = $(this);
            var mask = $this.attr('data-mask') || 'error...',
                mask_placeholder = $this.attr('data-mask-placeholder') || 'X';

            $this.mask(mask, {
                placeholder: mask_placeholder
            });
        });
    }

    /*
     * 自动完成 (Autocomplete)
     * Dependency: js/jqui
     */
    if ($('[data-autocomplete]').length) {
        $('[data-autocomplete]').each(function () {
            $this = $(this);
            var availableTags = $this.data('autocomplete') || ["The", "Quick", "Brown", "Fox",
                "Jumps", "Over", "Three", "Lazy", "Dogs"
            ];

            $this.autocomplete({
                source: availableTags
            });
        });
    }

    /*
     * jquery ui 时间插件(jquery ui date)
     * Dependency: js/libs/jquery-ui-1.10.3.min.js
     * Usage:
     */
    if ($('.datepicker').length) {
        $('.datepicker').each(function () {
            $this = $(this);
            var dataDateFormat = $this.attr('data-dateformat') || 'dd.mm.yy';

            $this.datepicker({
                dateFormat: dataDateFormat,
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>'
            });
        });
    }

    /*
     * ajax按钮加载文本(ajax button loading text)
     * Usage: <button type="button" data-loading-text="Loading..." class="btn btn-xs btn-default ajax-refresh"> .. </button>
     */
    $('button[data-loading-text]').on('click', function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
            btn.button('reset')
        }, 3000)
    });
}
/* ~ end: initialize forms */

/*
 * 初始化图表(initialize charts)
 * Description: Sparklines, PieCharts
 */
function runAllCharts() {
    /*
     * 走势图 (sparklines)
     * DEPENDENCY: js/plugins/sparkline/jquery.sparkline.min.js
     * See usage example below...
     */

    /* Usage:
     * 		<div class="sparkline-line txt-color-blue" data-fill-color="transparent" data-sparkline-height="26px">
     *			5,6,7,9,9,5,9,6,5,6,6,7,7,6,7,8,9,7
     *		</div>
     */

    if ($('.sparkline').doesExist()) {
        $('.sparkline').each(function () {
            $this = $(this);
            var sparklineType = $this.data('sparkline-type') || 'bar';

            // 条形图 (bar chart)
            if (sparklineType == 'bar') {
                var barColor = $this.data('sparkline-bar-color') || $this.css('color') || '#0000f0',
                    sparklineHeight = $this.data('sparkline-height') || '26px',
                    sparklineBarWidth = $this.data('sparkline-barwidth') || 5,
                    sparklineBarSpacing = $this.data('sparkline-barspacing') || 2,
                    sparklineNegBarColor = $this.data('sparkline-negbar-color') || '#A90329',
                    sparklineStackedColor = $this.data('sparkline-barstacked-color') || ["#A90329",
                        "#0099c6", "#98AA56", "#da532c", "#4490B1", "#6E9461", "#990099", "#B4CAD3"
                    ];

                $this.sparkline('html', {
                    type: 'bar',
                    barColor: barColor,
                    //type: sparklineType,
                    height: sparklineHeight,
                    barWidth: sparklineBarWidth,
                    barSpacing: sparklineBarSpacing,
                    stackedBarColor: sparklineStackedColor,
                    negBarColor: sparklineNegBarColor,
                    zeroAxis: 'false'
                });
            }

            // 折线图 (line chart)
            if (sparklineType == 'line') {
                var sparklineHeight = $this.data('sparkline-height') || '20px',
                    sparklineWidth = $this.data('sparkline-width') || '90px',
                    thisLineColor = $this.data('sparkline-line-color') || $this.css('color') ||'#0000f0',
                    thisLineWidth = $this.data('sparkline-line-width') || 1,
                    thisFill = $this.data('fill-color') || '#c0d0f0',
                    thisSpotColor = $this.data('sparkline-spot-color') || '#f08000',
                    thisMinSpotColor = $this.data('sparkline-minspot-color') || '#ed1c24',
                    thisMaxSpotColor = $this.data('sparkline-maxspot-color') || '#f08000',
                    thishighlightSpotColor = $this.data('sparkline-highlightspot-color') || '#50f050',
                    thisHighlightLineColor = $this.data('sparkline-highlightline-color') || 'f02020',
                    thisSpotRadius = $this.data('sparkline-spotradius') || 1.5;

                thisChartMinYRange = $this.data('sparkline-min-y') || 'undefined', thisChartMaxYRange =
                    $this.data('sparkline-max-y') || 'undefined', thisChartMinXRange = $this.data(
                    'sparkline-min-x') || 'undefined', thisChartMaxXRange = $this.data(
                    'sparkline-max-x') || 'undefined', thisMinNormValue = $this.data('min-val') ||
                    'undefined', thisMaxNormValue = $this.data('max-val') || 'undefined',
                    thisNormColor = $this.data('norm-color') || '#c0c0c0', thisDrawNormalOnTop =
                    $this.data('draw-normal') || false;

                $this.sparkline('html', {
                    type: 'line',
                    width: sparklineWidth,
                    height: sparklineHeight,
                    lineWidth: thisLineWidth,
                    lineColor: thisLineColor,
                    fillColor: thisFill,
                    spotColor: thisSpotColor,
                    minSpotColor: thisMinSpotColor,
                    maxSpotColor: thisMaxSpotColor,
                    highlightSpotColor: thishighlightSpotColor,
                    highlightLineColor: thisHighlightLineColor,
                    spotRadius: thisSpotRadius,
                    chartRangeMin: thisChartMinYRange,
                    chartRangeMax: thisChartMaxYRange,
                    chartRangeMinX: thisChartMinXRange,
                    chartRangeMaxX: thisChartMaxXRange,
                    normalRangeMin: thisMinNormValue,
                    normalRangeMax: thisMaxNormValue,
                    normalRangeColor: thisNormColor,
                    drawNormalOnTop: thisDrawNormalOnTop
                });
            }

            // 饼图 (pie chart)
            if (sparklineType == 'pie') {

                var pieColors = $this.data('sparkline-piecolor') || ["#B4CAD3", "#4490B1", "#98AA56",
                        "#da532c", "#6E9461", "#0099c6", "#990099", "#717D8A"
                    ],
                    pieWidthHeight = $this.data('sparkline-piesize') || 90,
                    pieBorderColor = $this.data('border-color') || '#45494C',
                    pieOffset = $this.data('sparkline-offset') || 0;

                $this.sparkline('html', {
                    type: 'pie',
                    width: pieWidthHeight,
                    height: pieWidthHeight,
                    tooltipFormat: '<span style="color: {{color}}">&#9679;</span> ({{percent.1}}%)',
                    sliceColors: pieColors,
                    offset: 0,
                    borderWidth: 1,
                    offset: pieOffset,
                    borderColor: pieBorderColor
                });
            }

            // 箱型图 (box plot)
            if (sparklineType == 'box') {

                var thisBoxWidth = $this.data('sparkline-width') || 'auto',
                    thisBoxHeight = $this.data('sparkline-height') || 'auto',
                    thisBoxRaw = $this.data('sparkline-boxraw') || false,
                    thisBoxTarget = $this.data('sparkline-targetval') || 'undefined',
                    thisBoxMin = $this.data('sparkline-min') || 'undefined',
                    thisBoxMax = $this.data('sparkline-max') || 'undefined',
                    thisShowOutlier = $this.data('sparkline-showoutlier') || true,
                    thisIQR = $this.data('sparkline-outlier-iqr') || 1.5,
                    thisBoxSpotRadius = $this.data('sparkline-spotradius') || 1.5,
                    thisBoxLineColor = $this.css('color') || '#000000',
                    thisBoxFillColor = $this.data('fill-color') || '#c0d0f0',
                    thisBoxWhisColor = $this.data('sparkline-whis-color') || '#000000',
                    thisBoxOutlineColor = $this.data('sparkline-outline-color') || '#303030',
                    thisBoxOutlineFill = $this.data('sparkline-outlinefill-color') || '#f0f0f0',
                    thisBoxMedianColor = $this.data('sparkline-outlinemedian-color') || '#f00000',
                    thisBoxTargetColor = $this.data('sparkline-outlinetarget-color') || '#40a020';

                $this.sparkline('html', {
                    type: 'box',
                    width: thisBoxWidth,
                    height: thisBoxHeight,
                    raw: thisBoxRaw,
                    target: thisBoxTarget,
                    minValue: thisBoxMin,
                    maxValue: thisBoxMax,
                    showOutliers: thisShowOutlier,
                    outlierIQR: thisIQR,
                    spotRadius: thisBoxSpotRadius,
                    boxLineColor: thisBoxLineColor,
                    boxFillColor: thisBoxFillColor,
                    whiskerColor: thisBoxWhisColor,
                    outlierLineColor: thisBoxOutlineColor,
                    outlierFillColor: thisBoxOutlineFill,
                    medianColor: thisBoxMedianColor,
                    targetColor: thisBoxTargetColor
                });
            }

            // 子弹(bullet)
            if (sparklineType == 'bullet') {

                var thisBulletHeight = $this.data('sparkline-height') || 'auto',
                    thisBulletWidth = $this.data('sparkline-width') || 2,
                    thisBulletColor = $this.data('sparkline-bullet-color') || '#ed1c24',
                    thisBulletPerformanceColor = $this.data('sparkline-performance-color') || '#3030f0',
                    thisBulletRangeColors = $this.data('sparkline-bulletrange-color') || ["#d3dafe",
                        "#a8b6ff", "#7f94ff"
                    ]

                $this.sparkline('html', {
                    type: 'bullet',
                    height: thisBulletHeight,
                    targetWidth: thisBulletWidth,
                    targetColor: thisBulletColor,
                    performanceColor: thisBulletPerformanceColor,
                    rangeColors: thisBulletRangeColors
                });
            }

            // 分离 (discrete)
            if (sparklineType == 'discrete') {

                var thisDiscreteHeight = $this.data('sparkline-height') || 26,
                    thisDiscreteWidth = $this.data('sparkline-width') || 50,
                    thisDiscreteLineColor = $this.css('color'),
                    thisDiscreteLineHeight = $this.data('sparkline-line-height') || 5,
                    thisDiscreteThrushold = $this.data('sparkline-threshold') || 'undefined',
                    thisDiscreteThrusholdColor = $this.data('sparkline-threshold-color') || '#ed1c24';

                $this.sparkline('html', {
                    type: 'discrete',
                    width: thisDiscreteWidth,
                    height: thisDiscreteHeight,
                    lineColor: thisDiscreteLineColor,
                    lineHeight: thisDiscreteLineHeight,
                    thresholdValue: thisDiscreteThrushold,
                    thresholdColor: thisDiscreteThrusholdColor
                });
            }

            //三态(tristate)
            if (sparklineType == 'tristate') {

                var thisTristateHeight = $this.data('sparkline-height') || 26,
                    thisTristatePosBarColor = $this.data('sparkline-posbar-color') || '#60f060',
                    thisTristateNegBarColor = $this.data('sparkline-negbar-color') || '#f04040',
                    thisTristateZeroBarColor = $this.data('sparkline-zerobar-color') || '#909090',
                    thisTristateBarWidth = $this.data('sparkline-barwidth') || 5,
                    thisTristateBarSpacing = $this.data('sparkline-barspacing') || 2,
                    thisZeroAxis = $this.data('sparkline-zeroaxis') || false;

                $this.sparkline('html', {
                    type: 'tristate',
                    height: thisTristateHeight,
                    posBarColor: thisBarColor,
                    negBarColor: thisTristateNegBarColor,
                    zeroBarColor: thisTristateZeroBarColor,
                    barWidth: thisTristateBarWidth,
                    barSpacing: thisTristateBarSpacing,
                    zeroAxis: thisZeroAxis
                });
            }

            //复合材料 :bar (composite: bar)
            if (sparklineType == 'compositebar') {

                var sparklineHeight = $this.data('sparkline-height') || '20px',
                    sparklineWidth = $this.data('sparkline-width') || '100%',
                    sparklineBarWidth = $this.data('sparkline-barwidth') || 3,
                    thisLineWidth = $this.data('sparkline-line-width') || 1,
                    thisLineColor = $this.data('sparkline-color-top') || '#ed1c24',
                    thisBarColor = $this.data('sparkline-color-bottom') || '#333333'

                $this.sparkline($this.data('sparkline-bar-val'), {
                    type: 'bar',
                    width: sparklineWidth,
                    height: sparklineHeight,
                    barColor: thisBarColor,
                    barWidth: sparklineBarWidth
                    //barSpacing: 5
                });

                $this.sparkline($this.data('sparkline-line-val'), {
                    width: sparklineWidth,
                    height: sparklineHeight,
                    lineColor: thisLineColor,
                    lineWidth: thisLineWidth,
                    composite: true,
                    fillColor: false
                });
            }

            //复合材料：线 (composite: line)
            if (sparklineType == 'compositeline') {

                var sparklineHeight = $this.data('sparkline-height') || '20px',
                    sparklineWidth = $this.data('sparkline-width') || '90px',
                    sparklineValue = $this.data('sparkline-bar-val'),
                    sparklineValueSpots1 = $this.data('sparkline-bar-val-spots-top') || null,
                    sparklineValueSpots2 = $this.data('sparkline-bar-val-spots-bottom') || null,
                    thisLineWidth1 = $this.data('sparkline-line-width-top') || 1,
                    thisLineWidth2 = $this.data('sparkline-line-width-bottom') || 1,
                    thisLineColor1 = $this.data('sparkline-color-top') || '#333333',
                    thisLineColor2 = $this.data('sparkline-color-bottom') || '#ed1c24',
                    thisSpotRadius1 = $this.data('sparkline-spotradius-top') || 1.5,
                    thisSpotRadius2 = $this.data('sparkline-spotradius-bottom') || thisSpotRadius1,
                    thisSpotColor = $this.data('sparkline-spot-color') || '#f08000',
                    thisMinSpotColor1 = $this.data('sparkline-minspot-color-top') || '#ed1c24',
                    thisMaxSpotColor1 = $this.data('sparkline-maxspot-color-top') || '#f08000',
                    thisMinSpotColor2 = $this.data('sparkline-minspot-color-bottom') || thisMinSpotColor1,
                    thisMaxSpotColor2 = $this.data('sparkline-maxspot-color-bottom') || thisMaxSpotColor1,
                    thishighlightSpotColor1 = $this.data('sparkline-highlightspot-color-top') || '#50f050',
                    thisHighlightLineColor1 = $this.data('sparkline-highlightline-color-top') || '#f02020',
                    thishighlightSpotColor2 = $this.data('sparkline-highlightspot-color-bottom') || thishighlightSpotColor1,
                    thisHighlightLineColor2 = $this.data('sparkline-highlightline-color-bottom') || thisHighlightLineColor1,
                    thisFillColor1 = $this.data('sparkline-fillcolor-top') || 'transparent',
                    thisFillColor2 = $this.data('sparkline-fillcolor-bottom') || 'transparent';

                $this.sparkline(sparklineValue, {
                    type: 'line',
                    spotRadius: thisSpotRadius1,

                    spotColor: thisSpotColor,
                    minSpotColor: thisMinSpotColor1,
                    maxSpotColor: thisMaxSpotColor1,
                    highlightSpotColor: thishighlightSpotColor1,
                    highlightLineColor: thisHighlightLineColor1,

                    valueSpots: sparklineValueSpots1,

                    lineWidth: thisLineWidth1,
                    width: sparklineWidth,
                    height: sparklineHeight,
                    lineColor: thisLineColor1,
                    fillColor: thisFillColor1
                });

                $this.sparkline($this.data('sparkline-line-val'), {
                    type: 'line',
                    spotRadius: thisSpotRadius2,

                    spotColor: thisSpotColor,
                    minSpotColor: thisMinSpotColor2,
                    maxSpotColor: thisMaxSpotColor2,
                    highlightSpotColor: thishighlightSpotColor2,
                    highlightLineColor: thisHighlightLineColor2,

                    valueSpots: sparklineValueSpots2,

                    lineWidth: thisLineWidth2,
                    width: sparklineWidth,
                    height: sparklineHeight,
                    lineColor: thisLineColor2,
                    composite: true,
                    fillColor: thisFillColor2
                });
            }
        });
    } // end if

    /*
     * 简易饼图 (easy pie charts)
     * DEPENDENCY: js/plugins/easy-pie-chart/jquery.easy-pie-chart.min.js
     * Usage: <div class="easy-pie-chart txt-color-orangeDark" data-pie-percent="33" data-pie-size="72" data-size="72">
     *			<span class="percent percent-sign">35</span>
     * 	  	  </div>
     */
    if ($('.easy-pie-chart').doesExist()) {

        $('.easy-pie-chart').each(function () {
            $this = $(this);
            var barColor = $this.css('color') || $this.data('pie-color'),
                trackColor = $this.data('pie-track-color') || '#eeeeee',
                size = parseInt($this.data('pie-size')) || 25;
            $this.easyPieChart({
                barColor: barColor,
                trackColor: trackColor,
                scaleColor: false,
                lineCap: 'butt',
                lineWidth: parseInt(size / 8.5),
                animate: 1500,
                rotate: -90,
                size: size,
                onStep: function (value) {
                    this.$el.find('span').text(~~value);
                }
            });
        });
    } // end if
}
/* ~ end: initialize charts */

/*
 * 滚动到首页(scroll to top)
 */
function scrollTop() {
    $("html, body").animate({
        scrollTop: 0
    }, "fast");
}
/* ~ end: scroll to top */

/*
 * 初始化jarvis部件 (initialize jarvis widgets)
 */
function setup_widgets_desktop() {
    if ($('#widget-grid').doesExist()) {
        $('#widget-grid').jarvisWidgets({
            grid: 'article',
            widgets: '.jarviswidget',
            localStorage: true,
            deleteSettingsKey: '#deletesettingskey-options',
            settingsKeyLabel: 'Reset settings?',
            deletePositionKey: '#deletepositionkey-options',
            positionKeyLabel: 'Reset position?',
            sortable: true,
            buttonsHidden: false,
            // toggle button
            toggleButton: true,
            toggleClass: 'fa fa-minus | fa fa-plus',
            toggleSpeed: 200,
            onToggle: function () {},
            // delete btn
            deleteButton: true,
            deleteClass: 'fa fa-times',
            deleteSpeed: 200,
            onDelete: function () {},
            // edit btn
            editButton: true,
            editPlaceholder: '.jarviswidget-editbox',
            editClass: 'fa fa-cog | fa fa-save',
            editSpeed: 200,
            onEdit: function () {},
            // color button
            colorButton: true,
            // full screen
            fullscreenButton: true,
            fullscreenClass: 'fa fa-resize-full | fa fa-resize-small',
            fullscreenDiff: 3,
            onFullscreen: function () {},
            // custom btn
            customButton: false,
            customClass: 'folder-10 | next-10',
            customStart: function () {
                alert('Hello you, this is a custom button...')
            },
            customEnd: function () {
                alert('bye, till next time...')
            },
            // order
            buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
            opacity: 1.0,
            dragHandle: '> header',
            placeholderClass: 'jarviswidget-placeholder',
            indicator: true,
            indicatorTime: 600,
            ajax: true,
            timestampPlaceholder: '.jarviswidget-timestamp',
            timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
            refreshButton: true,
            refreshButtonClass: 'fa fa-refresh',
            labelError: 'Sorry but there was a error:',
            labelUpdated: 'Last Update:',
            labelRefresh: 'Refresh',
            labelDelete: '删除窗口:',
            afterLoad: function () {},
            rtl: false // best not to toggle this!
        });
    }
}


function setup_widgets_ov(id) {
    if ($('#'+id).doesExist()) {
        $('#'+id).jarvisWidgets({
            grid: 'article',
            widgets: '.jarviswidget',
            localStorage: true,
            deleteSettingsKey: '#deletesettingskey-options',
            settingsKeyLabel: 'Reset settings?',
            deletePositionKey: '#deletepositionkey-options',
            positionKeyLabel: 'Reset position?',
            sortable: true,
            buttonsHidden: false,
            // toggle button
            toggleButton: true,
            toggleClass: 'fa fa-minus | fa fa-plus',
            toggleSpeed: 200,
            onToggle: function () {},
            // delete btn
            deleteButton: true,
            deleteClass: 'fa fa-times',
            deleteSpeed: 200,
            onDelete: function () {},
            // edit btn
            editButton: true,
            editPlaceholder: '.jarviswidget-editbox',
            editClass: 'fa fa-cog | fa fa-save',
            editSpeed: 200,
            onEdit: function () {},
            // color button
            colorButton: true,
            // full screen
            fullscreenButton: true,
            fullscreenClass: 'fa fa-resize-full | fa fa-resize-small',
            fullscreenDiff: 3,
            onFullscreen: function () {},
            // custom btn
            customButton: false,
            customClass: 'folder-10 | next-10',
            customStart: function () {
                alert('Hello you, this is a custom button...')
            },
            customEnd: function () {
                alert('bye, till next time...')
            },
            // order
            buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
            opacity: 1.0,
            dragHandle: '> header',
            placeholderClass: 'jarviswidget-placeholder',
            indicator: true,
            indicatorTime: 600,
            ajax: true,
            timestampPlaceholder: '.jarviswidget-timestamp',
            timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
            refreshButton: true,
            refreshButtonClass: 'fa fa-refresh',
            labelError: 'Sorry but there was a error:',
            labelUpdated: 'Last Update:',
            labelRefresh: 'Refresh',
            labelDelete: '删除窗口:',
            afterLoad: function () {},
            rtl: false // best not to toggle this!
        });
    }
}
/* ~ end: initialize jarvis widgets */

/*
 * 该功能只能在网络存在下使用
 * GOOGLE MAPS
 * description: Append google maps to head dynamically
 */
var gMapsLoaded = false;
window.gMapsCallback = function () {
    gMapsLoaded = true;
    $(window).trigger('gMapsLoaded');
}
window.loadGoogleMaps = function () {
    if (gMapsLoaded)
        return window.gMapsCallback();

    var script_tag = document.createElement('script');
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute("src", "http://maps.google.com/maps/api/js?sensor=false&callback=gMapsCallback");
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
}
/* ~ end: google maps */

/*
 * 加载脚本(load scripts)
 * Usage: 加载脚本
 * Define function = myPrettyCode ()...
 * loadScript("js/my_lovely_script.js", myPrettyCode);
 */
var jsArray = "";

function loadScript(scriptName, callback) {
    if (jsArray.indexOf("[" + scriptName + "]") == -1) {
        //List of files added in the form "[filename1],[filename2],etc"
        jsArray += "[" + scriptName + "]";

        // adding the script tag to the head as suggested before
        var body = document.getElementsByTagName('body')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptName;

        // then bind the event to the callback function
        // there are several events for cross browser compatibility
        //script.onreadystatechange = callback;
        script.onload = callback;

        // fire the loading
        body.appendChild(script);
    } else if (callback) { // changed else to else if(callback)
        //console.log("JS file already added!");
        //execute function
        callback();
    }
}
/* ~ end: load scripts */

/*
 * 移除脚本(remove scripts)
 * Usage: 移除脚本
 * Define function = myPrettyCode ()...
 * removeLoadScript("js/my_lovely_script.js", myPrettyCode);
 */

function removeLoadScript(scriptName, callback) {
    if (jsArray.indexOf("[" + scriptName + "]") == -1) {
        //List of files added in the form "[filename1],[filename2],etc"
        jsArray += "[" + scriptName + "]";

        // adding the script tag to the head as suggested before
        var body = document.getElementsByTagName('body')[0];
        var targetElement= "script";
        var targetAttr="src";
        var allSuspects=document.getElementsByTagName(targetElement)
        // fire the loading
        for (var i=body.length; i>=0; i--){
            if (allSuspects[i] && allSuspects[i].getAttribute(targetAttr)!=null && allSuspects[i].getAttribute(targetAttr).indexOf(scriptName)!=-1)
                allSuspects[i].parentNode.removeChild(body[i])
        }
        callback();
    } else if (callback) {
        callback();
    }
}
/* ~ end: load scripts */

/*
 * 应用ajax请求设置 (app ajax request setup)
 * Description: Executes and fetches all ajax requests also
 * updates naivgation elements to active
 */
//$('nav a[href!="#"]').unbind("click");
$('nav').delegate('a[href!="#"]', 'click', function (e) {
//$('nav a[href!="#"]').click(function (e) {
    e.preventDefault();
    $this = $(this);

    // if parent is not active then get hash, or else page is assumed to be loaded
    if (!$this.parent().hasClass("active") && !$this.attr('target')) {
        // update window with hash

        if ($.root_.hasClass('mobile-view-activated')) {
            $.root_.removeClass('hidden-menu');
            window.setTimeout(function () {
                window.location.hash = $this.attr('href')
            }, 250);
            // it may not need this delay...
        } else {
            window.location.hash = $this.attr('href');
        }
    }
});

// fire links with targets on different window
//$('nav a[target="_blank"]').unbind("click");
$('nav').delegate('a[target="_blank"]', 'click', function (e) {
//$('nav a[target="_blank"]').click(function (e) {
    e.preventDefault();
    $this = $(this);

    window.open($this.attr('href'));
});

// fire links with targets on same window
//$('nav a[target="_top"]').unbind("click");
$('nav').delegate('a[target="_top"]', 'click', function (e) {
//$('nav a[target="_top"]').click(function (e) {
    e.preventDefault();
    $this = $(this);

    window.location = ($this.attr('href'));
});

// all links with hash tags are ignored
//$('nav a[href="#"]').unbind("click");
$('nav').delegate('a[href="#"]', 'click', function (e) {
//$('nav a[href="#"]').click(function (e) {
    e.preventDefault();
});


// 检查URL是否存在(check to see if url exists)
function checkURL() {
    //get the url by removing the hash
    url = location.hash.replace(/^#/, '');
    container = $('#content');
    // Do this if url exists (for page refresh, etc...)
    if (url) {
        // remove all active class
        $('nav li.active').removeClass("active");
        //进行修改 统一url地址 同样进行右侧刷新
        if(nav_type==0){
            // match the url and add the active class
            $('nav li.open').removeClass("open");
            $('nav li:has(a[href="' + url + '"])').each(function(){
                if($(this).find('ul').size() == 0){
                    $(this).addClass('active');
                }else{
                    $(this).addClass('open');
                }
            });
        }else{
            $("nav li.open").addClass("biologyActive");
            $('nav .biologyActive').addClass("active");
        }

        title = ($('nav a[href="' + url + '"]').attr('title'))

        // change page title from global var
        document.title = (title || document.title);

        // parse url to jquery
        loadURL(url, container);
    } else {
        // grab the first URL from nav
        $this = $('nav > ul > li:first-child > a[href!="#"]');
        //update hash
        if($this.attr('href')==undefined){
            if($('nav > ul > li > a b').hasClass("collapse-sign")){
                $this= $('nav > ul > li> ul > li:first-child > a[href!="#"]');
                window.location.hash = $this.attr('href');
            }
        }else{
            window.location.hash = $this.attr('href');
        }
    }
}

// 加载ajax页面 (load ajax pages)
function loadURL(url, container) {
    //TODO 验证是否登录
    $.ajax({
        type: "GET",
        url: url,
        dataType: 'html',
        cache: true, // (warning: this will cause a timestamp and will call the request twice)
        beforeSend: function () {
            container.html('<!--<h1><i class="fa fa-cog fa-spin"></i> Loading...</h1>-->');
        },
        complete:function(jqXHR, textStatus){
            if(jqXHR.status=='302'){
                window.location.replace("/login.jsp");
            }
        },
        success: function (data) {
            if(data.indexOf("<title>登录</title>") > 0 ){
                window.location.replace("/login.jsp");
            }else{
                container.css({
                    opacity: '0.0'
                }).html(data).delay(100).animate({
                    opacity: '1.0'
                }, 300);
                drawBreadCrumb();
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            container.html(
                '<h4 style="margin-top:10px; display:block; text-align:left"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>'
            );
            drawBreadCrumb();
        },
        async: false,
        statusCode: {
            302: function() {
            window.location.replace("/login.jsp")
             },
            404: function() {
            container.html(
                '<h4 style="margin-top:10px; display:block; text-align:left"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>'
            );
            drawBreadCrumb();
          }
        }
    });
}

// 更新痕迹(update breadcrumb)
function drawBreadCrumb() {
    //TODO
    $("#ribbon ol.breadcrumb").empty();
    $("#ribbon ol.breadcrumb").append($("<li>主页</li>"));
    $('nav li.active > a').each(function () {
        $("#ribbon ol.breadcrumb").append($("<li></li>").html($.trim($(this).clone().children(".badge").remove().end().text())));
    });
}
/* ~ end: app ajax request setup */

/*
 * 页面设置(page setup)
 * Description: fire certain scripts that run through the page
 * to check for form elements, tooltip activation, popovers, etc...
 */
function pageSetUp() {

    // activate tooltips
    $("[rel=tooltip]").tooltip();

    // activate popovers
    $("[rel=popover]").popover();

    // activate popovers with hover states
    $("[rel=popover-hover]").popover({
        trigger: "hover"
    });

    // activate inline charts
    runAllCharts();

    // setup widgets
    setup_widgets_desktop();

    //setup nav height (dynamic)
    nav_page_height();

    // run form elements
    runAllForms();
}

// Keep only 1 active popover per trigger - also check and hide active popover if user clicks on document
$('body').on('click', function (e) {
    $('[rel="popover"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this)
            .is(e.target) && $(this)
            .has(e.target)
            .length === 0 && $('.popover')
            .has(e.target)
            .length === 0) {
            $(this).popover('hide');
        }
    });
});

function  multilevel(){
    //add a mark [+] to a multilevel menu
    $("nav li").each(function () {
        if ($(this).find("ul").size() != 0) {
            //add the multilevel sign next to the link
            if(!$(this).find("a:first").find("b:first").hasClass("collapse-sign")){
                $(this).find("a:first")
                    .append("<b class='collapse-sign'><em class='fa fa-expand-o'></em></b>");
            }
            //avoid jumping to the top of the page when the href is an #
            if ($(this).find("a:first").attr('href') == "#") {
                $(this).find("a:first").click(function () {
                    return false;
                });
            }
        }
    });
}

function loadMenu(callback){

    // 初始化左侧导航
    if (!null) {
        $('nav ul').jarvismenu({
            accordion: true,
            speed: $.menu_speed,
            closedSign: '<em class="fa fa-expand-o"></em>',
            openedSign: '<em class="fa fa-collapse-o"></em>'
        });
    } else {
        alert("Error - menu anchor does not exist")
    }
    callback();
}


function get_permission_name(){
    doPostLogin("/action/userRole.action",{},function (objs){
        if(objs.httpCode=="200"){
            var permission_items = objs.permissionNames;
            for(var i=0;i<permission_items.length;i++){
                if(permission_items[i].indexOf('add') >= 0){
                    $("[pname="+permission_items[i]+"]").removeClass('disabled');
                }else if(permission_items[i] === 'network_rangeIp'){
                    $("[pname="+permission_items[i]+"]").removeClass('disabled');
                }
                $("[pname="+permission_items[i]+"]").addClass("accessible").show();
            }
        }else{
            showMsg(rpL(objs.code),rpLRespond(objs.message));
        }
    });

}

function getScreen(id,size){
    //console.log("screen="+window.screen.height);
    //可以给方法添加function 参数
    var height=window.screen.height;
    if(height>=900){
        $('#'+id).css("max-height","600px");
    }else if(height<900 && height>800){
        $('#'+id).css("max-height","500px");
    }else if(height<=800 && height>768){
        $('#'+id).css("max-height","450px");
    }else if(height<=768 && height>700){
        $('#'+id).css("max-height","350px");
    }else{
        $('#'+id).css("max-height","300px");
    }
    if(size==1){//小屏类型
        if(height>=900){
            $('#'+id).css("max-height","500px");
        }else if(height<900 && height>800){
            $('#'+id).css("max-height","440px");
        }else if(height<=800 && height>768){
            $('#'+id).css("max-height","380px");
        }else{
            $('#'+id).css("max-height","300px");
        }
    }
}

function loadingChart(id){
    var points={
        chart:{
            renderTo:id,
            inverted:false,
            type:"spline"
        },
        title:{
            text:"正在加载中"
        },
        subtitle:{
            text:""
        },
        xAxis:[],
        yAxis:[],
        plotOptions:{
            spline:{
                lineWidth:1.5,
                fillOpacity:0.1,
                marker:{
                    enabled:false,
                    states:{
                        hover:{
                            enabled:true,
                            radius:2
                        }
                    }
                },
                shadow:false
            }
        },
        legend:{
            align:'center'
        },
        resizeable:true,
        series:[]
    };
    return points;
}


//获取客服信息
function getAppUser(callback){
    doPostLogin("/action/userDetail.action",{},function (objs){
        if(objs.httpCode=="200"){
            callback(objs.userModel);
            $("#a_show-shortcut-name").text(objs.userModel.name);
        }else{
            //获取当前客服信息失败
            console.log("code :" + objs.code + "  msg:"+objs.message);
            window.location.href = "../../login.jsp";
        }

    });
}

function initProductRegion(obj,callback){
    var region = document.getElementById(obj).options;
    clearOptions(region);
    addOption(region,"---正在加载中---","");
    doPost("/action/systemRegion/list",{status:"Available"},function(objs){
        if(objs.httpCode=="200"){
            clearOptions(region);
            if (objs.datas.length > 0) {
                for (var i = 0; i < objs.datas.length; i++) {
                    addOption(region, objs.datas[i].name, objs.datas[i].id);
                }
            }
            callback();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });

}
function initProductImage(obj,callback){
    var image = document.getElementById(obj).options;
    clearOptions(image);
    addOption(image,"---正在加载中---","");
    doPost("/action/systemImage/notUseList",{},function(objs){
        if(objs.httpCode=="200"){
            clearOptions(image);
            if (objs.datas.length > 0) {
                for (var i = 0; i < objs.datas.length; i++) {
                    addOption(image, objs.datas[i].name, objs.datas[i].id);
                }
            }
            callback();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });

}