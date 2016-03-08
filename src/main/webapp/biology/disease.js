/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:产品类别
 */
var diseaseTable;

function loaddiseaseTable(id,catId){

    $("#disease_list_table").empty().append("<table id='disease-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='disease-thead' class=''></thead><tbody id='disease-tbody' class='table-tbody'></tbody></table>");

    $("#disease-thead").empty().append(
            "<tr>" +
            "<th width='5%'></th>"+
            "<th class='table-thead' width='20%'>名称</th>"+
            "<th class='table-thead' width='15%'>父级</th>"+
            "<th class='table-thead' width='15%'>分类</th>"+
            "<th class='table-thead' width='40%'>病因</th>"+
            "<th class='table-thead' width='10%'>所属层级</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#disease-tbody").empty().append(loadStr);
    rundiseaseDataTables(function(){
        diseaseTable=$("#disease-table").dataTable({
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
            "fnDrawCallback": function( ) {
                $("#disease-table input").prop("checked",false);
                $("#disease_"+sel_disease_id).prop("checked",true);
            },
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ]
        });
    },id,catId);
}

function rundiseaseDataTables(callback,id,catId){
    sel_disease_id=null;
    $("#btn_disease_edit,#btn_disease_delete").addClass("disabled");

    var data={};
    doPost("/action/disease/list",data,function(objs){
        if(objs.httpCode=="200"){
            var data=objs.data,
                str = '';

            for( var i=0;i<data.length;i++){
                var p=convertStr(data[i].parentDiseasePo)==""?"":data[i].parentDiseasePo.name;
                str += "<tr id='tr_disease_" + data[i].uuid + "'>"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='disease_" + data[i].uuid + "' type='checkbox' name='cbx_disease_list' onclick=\"set_disease_Sel(this,'"+data[i].uuid+"')\">"+
                    "<i></i></label></td>"+
                    "<td>"+data[i].name+"</td>"+
                    "<td>"+p+"</td>"+
                    "<td>"+ data[i].category +"</td>"+
                    "<td>"+data[i].pathogeny +"</td>"+
                    "<td>"+data[i].level+"</td>"+
                    "</tr>";
            }
            $("#disease-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#disease-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_disease_id="";
function set_disease_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#disease_list_table input[name='cbx_disease_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id){
            sel_disease_id=id;
        }
        $("#btn_disease_edit,#btn_disease_delete").removeClass("disabled")

    }else{
        $("#btn_disease_edit,#btn_disease_delete").addClass("disabled");
    }
}




//新增验证
//function validatedisease() {
//    $("#disease-form").validate({
//        onfocusout: function (element) {
//            $(element).valid();
//        },
//        rules: {
//            email: {
//                required: true,
//                email: true
//            },
//            password: {
//                required: true,
//                //pwdStrengthValidator: true,
//                rangelength: [8, 20]
//            },
//            repeatPassword: {
//                required: true,
//                equalTo: "#password"
//            },
//            sex:{
//                required:true
//            },
//            telNumber: {
//                required: true,
//                phoneNumValidator: true
//            },
//            SMSCode:{
//                required:true,
//                minlength:6,
//                maxlength:6
//            },
//            verifyCode:{
//                required: true
//            }
//        },
//        messages: {
//            email: {
//                required: "请输入邮箱",
//                email: "请按邮箱格式输入"
//            },
//            password: {
//                required: "请输入密码",
//                //pwdStrengthValidator: "密码应该只包含………………",
//                rangelength: "密码长度应该在x位到y位之间"
//            },
//            repeatPassword: {
//                required: "请确认密码",
//                equalTo: "两次输入的密码不一致"
//            },
//            sex:{
//                required:"请选择性别"
//            },
//            telNumber: {
//                required: "请输入手机号码",
//                phoneNumValidator: "请按手机号码格式输入"
//            },
//            SMSCode:{
//                required:"请输入短信验证码",
//                minlength:"短信验证码为六位",
//                maxlength:"短信验证码为六位"
//            },
//            verifyCode:{
//                required:"请输入验证码"
//            }
//        },
//
//        highlight: function(element){
//            $(element).closest('.input-group-disease').removeClass('has-success').addClass('has-error');
//            btnConfirmState();
//        },
//
//        unhighlight: function(element){
//            $(element).closest('.input-group-disease').removeClass('has-error').addClass('has-success');
//            btnConfirmState();
//        },
//
//        errorPlacement: function (error, element) {
//            error.addClass("col-lg-3").css('text-align','left').css('color','#FC4343').css('line-height','34px').css("float","left");
//            error.appendTo(element.parent());
//        }
//
//    });
//}
function btnConfirmState(){
    var validateSize = 6,size=0;
    $('#disease-form .input-group-disease').each(function () {
        if($(this).hasClass("has-success")){
            size+=1;
        }
    });
    if(validateSize==size){
        $("#diseaseBtn").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }else{
        $("#diseaseBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }
}

function adddisease(){
    var _name = $.trim($("#disease_name").val());
    var _parentId = $.trim($("#disease_parentId").val());
    var _category = $.trim($("#disease_category").val());
    var _pathogeny = $.trim($("#disease_pathogeny").val());
    var _change = $.trim($("#disease_change").val());
    var _microbialChanges = $.trim($("#disease_microbial_changes").val());
    var _relatedFamily = $.trim($("#disease_related_family").val());
    var _relatedNegativeFamily = $.trim($("#disease_related_negative_family").val());
    var _relatedGenus = $.trim($("#disease_related_genus").val());
    var _relatedNegativeGenus = $.trim($("#disease_related_negative_genus").val());
    var _pathogenMetabolites = $.trim($("#disease_pathogen_metabolites").val());
    var _physiologicalProcess = $.trim($("#disease_physiological_process").val());
    var _researchMethod = $.trim($("#disease_research_method").val());
//    var _documentId = $.trim($("#disease_documentId").val());
/*
    if(isNaN(Number(billUnitCount))){
        showErrorMsg("","计费单位只能是数字");
        return;
    }
    if(isNaN(Number(price))){
        showErrorMsg("","价格只能是数字");
        return;
    }
*/
    var data = {
    		name:_name,//疾病名称
    		category: _category,//疾病分类
    		pathogeny:_pathogeny,//病因
    		parentId:_parentId,//疾病所属大类
    		change: _change,//变化
    		microbialChanges: _microbialChanges,//微生物变化
    		relatedFamily: _relatedFamily,//正科相关
    		relatedNegativeFamily: _relatedNegativeFamily,//负科相关
    		relatedGenus: _relatedGenus,//正属相关
    		relatedNegativeGenus: _relatedNegativeGenus,//负属相关
    		pathogenMetabolites: _pathogenMetabolites,//与病症相关菌代谢产物 
    		physiologicalProcess: _physiologicalProcess,//菌调控的生理过程
    		researchMethod: _researchMethod//研究方法 
//    		documentId: _documentId//文献id 
    		};
    doPost("/action/disease/add",data,function(objs){
        if(objs.httpCode=="200"){
            showMsg("温馨提示","添加成功。");
            loaddiseaseTable();
            $("#disease_widget-grid").show().siblings().hide();
            $("#disease_btns,#regionList_disease_div,#disease_tab_ul").show();
        }else{
            if(objs.code=="Resource.InUse" && objs.httpCode=="400"){
                showErrorMsg("温馨提示","该词条已经存在");
            }else{
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
            }
        }
    });


}


function addProductCatValidate(){
    $("#disease-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
        	disease_name:{
                required:true
            },
            disease_parentId:{
                required:true
            },
            disease_category:{
                required:true
            },
            disease_pathogeny:{
                required:true
            },
            disease_catagory:{
                required:true

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
        	disease_name:{
                required:"疾病名称不能为空"
            },
            disease_parentId:{
                required:"疾病父级大类"
            },
            disease_category:{
                required:"所属分类不能为空"
            },
            disease_pathogeny:{
                required:"病因为空"
            },
            disease_catagory:{
                required:"所属层级不能为空"
            }
        },
        /*        highlight: function(element){
         $(element).removeClass('disease-hsa-success').addClass('disease-hsa-error');
         diseaseValidateBtn("disease-form","diseaseBtn","diseaseCat_type");
         },

         unhighlight: function(element){
         $(element).removeClass('disease-hsa-error').addClass('disease-hsa-success');
         $(element).parent().find("em").remove();
         diseaseValidateBtn("disease-form","diseaseBtn","diseaseCat_type");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}
function editProductCatValidate(){
    $("#disease_edit-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            diseaseCat_type:{
                required:true
            },
            disease_edit_region:{
                required:true
            },
            disease_image:{
                required:true
            },
            disease_status:{
                required:true
            },
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
            diseaseCat_type:{
                required:"产品类别不能为空"
            },
            disease_edit_region:{
                required:"地域不能为空"
            },
            disease_image:{
                required:"镜像不能为空"
            },
            disease_status:{
                required:"状态不能为空"
            },
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
         $(element).removeClass('disease-hsa-success').addClass('disease-hsa-error');
         diseaseValidateBtn("disease_edit-form","disease_editBtn");
         },

         unhighlight: function(element){
         $(element).removeClass('disease-hsa-error').addClass('disease-hsa-success');
         $(element).parent().find("em").remove();
         diseaseValidateBtn("disease_edit-form","disease_editBtn");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function diseaseValidateBtn(tableId,btnId,catId){
    if($("#"+tableId+ "disease-hsa-error").length>0){
        $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
    }else{
        var size=0;
        var type=  $('#'+catId).find("option:checked").text();

        if(type=="cpu" || type=="mem"){
            $("#"+tableId+" input.cpu").each(function () {
                if($(this).hasClass("disease-hsa-success")){
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
                if($(this).hasClass("disease-hsa-success")){
                    size+=1;
                }
            });
            if(size==1){
                if(convertStr($("#"+tableId+"select[name=disease_image]").val())==""){
                    $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
                }else{
                    $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
                }
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }

        }else if(type=="disk"){
            $("#"+tableId+" input.disk").each(function () {
                if($(this).hasClass("disease-hsa-success")){
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
                if($(this).hasClass("disease-hsa-success")){
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



function initDatePlugin(id,linkId,option,defaultDate,minDate){

    if(defaultDate == null || defaultDate == undefined){
        defaultDate = new Date();
    }
    if(minDate == null || minDate == undefined){
        minDate = new Date();
    }
    var dates = caculateDate((new Date().getTime()),defaultDate),
        yearstr = '',
        monthstr = '',
        daystr = '';

    if(dates.year > 0){
        yearstr = "+"+dates.year+"y ";
    }else if(dates.year < 0){
        yearstr = dates.year+"y ";
    }else{

    }
    if(dates.month > 0){
        monthstr = "+"+dates.month+"m ";
    }else if(dates.month < 0){
        monthstr = dates.month+"m ";
    }else{

    }
    if(dates.day > 0){
        daystr = "+"+dates.day+"d";
    }else if(dates.day < 0){
        daystr = dates.day+"d";
    }else{

    }


    $(id).datepicker({
        dateFormat: 'yy-mm-dd',
//        minDate:minDate,
        defaultDate: yearstr + monthstr + daystr,
        dayNamesMin:['日', '一', '二', '三', '四', '五', '六'],
        monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        prevText: '<i class="fa fa-chevron-left"></i>',
        nextText: '<i class="fa fa-chevron-right"></i>'
        /*onSelect: function (selectedDate) {
            $(linkId).datepicker('option', option, selectedDate);
        }*/
    });


    $(id).val(new Date(defaultDate).Format("yyyy-MM-dd"));
//    $(linkId).datepicker('option', option, new Date(defaultDate));
}


/**
 * 计算两个日期中年月日的差
 * @param fromDate
 * @param toDate
 * @returns {{year: number, month: number, day: number}}
 */
function caculateDate(fromDate, toDate){

    if(fromDate == undefined){
        fromDate = new Date();
    }else{
        fromDate = new Date(fromDate);
    }
    if(toDate == undefined){
        toDate = new Date();
    }else{
        toDate = new Date(toDate);
    }

    var years = toDate.getYear() - fromDate.getYear();
    var months = toDate.getMonth() - fromDate.getMonth();
    var days = toDate.getDate() - fromDate.getDate();

    return {year:years,month:months,day:days}

}