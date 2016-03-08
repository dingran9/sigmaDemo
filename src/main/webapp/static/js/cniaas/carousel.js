var carouselTable;


function loadcarouselTable(){
    all_carousel_data=null;
    $("#btn_carousel_edit,#btn_carousel_delete").addClass("disabled");
    $("#carousel_list_table").empty().append("<table id='carousel-table' class='table table-responsive table-striped table-bordered table-hover table-text-center'><thead id='carousel-thead' class=''></thead><tbody id='carousel-tbody' class='table-tbody'></tbody></table>");
    $("#carousel-thead").empty().append(
            "<tr><th width='5%'></th>"+
            "<th class='table-thead'>"+rpL("imageSequence")+"</th>"+
                "<th class='table-thead'>"+rpL("图片")+"</th>"+
                "<th class='table-thead'>"+rpL("imageHref")+"</th>"+
            "<th class='table-thead'>"+rpL("remark")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='5' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>";
    $("#carousel-tbody").empty().append(loadStr);
    runcarouselDataTables(function(){
        carouselTable=$("#carousel-table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "bFilter":false,
            "bLengthChange":false,
            "bPaginate":false,
            "bInfo":false,
            "bSort":false,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 6, "desc" ]],
            "sRowSelect": "single",
            "oLanguage": {
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {"sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                "sZeroRecords": "没有检索到数据",
                "sProcessing": "<img src='./loading.gif'/>"
            },
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ]
        });
    });
}
function setSequence(obj){
    var id=$(obj).attr("dataID");
    doPost("/action/systemStyle/sequence",{id:id},function(objs){
        if(objs.httpCode == "200"){
            loadcarouselTable();

        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }
    });
}
function runcarouselDataTables(callback){

    doPost("/action/systemStyle/list",{resourceType:1},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = "";
            for( var i=0;i<data.length;i++){
                var imageType= 'data:image/'+data[i].logoFileName.split(".")[1] +';base64,';
                str += "<tr id='tr_carousel_" + data[i].id + "'>"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='carousel_" + data[i].id + "' type='checkbox' name='cbx_carousel_list' onclick=\"set_carousel_Sel(this,'"+data[i].id+"')\">"+
                    "<i></i></label></td>"+
                    "<td><span id='sequence_dataID_"+data[i].id+"'>"+ (i+1) +"</span><a style='margin-left: 10px;' dataID='"+data[i].id+"' onclick='setSequence(this)'><i class='fa fa-long-arrow-up'></i></a></td>"+
                    "<td><span id='image_dataID_"+data[i].id+"'><img onclick='showDetailCarouselImage(\"../../logo/"+ data[i].logoFileName +"\")' id='imgStc_"+data[i].id+"' style='width:110px;height: 49px;cursor:pointer;' src='../../logo/"+data[i].logoFileName+"'></span></td>"+
                    "<td><span id='styleValue_dataID_"+data[i].id+"'>"+ data[i].content +"</span></td>"+
                    "<td><span id='name_dataID_"+data[i].id+"'>"+ data[i].name +"</span></td>"+
                    /*"<td>"+ carouselDataStr +"</td>"+*/
                    "</tr>";
            }
            $("#carousel-tbody").empty().append(str);

            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='5' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
            $("#carousel-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

function showDetailCarouselImage(src){
    $("#detail_carousel_image").attr("src",src);
    $("#detail_carouselImage_modal").modal("show");
}

var sel_carousel_id="";
var all_carousel_data="";
function set_carousel_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#carousel_list_table input[name='cbx_carousel_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_carousel_data = null;
        if(null != id)
            sel_carousel_id=id;

        $("#btn_carousel_edit,#btn_carousel_delete").removeClass("disabled");

    }else{
        all_carousel_data = null;
        $("#btn_carousel_edit,#btn_carousel_delete").addClass("disabled");
    }
}

function deletecarousel(){
    doPost("/action/systemStyle/delete",{id:sel_carousel_id},function(obj){
        if(obj.httpCode == "200"){
            loadcarouselTable();
        }else if(obj.httpCode == "400" && obj.code == "Resource.InUse"){
            showErrorMsg("删除失败","设为默认的皮肤不可被删除");
        }else{
            showErrorMsg(obj.code,"程序内部错误");
        }
    },true);
}


function setIsDefault(_this,isDefault){
    var objTr = $(_this).closest("tr");
    console.log(objTr);
    var id = $(_this).attr("carouselid");
    doPost("/action/systemStyle/setWhetherDefault",{id:id,isDefault:isDefault},function(obj){
        if(obj.httpCode == "200"){
            loadcarouselTable();
        }else{

        }
    });
}

function addCarouselImage(){
    clearForm("add_carouselImage");
    $("#Preview").hide();
    /*$("#preview").next("input").remove();*/
    /*$("#preview").after('<input type="file" onchange="previewImage(this)" />');*/
    $('#add_carouselImage_modal').modal("show");

}

function uploadCarouselImage(){
    $("#carousel-form").submit();
}

function editCarouselImage(){
    $("#edit-carousel-form").submit();
}
function validateImageTypeAndSize(file){
    var fileName=$(file).val();
    var tempFilename = fileName.split(".");
    var fileType = tempFilename[tempFilename.length-1].toLowerCase();
    if(!fileType || ( fileType !== "png" && fileType !== "jpg" && fileType !== "jpeg" && fileType !== "gif" && fileType !== "bmp") ){
        $(file).next("em,span").remove();
        $(file).next("em,span").remove();

        $(file).after('<span for="styleName" class="invalid" style="text-align: left; color: rgb(252, 67, 67); float: left;">图片类型错误</span>');
        $(file).removeClass('hsa-success').addClass('hsa-error');
        addCarouselImageValidateBtn();
        editCarouselImageValidateBtn();
        return false;
    }else{
        $(file).addClass('hsa-success').removeClass('hsa-error');
        $(file).next("em,span").remove();
        $(file).next("em,span").remove();
    }

    if (file.files && file.files[0]) {
        if (file.files[0].size > 5 * 1024 * 1024) {
            $(file).next("em,span").remove();
            $(file).next("em,span").remove();

            $(file).after('<span for="styleName" class="invalid" style="text-align: left; color: rgb(252, 67, 67); float: left;">图片不能大于5M</span>');
            $(file).removeClass('hsa-success').addClass('hsa-error');
            addCarouselImageValidateBtn();
            editCarouselImageValidateBtn();
            return false;
        }else{
            $(file).addClass('hsa-success').removeClass('hsa-error');
            $(file).next("em,span").remove();
            $(file).next("em,span").remove();
        }
    }

    return true;
}

function previewImage(file,previewId)
{
    if(validateImageTypeAndSize(file)){

    var MAXWIDTH  = 480;
    var MAXHEIGHT = 152;
    $("#"+previewId+"Preview").hide();
    var div = document.getElementById(previewId+"Preview");
    $("#preview1").remove();
    $("body").append('<div id="preview1" style="visibility: hidden;">');
    var div1 = document.getElementById('preview1');
        div1.innerHTML ='<img id=imghead1>';
    if (file.files && file.files[0])
    {
        div.innerHTML ='<img id="'+previewId+'imghead">';

        var img = document.getElementById(previewId+'imghead');
        var img1 = document.getElementById('imghead1');
        img.onload = function(){
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width  =  rect.width;
            img.height =  rect.height;
//                 img.style.marginLeft = rect.left+'px';
            //img.style.marginTop = rect.top+'px';
        };
        var reader = new FileReader();
        var reader1 = new FileReader();
        reader.onloadend = function(evt){img.src = evt.target.result;};
        reader1.onloadend = function(evt){img1.src = evt.target.result;};
        reader.readAsDataURL(file.files[0]);
        reader1.readAsDataURL(file.files[0]);
    }
    else //兼容IE
    {
        var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        div.innerHTML = '<img id="'+previewId+'imghead">';
        var img = document.getElementById(previewId+'imghead');
        var img1 = document.getElementById('imghead1');
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        img1.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
        div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
        //div1.innerHTML = "<div id=divhead1 style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
    }
    $("#"+previewId+"Preview").show();
    setTimeout(function(){validateImageSize(file,previewId);},500);
    }
}

function  validateImageSize(file,previewId){
    var id = $(file).attr("id");
    var file1 = document.getElementById(id);
    if( 608 !== Number($("#imghead1").height()) || 1920 !== Number($("#imghead1").width())){

        $(file1).next("em,span").remove();
        $(file1).next("em,span").remove();

        //$(file1).after('<span for="styleName" class="invalid" style="text-align: left; color: #e48d30; float: left;">图片尺寸建议为1920*608</span>');
        $("#"+previewId+"sizeInfo").empty().css("visibility","visible").append('<div class="alert alert-warning fade in" style="width: 490px;">'+
                                '    <i class="fa-fw fa fa-warning"></i>'+
                                '    <strong>警告：</strong> 如不按规定尺寸上传，可能会导致图片变形（建议尺寸：1920 * 608px）'+
                                '</div>');
        //$(file1).removeClass('hsa-success').addClass('hsa-error');

        addCarouselImageValidateBtn();
        editCarouselImageValidateBtn();
        return  false;
    }else{
        //$(file1).addClass('hsa-success').removeClass('hsa-error');
        $("#"+previewId+"sizeInfo").css("visibility",'hidden');
        $(file1).next("em,span").remove();
        $(file1).next("em,span").remove();
    }
}
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight )
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight )
        {
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}

function addCarouselImageValidate(){
    $("#carousel-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            styleName:{
                required:true
            },
            styleValue:{
                url:true
            }
            /*file:{
                required:true
            }*/
        },
        messages:{
            styleName:{
                required:"图片名称不能为空"
            },
            styleValue:{
                url:"链接格式错误"
            }
            /*file:{
                required:"请选择图片"
            }*/
        },
        highlight: function(element){
            $(element).removeClass('hsa-success').addClass('hsa-error');
            addCarouselImageValidateBtn();
        },

        unhighlight: function(element){
            if($(element).attr("name") === "file"){

            }else{
                $(element).removeClass('hsa-error').addClass('hsa-success');
                $(element).parent().find("em").remove();
            }

            addCarouselImageValidateBtn();
        },
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function addCarouselImageValidateBtn(){
    var size = 0;
        $("#carousel-form").find(".hsa-success").each(function(){
            size++;
        });
    if(size === 3){
        $("#add_carouselImage_confirm").addClass("btn-primary").removeClass("disabled").removeClass("txt-color-darken");
    }else{
        $("#add_carouselImage_confirm").removeClass("btn-primary").addClass("disabled").addClass("txt-color-darken");
    }
}

function editCarouselImageValidate(){
    $("#edit-carousel-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            styleName:{
                required:true
            },
            styleValue:{
                url:true
            }/*,
            file:{
                required:true
            }*/
        },
        messages:{
            styleName:{
                required:"图片名称不能为空"
            },
            styleValue:{
                url:"链接格式错误"
            }/*,
            file:{
                required:"请选择图片"
            }*/
        },
        highlight: function(element){
            $(element).removeClass('hsa-success').addClass('hsa-error');
            editCarouselImageValidateBtn();
        },

        unhighlight: function(element){
            $(element).removeClass('hsa-error').addClass('hsa-success');
            $(element).parent().find("em").remove();
            editCarouselImageValidateBtn();
        },
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function editCarouselImageValidateBtn(){
    var size = 0;
    $("#edit-carousel-form").find(".hsa-success").each(function(){
        size++;
    });
    if(size === 3){
        $("#edit_carouselImage_confirm").addClass("btn-primary").removeClass("disabled").removeClass("txt-color-darken");
    }else{
        $("#edit_carouselImage_confirm").removeClass("btn-primary").addClass("disabled").addClass("txt-color-darken");
    }
}