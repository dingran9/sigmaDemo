/**
 * Copyright: biology
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:产品类别
 */
var dictitemmanagerTable;

function loaddictitemmanagerTable(id,dictmanagerId){

    $("#dictitemmanager_list_table").empty().append("<table id='dictitemmanager-table' class='table table-responsive table-striped table-bordered table-hover table-text-center biology-table'><thead id='dictitemmanager-thead' class=''></thead><tbody id='dictitemmanager-tbody' class='table-tbody'></tbody></table>");

    $("#dictitemmanager-thead").empty().append(
            "<tr>" +
            "<th width='5%'></th>"+
            "<th class='table-thead' width='20%'>字典</th>"+
            "<th class='table-thead' width='20%'>名称</th>"+
            "<th class='table-thead' width='20%'>字典项值</th>"+
            "<th class='table-thead' width='15%'>是否可用</th>"+
            "<th class='table-thead' width='20%'>描述</th>"+
            "<th class='table-thead' style='display: none'>创建时间</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#dictitemmanager-tbody").empty().append(loadStr);
    rundictitemmanagerDataTables(function(){
        dictitemmanagerTable=$("#dictitemmanager-table").dataTable({
            "bFilter":true,
            "bDestroy":true,
            "bRetrieve":true,
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
                "sProcessing": "<img src=’./loading.gif’ />"
            },
            "fnDrawCallback": function( ) {
                $("#dictitemmanager-table input").prop("checked",false);
                $("#dictitemmanager_"+sel_dictitemmanager_id).prop("checked",true);
            },
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ]
        });
    },id,dictmanagerId);
}

function rundictitemmanagerDataTables(callback,id,dictmanagerId){
    sel_dictitemmanager_id=null;
    $("#btn_dictitemmanager_edit,#btn_dictitemmanager_delete").addClass("disabled");

    var data={};
    doPost("/action/dictItem/list",{dictmanagerId:dictmanagerId},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.data,
                str = '';
            for( var i=0;i<data.length;i++){
                var remark=convertStr(data[i].remark)==""?"":data[i].remark,valid=data[i].validMark==0?"不可用":"可用";
                str += "<tr id='tr_dictitemmanager_" + data[i].uuid + "'>"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='dictitemmanager_" + data[i].uuid + "' type='checkbox' name='cbx_dictitemmanager_list' onclick=\"set_dictitemmanager_Sel(this,'"+data[i].uuid+"')\">"+
                    "<i></i></label></td>"+
                    "<td>"+data[i].dictPo.code+" </td>"+
                    "<td>"+data[i].name+"</td>"+
                    "<td>"+data[i].value +"</td>"+
                    "<td>"+valid+"</td>"+
                    "<td>"+remark+"</td>"+
                    "<td style='display: none;'>"+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")  +"</td>"+
                    "</tr>";
            }
            $("#dictitemmanager-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#dictitemmanager-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_dictitemmanager_id="";
function set_dictitemmanager_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#dictitemmanager_list_table input[name='cbx_dictitemmanager_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id){
            sel_dictitemmanager_id=id;
        }
        $("#btn_dictitemmanager_edit,#btn_dictitemmanager_delete").removeClass("disabled")

    }else{
        $("#btn_dictitemmanager_edit,#btn_dictitemmanager_delete").addClass("disabled");
    }
}


//新增验证
function validatedictitemmanager() {
    $("#dictitemmanager-form").validate({
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
            $(element).closest('.input-group-dictitemmanager').removeClass('has-success').addClass('has-error');
            btnConfirmState();
        },

        unhighlight: function(element){
            $(element).closest('.input-group-dictitemmanager').removeClass('has-error').addClass('has-success');
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
    $('#dictitemmanager-form .input-group-dictitemmanager').each(function () {
        if($(this).hasClass("has-success")){
            size+=1;
        }
    });
    if(validateSize==size){
        $("#dictitemmanagerBtn").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }else{
        $("#dictitemmanagerBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }
}

function addDocument(){

    var validMark= $("#dictitemmanager_validMark option:selected").val(),
     name = $.trim($("#dictitemmanager_name").val()),
     dictmanagerId = sel_dictmanager_uuid,
     value = $.trim($("#dictitemmanager_value").val()),
     remark = $.trim($("#dictitemmanager_describe").val());

    var data = {name:name,validMark: validMark,value:value,remark:remark,dictmanagerId:dictmanagerId };
    doPost("/action/dictItem/add",data,function(objs){
        if(objs.httpCode=="200"){
            showMsg("温馨提示","添加成功。");
            loaddictitemmanagerTable("",sel_dictmanager_uuid);
            $("#dictitemmanager_widget-grid").show().siblings().hide();
            $("#dictitemmanager_btns,#regionList_dictitemmanager_div,#dictitemmanager_tab_ul").show();
        }else{
            if(objs.code=="Resource.InUse" && objs.httpCode=="400"){
                showErrorMsg("温馨提示","该字典项已经存在");
            }else{
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
            }
        }
    });


}


function addProductCatValidate(){
    $("#dictitemmanager-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            dictitemmanagerCat_type:{
                required:true
            },
            dictitemmanager_region:{
                required:true
            },
            dictitemmanager_image:{
                required:true
            },
            dictitemmanager_status:{
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
            dictitemmanagerCat_type:{
                required:"产品类别不能为空"
            },
            dictitemmanager_region:{
                required:"地域不能为空"
            },
            dictitemmanager_image:{
                required:"镜像不能为空"
            },
            dictitemmanager_status:{
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
         $(element).removeClass('dictitemmanager-hsa-success').addClass('dictitemmanager-hsa-error');
         dictitemmanagerValidateBtn("dictitemmanager-form","dictitemmanagerBtn","dictitemmanagerCat_type");
         },

         unhighlight: function(element){
         $(element).removeClass('dictitemmanager-hsa-error').addClass('dictitemmanager-hsa-success');
         $(element).parent().find("em").remove();
         dictitemmanagerValidateBtn("dictitemmanager-form","dictitemmanagerBtn","dictitemmanagerCat_type");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}
function editProductCatValidate(){
    $("#dictitemmanager_edit-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            dictitemmanagerCat_type:{
                required:true
            },
            dictitemmanager_edit_region:{
                required:true
            },
            dictitemmanager_image:{
                required:true
            },
            dictitemmanager_status:{
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
            dictitemmanagerCat_type:{
                required:"产品类别不能为空"
            },
            dictitemmanager_edit_region:{
                required:"地域不能为空"
            },
            dictitemmanager_image:{
                required:"镜像不能为空"
            },
            dictitemmanager_status:{
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
         $(element).removeClass('dictitemmanager-hsa-success').addClass('dictitemmanager-hsa-error');
         dictitemmanagerValidateBtn("dictitemmanager_edit-form","dictitemmanager_editBtn");
         },

         unhighlight: function(element){
         $(element).removeClass('dictitemmanager-hsa-error').addClass('dictitemmanager-hsa-success');
         $(element).parent().find("em").remove();
         dictitemmanagerValidateBtn("dictitemmanager_edit-form","dictitemmanager_editBtn");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

