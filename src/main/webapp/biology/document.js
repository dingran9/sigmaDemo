/**
 * Copyright: biology
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:产品类别
 */
var documentTable;

function loaddocumentTable(id,catId){

    $("#document_list_table").empty().append("<table id='document-table' class='table table-responsive table-striped table-bordered table-hover table-text-center biology-table'><thead id='document-thead' class=''></thead><tbody id='document-tbody' class='table-tbody'></tbody></table>");

    $("#document-thead").empty().append(
            "<tr>" +
            "<th width='5%'></th>"+
            "<th class='table-thead' width='15%'>名称</th>"+
            "<th class='table-thead' width='15%'>第一作者</th>"+
            "<th class='table-thead' width='15%'>通讯作者</th>"+
            "<th class='table-thead' width='10%'>发布时间</th>"+
            "<th class='table-thead' width='10%'>词条类型</th>"+
            "<th class='table-thead' width='10%'>文档发布因子</th>"+
            "<th class='table-thead' width='10%'>杂志</th>"+
            "<th class='table-thead' width='10%'>创建时间</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#document-tbody").empty().append(loadStr);
    rundocumentDataTables(function(){
        documentTable=$("#document-table").dataTable({
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
                $("#document-table input").prop("checked",false);
                $("#document_"+sel_document_id).prop("checked",true);
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

function rundocumentDataTables(callback,id,catId){
    sel_document_id=null;
    $("#btn_document_edit,#btn_document_delete").addClass("disabled");

    var data={};
    doPost("/action/document/list",data,function(objs){
        if(objs.httpCode=="200"){
            var data=objs.data,
                str = '';
            for( var i=0;i<data.length;i++){
                str += "<tr id='tr_document_" + data[i].uuid + "'>"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='document_" + data[i].uuid + "' type='checkbox' name='cbx_document_list' onclick=\"set_document_Sel(this,'"+data[i].uuid+"')\">"+
                    "<i></i></label></td>"+
                    "<td>"+data[i].name+"</td>"+
                    "<td>"+data[i].firstAuthor +"</td>"+
                    "<td>"+data[i].correspondentAuthor+"</td>"+
                    "<td>"+ new Date(data[i].publishDate).Format("yyyy-MM-dd")  +"</td>"+
                    "<td>"+data[i].entryType +"</td>"+
                    "<td>"+data[i].magazine+"</td>"+
                    "<td>"+data[i].impactFactors+"</td>"+
                    "<td>"+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")  +"</td>"+
                    "</tr>";
            }
            $("#document-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#document-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_document_id="";
function set_document_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#document_list_table input[name='cbx_document_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id){
            sel_document_id=id;
        }
        $("#btn_document_edit,#btn_document_delete").removeClass("disabled")

    }else{
        $("#btn_document_edit,#btn_document_delete").addClass("disabled");
    }
}




//新增验证
function validatedocument() {
    $("#document-form").validate({
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
            $(element).closest('.input-group-document').removeClass('has-success').addClass('has-error');
            btnConfirmState();
        },

        unhighlight: function(element){
            $(element).closest('.input-group-document').removeClass('has-error').addClass('has-success');
            btnConfirmState();
        },

        errorPlacement: function (error, element) {
            error.addClass("col-lg-3").css('text-align','left').css('color','#FC4343').css('line-height','34px').css("float","left");
            error.appendTo(element.parent());
        }

    });
}
function btnConfirmState(){
    var validateSize = 6,size=0;
    $('#document-form .input-group-document').each(function () {
        if($(this).hasClass("has-success")){
            size+=1;
        }
    });
    if(validateSize==size){
        $("#documentBtn").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }else{
        $("#documentBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }
}

function addDocument(){

    var type= $("#document_type option:selected").val();
    var name = $.trim($("#document_name").val());
    var magazine = $.trim($("#document_magazine").val());
    var first_author = $.trim($("#document_first_author").val());
    var correspondent_author = $.trim($("#document_correspondent_author").val());
    var impact_factors = $.trim($("#document_impact_factors").val());
    var offline_date = $.trim($("#package_offline_date").val());
    var attachIds=$("#attachIds").val().replace(/\'/g,'');
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
    var data = {attachIds:attachIds,name:name,firstAuthor: first_author,correspondentAuthor:correspondent_author,publishDate:offline_date ,entryType: type,impactFactors: impact_factors,magazine:magazine};
    doPost("/action/document/add",data,function(objs){
        if(objs.httpCode=="200"){
            showMsg("温馨提示","添加成功。");
            loaddocumentTable();
            $("#document_widget-grid").show().siblings().hide();
            $("#document_btns,#regionList_document_div,#document_tab_ul").show();
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
    $("#document-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            documentCat_type:{
                required:true
            },
            document_region:{
                required:true
            },
            document_image:{
                required:true
            },
            document_status:{
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
            documentCat_type:{
                required:"产品类别不能为空"
            },
            document_region:{
                required:"地域不能为空"
            },
            document_image:{
                required:"镜像不能为空"
            },
            document_status:{
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
         $(element).removeClass('document-hsa-success').addClass('document-hsa-error');
         documentValidateBtn("document-form","documentBtn","documentCat_type");
         },

         unhighlight: function(element){
         $(element).removeClass('document-hsa-error').addClass('document-hsa-success');
         $(element).parent().find("em").remove();
         documentValidateBtn("document-form","documentBtn","documentCat_type");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}
function editProductCatValidate(){
    $("#document_edit-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            documentCat_type:{
                required:true
            },
            document_edit_region:{
                required:true
            },
            document_image:{
                required:true
            },
            document_status:{
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
            documentCat_type:{
                required:"产品类别不能为空"
            },
            document_edit_region:{
                required:"地域不能为空"
            },
            document_image:{
                required:"镜像不能为空"
            },
            document_status:{
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
         $(element).removeClass('document-hsa-success').addClass('document-hsa-error');
         documentValidateBtn("document_edit-form","document_editBtn");
         },

         unhighlight: function(element){
         $(element).removeClass('document-hsa-error').addClass('document-hsa-success');
         $(element).parent().find("em").remove();
         documentValidateBtn("document_edit-form","document_editBtn");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
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