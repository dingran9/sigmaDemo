function loadSkinList(){
    doPost("/action/systemStyle/list",{resourceType:0},function(objs) {
        if (objs.httpCode == "200") {
            themeArray = {};
            for( var i=0;i<objs.datas.length;i++) {
                themeArray[objs.datas[i].name] = JSON.parse(objs.datas[i].content);
                themeArray[objs.datas[i].name].isDefault = false;
                themeArray[objs.datas[i].name].id = objs.datas[i].id;
                themeArray[objs.datas[i].name].type = objs.datas[i].type;
                if(objs.datas[i].isDefault){
                    themeArray[objs.datas[i].name].isDefault = true;
                }else{

                }
            }

            showSkinConf();
        }
    });
}

function showSkinConf(){

    if(window.location.hash.indexOf("#../../action/biology/idc/skin.html") == 0){
        $(".demo").remove();
        var skinBtnList = "";
        for(var i in themeArray){
            skinBtnList += '<a href="javascript:void(0);" type="' + themeArray[i].type + '"skinId = "'+ themeArray[i].id +'" id="'+i+'" data-skinlogo="img/logo-pale.png"  class="colorbox btn btn-xs txt-color-white margin-top-20" style="background:' + themeArray[i]["logo-bg-color"] + '"><span style="color: white;padding-left: 8px;">'+ i +'</span></a>';
        }
        $('#ribbon').append(
            '<div class="demo  activate"><!--<span id="demo-setting"><i class="fa fa-cog" style="color: #FFF;"></i></span>-->'+
            '<form id="skin-form" class="smart-form" method="post" enctype="multipart/form-data" action="/action/systemStyle/create"> <!--<legend class="no-padding margin-bottom-10 ms-yahei">皮肤</legend><section><label><input name="subscription" id="smart-fixed-nav" type="checkbox" class="checkbox style-0"><span>Fixed header</span></label><label><input type="checkbox" name="terms" id="smart-fixed-ribbon" class="checkbox style-0"><span>Fixed Ribbon</span></label><label><input type="checkbox" name="terms" id="smart-fixed-navigation" class="checkbox style-0"><span>Fixed Navigation</span></label><label><input type="checkbox" name="terms" id="smart-fixed-container" class="checkbox style-0"><span>Inside <b>.container</b> <div class="font-xs text-right">(non-responsive)</div></span></label><label style="display:none;"><input type="checkbox" name="terms" id="smart-rtl" class="checkbox style-0"><span>Right to left <b>(rtl)</b></span></label> <span id="smart-bgimages"></span></section><section><h6 class="margin-top-10 semi-bold margin-bottom-5">Clear Localstorage</h6><a href="javascript:void(0);" class="btn btn-xs btn-block btn-primary" id="reset-smart-widget"><i class="fa fa-refresh"></i> Widget Reset</a></section> <h6 class="margin-top-10 semi-bold margin-bottom-5">SmartAdmin Skins</h6><section id="smart-styles"><a href="javascript:void(0);" id="smart-style-0" data-skinlogo="img/logo.png" class="btn btn-block btn-xs txt-color-white margin-right-5" style="background-color:#4E463F;"><i class="fa fa-check fa-fw" id="skin-checked"></i>Smart Default</a><a href="javascript:void(0);" id="smart-style-1" data-skinlogo="img/logo-white.png" class="btn btn-block btn-xs txt-color-white" style="background:#3A4558;">Dark Elegance</a><a href="javascript:void(0);" id="smart-style-2" data-skinlogo="img/logo-blue.png" class="btn btn-xs btn-block txt-color-darken margin-top-5" style="background:#fff;">Ultra Light</a><a href="javascript:void(0);" id="smart-style-3" data-skinlogo="img/logo-pale.png" class="btn btn-xs btn-block txt-color-white margin-top-5" style="background:#f78c40">Google Skin</a></section>-->'+
            '<h5 class="margin-top-10 semi-bold margin-bottom-5">系统样式</h>'+
            '<section id="smart-styles">' +skinBtnList+
            /*'<a href="javascript:void(0);" id="style1" data-skinlogo="img/logo-pale.png"  class="colorbox btn btn-xs txt-color-white margin-top-5" style="background:#303030"><br><span>style1</span></a>'+
            '<a href="javascript:void(0);" id="style2" data-skinlogo="img/logo-white.png" class="colorbox btn btn-xs txt-color-white margin-top-5" style="background:#25ad9f;"><br><span>style2</span></a>'+
            '<a href="javascript:void(0);" id="style3" data-skinlogo="img/logo-white.png" class="colorbox btn btn-xs txt-color-white margin-top-5" style="background:#22262e;"><br><span>style3</span></a>'+*/
            '</section>'+
            '<h5 class="margin-top-10 semi-bold margin-bottom-5" style="position: relative;">自定义样式</h>'+
            '<h6 class="margin-top-10 semi-bold margin-bottom-5" style="position: relative;"></h>'+
            '<section id="logo-smart-styles">' +
            '<div class="input input-file" style="padding-bottom: 8px;"> <span class="button" style="position: relative;"><input type="hidden" readonly=""  name="resourceType" value="0"><input type="file" id="file" name="file" onchange="this.parentNode.nextSibling.value = this.value;">更换LOGO</span><input type="text" style="display: none;" placeholder="Include some files" readonly=""> </div>(建议大小：110 * 49)'+
            '<h6 class="semi-bold margin-bottom-5"></h>'+
            '<a href="javascript:void(0);" id="custom-logo-style-1" class="btn btn-xs txt-color-white margin-top-5" data-color="#303030" style="background:#303030">Logo Background</a>'+
            '<input data-color="logo-bg-color"  class="form-control" value="#FFFFFF"/>'+
            '</section>'+
            '<h6 class="semi-bold margin-bottom-5" style="margin-top:-20px;"></h>'+
            '<section id="header-smart-styles">' +
            '<a href="javascript:void(0);" id="custom-header-style-1" class="btn btn-xs txt-color-white margin-top-5" data-color="#303030" style="background:#303030">Header Background</a>'+
            '<input data-color="header-bg-color"  class="form-control" value="#FFFFFF" />'+
            '</section>'+
            '<h6 class=" semi-bold margin-bottom-5" style="margin-top: -20px;"></h>'+
            '<section id="header-font-smart-styles">' +
            '<a href="javascript:void(0);" id="custom-header-font-style-1" class="btn btn-xs txt-color-white margin-top-5" data-color="#303030" style="background:#303030">Header Font</a>'+
            '<input data-color="header-font-color"  class="form-control" value="#FFFFFF" />'+
            /*'<a href="javascript:void(0);" id="custom-header-style-1" class="colorbox btn btn-xs txt-color-white margin-top-5" data-color="#FFFFFF" style="background:#FFFFFF;"></a>'+
             '<a href="javascript:void(0);" id="custom-header-style-2" class="colorbox btn btn-xs txt-color-white margin-top-5" data-color="#a2a2a2" style="background:#a2a2a2;"></a>'+
             '<a href="javascript:void(0);" id="custom-header-style-3" class="colorbox btn btn-xs txt-color-white margin-top-5" data-color="#000000" style="background:#000000;"></a>'+*/
            '</section>'+
            '<h6 class="semi-bold margin-bottom-5" style="margin-top: -20px;"></h>'+
            '<section id="left-panel-smart-styles">' +
            '<a href="javascript:void(0);" id="custom-left-panel-style-1" class="btn btn-xs txt-color-white margin-top-5" data-color="#303030" style="background:#303030">Left Nav</a>'+
            '<input data-color="aside-bg-color"  class="form-control" value="#FFFFFF" />'+
            '</section>'+
            '<h6 class=" semi-bold margin-bottom-5" style="margin-top: -20px;"></h>'+
            '<section id="aside-font-smart-styles">' +
            '<a href="javascript:void(0);" id="custom-aside-font-style-1" class="btn btn-xs txt-color-white margin-top-5" data-color="#303030" style="background:#303030">Aside Font</a>'+
            '<input data-color="aside-font-color"  class="form-control" value="#FFFFFF" />'+
            /*'<a href="javascript:void(0);" id="custom-aside-style-1" class="colorbox btn btn-xs txt-color-white margin-top-5" data-color="#FFFFFF" style="background:#FFFFFF;"></a>'+
             '<a href="javascript:void(0);" id="custom-aside-style-2" class="colorbox btn btn-xs txt-color-white margin-top-5" data-color="#a2a2a2" style="background:#a2a2a2;"></a>'+
             '<a href="javascript:void(0);" id="custom-aside-style-3" class="colorbox btn btn-xs txt-color-white margin-top-5" data-color="#000000" style="background:#000000;"></a>'+*/
            '</section>'+
            '<h6 class="semi-bold margin-bottom-5" style="margin-top: -20px;"></h>'+
            '<section id="main-font-smart-styles">' +
            '<a href="javascript:void(0);" id="custom-main-font-style-1" class="btn btn-xs txt-color-white margin-top-5" data-color="#303030" style="background:#303030">Main Color</a>'+
            '<input data-color="main-font-color"  class="form-control" value="#FFFFFF" />'+
            '</section>'+
            '<h6 class="semi-bold margin-bottom-5" style="margin-top: -20px;"></h>'+
            '<section id="main-font-smart-styles">' +
            '<a href="javascript:void(0);" id="custom-btn-bg-style-1" class="btn btn-xs txt-color-white margin-top-5" data-color="#303030" style="background:#303030">Btn Color</a>'+
            '<input data-color="btn-bg-color"  class="form-control" value="#cccccc" />'+
            '</section>'+
            '<h6 class="semi-bold margin-bottom-5" style="margin-top: -20px;"></h>'+
            '<section id="main-font-smart-styles">' +
            '<span id="modifyBtnSpan"><a onclick="modifySkin()" href="javascript:void(0);" id="modifySkinBtn" class="btn btn-xs txt-color-white margin-top-5" data-color="#000000" style="background:#303030;position: relative;">保存更改</a>或</span>'+
            '<input  id="skin-name" maxlength="10" class="form-control" style="position: relative;left:0;display:none;width: 60%; margin-left: 7px;height: 28px;top: 20px;" placeholder="请输入新皮肤名称" />'+
            '<a onclick="showNewSkinNameInput(this)" href="javascript:void(0);" id="newSkin" class="btn btn-xs txt-color-white margin-top-5" data-color="#000000" style="background:#303030;position: relative;">作为新皮肤保存</a>'+
            '<a onclick="saveSkin()" href="javascript:void(0);" id="saveAsNewSkinBtn" class="btn btn-xs txt-color-white margin-top-5" data-color="#000000" style="display:none;background:#303030;width: 30%;left: 65%;position: relative;top: -14px;">保存</a>'+
                '<input type="hidden" name="styleName" value="">'+
                '<input type="hidden" name="styleValue" value="">'+
            '</section>'+
            '</form> </div>'
    );

        $("#content.realContent").addClass("offset-right");
        var smartbgimage =
            "<h6 class='margin-top-10 semi-bold'>Background</h6><img src='img/pattern/graphy-xs.png' data-htmlbg-url='img/pattern/graphy.png' width='22' height='22' class='margin-right-5 bordered cursor-pointer'><img src='img/pattern/tileable_wood_texture-xs.png' width='22' height='22' data-htmlbg-url='img/pattern/tileable_wood_texture.png' class='margin-right-5 bordered cursor-pointer'><img src='img/pattern/sneaker_mesh_fabric-xs.png' width='22' height='22' data-htmlbg-url='img/pattern/sneaker_mesh_fabric.png' class='margin-right-5 bordered cursor-pointer'><img src='img/pattern/nistri-xs.png' data-htmlbg-url='img/pattern/nistri.png' width='22' height='22' class='margin-right-5 bordered cursor-pointer'><img src='img/pattern/paper-xs.png' data-htmlbg-url='img/pattern/paper.png' width='22' height='22' class='bordered cursor-pointer'>";
        $("#smart-bgimages")
            .fadeOut();

        $('#demo-setting')
            .click(function () {
                $('#ribbon .demo')
                    .toggleClass('activate');
                if($(".demo").outerHeight() > 550){
                    $("#main.smart-style-custom").css("height",$(".demo").outerHeight());
                }
                $("#content.realContent").toggleClass("offset-right");
            });


        initSkinSelect();


        var defaultSkinId = getQueryStringWithHash("skinname");
        if(defaultSkinId == undefined || defaultSkinId == null || defaultSkinId == ""){
            for(var i in themeArray){
                if(themeArray[i].isDefault){
                    $("#smart-styles > a#"+ i).trigger("click");
                    for(var j in themeArray[i]){
                        var colorInput = $("input[data-color='"+ j +"']");
                        colorInput.val(themeArray[i][j]);
                        colorInput.prev("a").css("background",themeArray[i][j]);
                    }
                }
            }
            $("#smart-styles > a").each(function(){
                if($(this).attr("type") != "0"){
                    $(this).hide();
                }
            });
            $("#modifyBtnSpan").hide();
            $("#newSkin").html("保存");
            $("#newSkin").trigger("click");
        }else{
            $("#modifyBtnSpan").show();
            $("#newSkin").html("作为新皮肤保存");
            $("#smart-styles > a").each(function(){
                if($(this).attr("id") != defaultSkinId){
                    $(this).hide();
                }
            });

            $("#smart-styles > a#"+ defaultSkinId).trigger("click");
            for(var j in themeArray[defaultSkinId]){
                var colorInput = $("input[data-color='"+ j +"']");
                colorInput.val(themeArray[defaultSkinId][j]);
                colorInput.prev("a").css("background", themeArray[defaultSkinId][j]);
            }
        }


        initLessFile();


    }else{
        $(".demo").remove();
            $("#content.realContent").removeClass("offset-right");
    }
}



function bindColorSelector(id,comentent){
    var obj = $('#'+id);
    obj.colorpicker();
    obj.colorpicker().on('changeColor', function(ev){
        obj.css("background",rgbaToString(ev.color.toRGB()));
        obj.next("input").val(ev.color.toHex());
        skin_components_color[comentent] = ev.color.toHex();
        initLessFile();
    });
}

function initSkinSelect(){
    bindColorSelector("custom-logo-style-1","logo-bg-color");
    onchangeEvent($("#custom-logo-style-1").next("input")[0],inputOnchange);

    bindColorSelector("custom-header-style-1","header-bg-color");
    onchangeEvent($("#custom-header-style-1").next("input")[0],inputOnchange);

    bindColorSelector("custom-left-panel-style-1","aside-bg-color");
    onchangeEvent($("#custom-left-panel-style-1").next("input")[0],inputOnchange);

    onchangeEvent($("#custom-main-font-style-1").next("input")[0],inputOnchange);
    bindColorSelector("custom-main-font-style-1","main-font-color");

    onchangeEvent($("#custom-header-font-style-1").next("input")[0],inputOnchange);
    bindColorSelector("custom-header-font-style-1","header-font-color");

    onchangeEvent($("#custom-aside-font-style-1").next("input")[0],inputOnchange);
    bindColorSelector("custom-aside-font-style-1","aside-font-color");

    onchangeEvent($("#custom-btn-bg-style-1").next("input")[0],inputOnchange);
    bindColorSelector("custom-btn-bg-style-1","btn-bg-color");


    $("#smart-styles > a")
        .bind("click", function () {
            var $this = $(this);
            var $logo = $("#logo img");

            $.logo_.addClass("smart-style-custom");
            $.header_.addClass("smart-style-custom");
            $.left_panel_.addClass("smart-style-custom");

            skin_components_color['logo-bg-color'] = themeArray[$this.attr("id")]["logo-bg-color"];
            skin_components_color['header-bg-color'] = themeArray[$this.attr("id")]["header-bg-color"];
            skin_components_color['aside-bg-color'] = themeArray[$this.attr("id")]["aside-bg-color"];
            skin_components_color['header-font-color'] = themeArray[$this.attr("id")]["header-font-color"];
            skin_components_color['aside-font-color'] = themeArray[$this.attr("id")]["aside-font-color"];
            skin_components_color['main-font-color'] = themeArray[$this.attr("id")]["main-font-color"];
            skin_components_color['btn-bg-color'] = themeArray[$this.attr("id")]["btn-bg-color"];
            initLessFile();
            $("#smart-styles > a #skin-checked")
                .remove();
            $this.prepend(
                "<i class='fa fa-lg fa-check fa-fw' id='skin-checked'></i>"
            );
            for(var j in themeArray[$this.attr("id")]){
                var colorInput = $("input[data-color='"+ j +"']");
                colorInput.val(themeArray[$this.attr("id")][j]);
                colorInput.prev("a").css("background",themeArray[$this.attr("id")][j]);
            }
        });
}

function inputOnchange(){
    var _this = $(this);
    skin_components_color[_this.attr("data-color")] = _this.val();
    $(_this).prev("a").css('background',_this.val());
    initLessFile();
}
// hide bg options


/*
 * STYLES
 */
// Theme demo
var themeArray = {};

var skin_components_color = {
    "logo-bg-color":"#464543",
    "header-bg-color":"#464543",
    "aside-font-color":"#666666",
    "header-font-color":"#FFFFFF",
    "main-font-color":"#3276b1",
    "btn-bg-color":"#cccccc",
    "aside-bg-color":"#f2f2f2"
};

function initLessFile(){
    var aside_li_linear, aside_li_hover;

    var aside_bg_color = skin_components_color["aside-bg-color"];
    if(aside_bg_color.indexOf("#") >= 0){
        aside_bg_color = aside_bg_color.colorRgba();
    }
    aside_li_linear = getGradientColor(aside_bg_color,20);
    aside_li_hover = getGradientColor(aside_bg_color,30);
    less.modifyVars({
        "@header-bg-color":skin_components_color["header-bg-color"],
        "@aside-bg-color":skin_components_color["aside-bg-color"],
        "@aside-font-color":skin_components_color["aside-font-color"],
        "@header-font-color":skin_components_color["header-font-color"],
        "@main-font-color":skin_components_color["main-font-color"],
        "@aside-li-linear":aside_li_linear,
        "@aside-li-hover":aside_li_hover,
        "@btn-bg-color":skin_components_color["btn-bg-color"],
        "@logo-bg-color":skin_components_color["logo-bg-color"]
    });
}

$.logo_ = $("#logo-group.smart-style-custom");
$.header_ = $("#header.smart-style-custom");
$.left_panel_ = $("#left-panel.smart-style-custom");





function saveSkin(){
    var skinName = $.trim($("#skin-name").val());
    if(skinName == "" || skinName == null || skinName == undefined){
        alert("皮肤名称不能为空");
        return;
    }
    var styleValue = JSON.stringify(skin_components_color);
    $("input[name='styleValue']").val(styleValue);
    var styleName = $("#skin-name").val();
    $("input[name='styleName']").val(styleName);
    $("#skin-form").attr("action","/action/systemStyle/create");
    $("#skin-form").submit();
    return;
}

function showNewSkinNameInput(_this){
    $(_this).hide();
    $("#skin-name").show();
    $("#saveAsNewSkinBtn").show();
    //$("#modifySkinBtn").css("top","-30px");
}


function modifySkin(){
    var styleValue = JSON.stringify(skin_components_color);
    $("input[name='styleValue']").val(styleValue);
    var styleName = $("#skin-checked").next("span").html();
    $("input[name='styleName']").val(styleName);

    var styleId = $("#skin-checked").closest("a").attr("skinId");
    $("#skin-form").append("<input name='styleId'  value='"+styleId+"' type='hidden'>");

    $("#skin-form").attr("action","/action/systemStyle/modify");

    $("#skin-form").submit();

    return;
}




/*
function CheckExt(obj) {
    var ImgFileSize;
    var ImgObj = new Image();

    ImgObj.src = obj.value;

    ImgFileSize = Math.round(ImgObj.fileSize / 1024 * 100) / 100;//取得图片文件的大小
    var imgWidth = ImgObj.width; //取得图片的宽度
    var imgHeight = ImgObj.height; //取得图片的高度
}*/
