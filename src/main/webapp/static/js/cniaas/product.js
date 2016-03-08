/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:产品类别
 */
var productTable;

function loadproductTable(id){

   // loadURL("../../static/cniaas/product.html",$("#content_test"));
    $("#product_list_table").empty().append("<table id='product-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='product-thead' class=''></thead><tbody id='product-tbody' class='table-tbody'></tbody></table>");

    $("#product-thead").empty().append(
            "<tr>" +
            "<th width='5%'></th>"+
            "<th class='table-thead' width='20%'>"+rpL("name")+"</th>"+
            "<th class='table-thead' width='15%'>"+rpL("bill_type")+"</th>"+
            "<th class='table-thead' width='15%'>"+rpL("billUnitCount")+"</th>"+
     /*       "<th class='table-thead'>"+rpL("bill_cycle")+"</th>"+*/
            "<th class='table-thead' width='10%'>"+rpL("price")+"</th>"+
            "<th class='table-thead' width='10%'>"+rpL("status")+"</th>"+
            "<th class='table-thead' width='12%'>"+rpL("region")+"</th>"+
         /*   "<th class='table-thead'>"+rpL("unit_count_min")+"</th>"+
            "<th class='table-thead'>"+rpL("unit_count_max")+"</th>"+*/
//            "<th class='table-thead' width='15%'>"+rpL("description")+"</th>"+
            "<th class='table-thead' width='18%'>"+rpL("createTime")+"</th>"+
        /*    "<th class='table-thead'>"+rpL("updateTime")+"</th>"+*/
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#product-tbody").empty().append(loadStr);
    runproductDataTables(function(){
        productTable=$("#product-table").dataTable({
            "bFilter":true,
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 7, "desc" ]],
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
                "sProcessing": "<img src=’./loading.gif’ />"
            },
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ]
        });
    },id);
}

function runproductDataTables(callback,id){
    sel_product_id=null;
    $("#btn_product_edit,#btn_product_delete").addClass("disabled");
    var regionId="";
    if(convertStr(id)==""){
        regionId=$("#regionList_product a.btn-primary").attr("id");
        regionId=regionId.split(",");
        regionId=regionId[1];
    }else{
        regionId=id.split(",");
        regionId=regionId[1];
    }

    var data={regionId:regionId};
    doPost("/action/product/list",data,function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = '';
            var price="";
            var des="";
            var status="";
            var regionName="";
            for( var i=0;i<data.length;i++){
                if(data[i].productCat.billType=="Linear"){
                  var s=  data[i].description.split(";");
                    price=s[0];
                    des=s[1];
                }else{
                    price="<span class='pay-balance'>"+data[i].price+"</span>";
                    des=data[i].description;
         /*           var m=  data[i].description.split(";");
                    price=m[0];
                    des=m[1];*/
                }

                if(data[i].status=="Enable"){
                    status='<span class="success-type">'+rpL(data[i].status)+'<span>';
                }else{
                    status='<span class="disable-type">'+rpL(data[i].status)+'<span>'
                }
                regionName=convertStr(data[i].systemRegionPo)==""?"":data[i].systemRegionPo.name;
                str += "<tr id='tr_product_" + data[i].id + "'>"+
                        "<td class='check-tr'><label class='checkbox'>"+
                        "<input id='product_" + data[i].id + "' type='checkbox' name='cbx_product_list' onclick=\"set_product_Sel(this,'"+data[i].id+"','"+data[i].productCat.id+"')\">"+
                        "<i></i></label></td>"+
                        "<td>"+data[i].name+"</td>"+
                        "<td>"+rpL(data[i].productCat.billType) +"</td>"+
                         "<td>"+data[i].billUnitCount +data[i].productCat.billUnitName+"</td>"+
                        "<td>"+ price+"</td>"+
                        "<td>"+status +"</td>"+
                        "<td>"+regionName+"</td>"+
//                        "<td>"+ des +"</td>"+
                        "<td>"+ new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss")  +"</td>"+
                        "</tr>";
                }
            $("#product-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#product-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_product_id="";
var all_product_data="";
function set_product_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#product_list_table input[name='cbx_product_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_product_data = null;
       // all_product_data = productTable.fnGetData(obj.parent);
        if(null != id){
            //console.log("id="+id);
            sel_product_id=id;
        }
        $("#btn_product_edit,#btn_product_delete").removeClass("disabled")

    }else{
        $("#btn_product_edit,#btn_product_delete").addClass("disabled");
        all_product_data = null;
    }
  //  console.log("id="+id);
}



//初始化 产品类型
function initProductCat(callback){
    var productCat = document.getElementById("productCat_type").options;
    clearOptions(productCat);
    addOption(productCat,"---正在加载中---","");
    doPost("/action/productCat/list",{},function(objs){
        if(objs.httpCode=="200"){
            clearOptions(productCat);
                if (objs.datas.length > 0) {
                    for (var i = 0; i < objs.datas.length; i++) {
                        addOption(productCat, objs.datas[i].name, objs.datas[i].id+"_"+objs.datas[i].billType+"_"+objs.datas[i].innerName+"_"+objs.datas[i].billUnitName);
                     /*   $("#product-billUtilName-").html(objs.datas[i].billUnitName);
                        $(".band_max,.band_min").attr("placeholder",objs.datas[i].billUnitName);
                        $(".band_price").attr("placeholder","元/"+objs.datas[i].billUnitName);*/
                    }
                    callback();
                }
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });

}



//新增验证
function validateproduct() {
    $("#product-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                //pwdStrengthValidator: true,
                rangelength: [8, 20]
            },
            repeatPassword: {
                required: true,
                equalTo: "#password"
            },
            sex:{
                required:true
            },
            telNumber: {
                required: true,
                phoneNumValidator: true
            },
            SMSCode:{
                required:true,
                minlength:6,
                maxlength:6
            },
            verifyCode:{
                required: true
            }
        },
        messages: {
            email: {
                required: "请输入邮箱",
                email: "请按邮箱格式输入"
            },
            password: {
                required: "请输入密码",
                //pwdStrengthValidator: "密码应该只包含………………",
                rangelength: "密码长度应该在x位到y位之间"
            },
            repeatPassword: {
                required: "请确认密码",
                equalTo: "两次输入的密码不一致"
            },
            sex:{
                required:"请选择性别"
            },
            telNumber: {
                required: "请输入手机号码",
                phoneNumValidator: "请按手机号码格式输入"
            },
            SMSCode:{
                required:"请输入短信验证码",
                minlength:"短信验证码为六位",
                maxlength:"短信验证码为六位"
            },
            verifyCode:{
                required:"请输入验证码"
            }
        },

        highlight: function(element){
            $(element).closest('.input-group-product').removeClass('has-success').addClass('has-error');
            btnConfirmState();
        },

        unhighlight: function(element){
            $(element).closest('.input-group-product').removeClass('has-error').addClass('has-success');
            btnConfirmState();
        },

        errorPlacement: function (error, element) {
            error.addClass("col-lg-3").css('text-align','left').css('color','#FC4343').css('line-height','34px').css("float","left");
            error.appendTo(element.parent());
        }

    });
}
function btnConfirmState(){
    var validateSize = 6;
    var size=0;
    $('#product-form .input-group-product').each(function () {
        if($(this).hasClass("has-success")){
            size+=1;
        }
    });
    if(validateSize==size){
        $("#productBtn").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }else{
        $("#productBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }
}

function addProduct(){
    var productCat_type = $.trim($("#productCat_type").val());
    productCat_type=productCat_type.split("_");
    var regionId = $.trim($("#product_region").val());
    var status = $.trim($("#product_status").val());
    var billUnitCount = $.trim($("#product_bill_unit_count").val());
    var unitCountMin = $.trim($("#product_unit_count_min").val());
    var unitCountMax = $.trim($("#product_unit_count_max").val());
    var price = $.trim($("#product_price").val());
    var description = $.trim($("#product_description").val());
    var name=$("#product_image option:selected").text();

    var units="";
    if(typeof($("#productCat_type option:selected").text())==typeof("bandwidth")){
        $('#band_test div[name^="bandwidth-val"]').each(function (){
            var min=$(this).find('input[name^="band_min"]').val();
            var max=$(this).find('input[name^="band_max"]').val();
            var band_price=$(this).find('input[name^="band_price"]').val();
            units+=min+","+max+","+band_price+";";
        });
    }

    var data = {name:name,productCatId: productCat_type[0],status:status ,regionId:regionId ,billUnitCount: billUnitCount,price: price ,unitCountMin: unitCountMin ,unitCountMax: unitCountMax,description:description,units:units};
 //   $("#productBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    doPost("/action/product/add",data,function(objs){
        if(objs.httpCode=="200"){
            showMsg("温馨提示","添加成功。");
            loadproductTable();
            $("#product_widget-grid").show().siblings().hide();
            $("#product_btns,#regionList_product_div").show();
        }else{
            if(objs.code=="Resource.InUse" && objs.httpCode=="400"){
                showErrorMsg("温馨提示","该产品已经存在");
            }else{
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
            }
        }
    });


}

function showproductDetail(id,productCatId){
    //console.log(id);
    //console.log(productCatId);
    doPost("/action/product/detail",{productCatId:productCatId,productId:id},function(objs){

    });

}

function addProductCatValidate(){
    $("#product-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            productCat_type:{
                required:true
            },
            product_region:{
                required:true
            },
            product_image:{
                required:true
            },
            product_status:{
                required:true
            },
/*            band_min:{
                required:true,
                number:true
            },
            band_max:{
                required:true,
                number:true
            },
            band_price:{
                required:true,
                number:true
            },*/
            price:{
                required:true,
                number:true,
                min:0

            },
            bill_unit_count:{
                required:true,
                number:true,
                min:0
            },
            unit_count_min:{
                required:true,
                number:true,
                min:0
            }
        },
        messages:{
            productCat_type:{
                required:"产品类别不能为空"
            },
            product_region:{
                required:"地域不能为空"
            },
            product_image:{
                required:"镜像不能为空"
            },
            product_status:{
                required:"状态不能为空"
            },
           /* band_min:{
                required:"不能为空",
                number:"只能是数字"
            },
            band_max:{
                required:"不能为空",
                number:"只能是数字"
            },
            band_price:{
                required:"不能为空",
                number:"只能是数字"
            },*/
            price:{
                required:"价格不能为空",
                number:"价格只能是数字",
                min:"价格不能小于零"
            },
            bill_unit_count:{
                required:"计费单位不能为空",
                number:"计费单位只能是数字",
                min:"计费单位不能小于零"
            },
            unit_count_min:{
                required:"计费最小值不能为空",
                number:"计费最小值只能是数字",
                min:"计费最小值不能小于零"
            }
        },
/*        highlight: function(element){
            $(element).removeClass('product-hsa-success').addClass('product-hsa-error');
            productValidateBtn("product-form","productBtn","productCat_type");
        },

        unhighlight: function(element){
            $(element).removeClass('product-hsa-error').addClass('product-hsa-success');
            $(element).parent().find("em").remove();
            productValidateBtn("product-form","productBtn","productCat_type");
        },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}
function editProductCatValidate(){
    $("#product_edit-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            productCat_type:{
                required:true
            },
            product_edit_region:{
                required:true
            },
            product_image:{
                required:true
            },
            product_status:{
                required:true
            },
/*            band_min:{
                required:true,
                number:true
            },
            band_max:{
                required:true,
                number:true
            },
            band_price:{
                required:true,
                number:true
            },*/
            price:{
                required:true,
                number:true,
                min:0

            },
            bill_unit_count:{
                required:true,
                number:true,
                min:0
            },
            unit_count_min:{
                required:true,
                number:true,
                min:0
            }
        },
        messages:{
            productCat_type:{
                required:"产品类别不能为空"
            },
            product_edit_region:{
                required:"地域不能为空"
            },
            product_image:{
                required:"镜像不能为空"
            },
            product_status:{
                required:"状态不能为空"
            },
/*            band_min:{
                required:"不能为空",
                number:"只能是数字"
            },
            band_max:{
                required:"不能为空",
                number:"只能是数字"
            },
            band_price:{
                required:"不能为空",
                number:"只能是数字"
            },*/
            price:{
                required:"价格不能为空",
                number:"价格只能是数字",
                min:"价格不能小于零"
            },
            bill_unit_count:{
                required:"计费单位不能为空",
                number:"计费单位只能是数字",
                min:"计费单位不能小于零"
            },
            unit_count_min:{
                required:"计费最小值不能为空",
                number:"计费最小值只能是数字",
                min:"计费最小值不能小于零"
            }
        },
/*        highlight: function(element){
            $(element).removeClass('product-hsa-success').addClass('product-hsa-error');
            productValidateBtn("product_edit-form","product_editBtn");
        },

        unhighlight: function(element){
            $(element).removeClass('product-hsa-error').addClass('product-hsa-success');
            $(element).parent().find("em").remove();
            productValidateBtn("product_edit-form","product_editBtn");
        },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function productValidateBtn(tableId,btnId,catId){
console.log("=="+$("#"+tableId+ "product-hsa-error").length);
    if($("#"+tableId+ "product-hsa-error").length>0){
        $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
    }else{
        var size=0;
        var type=  $('#'+catId).find("option:checked").text();
        console.log(type);
        console.log(size);
        if(type=="cpu" || type=="mem"){
            $("#"+tableId+" input.cpu").each(function () {
                if($(this).hasClass("product-hsa-success")){
                    size+=1;
                }
            });
            if(size==2){
                $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }
        }else if(type=="image"){
            $("#"+tableId+" input.image").each(function () {
                if($(this).hasClass("product-hsa-success")){
                    size+=1;
                }
            });
            if(size==1){
                if(convertStr($("#"+tableId+"select[name=product_image]").val())==""){
                    $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
                }else{
                    $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
                }
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }

        }else if(type=="disk"){
            $("#"+tableId+" input.disk").each(function () {
                if($(this).hasClass("product-hsa-success")){
                    size+=1;
                }
            });
            if(size==2){
                $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }
        }else if(type=="bandwidth"){
            $("#"+tableId+" input.bandwidth").each(function () {
                if($(this).hasClass("product-hsa-success")){
                    size+=1;
                }
            });
            if(size>=4){
                $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }
        }
    }


}
