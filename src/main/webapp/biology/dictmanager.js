/**
 * Copyright: biology
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:产品类别
 */
var dictmanagerTable;

function loaddictmanagerTable(id,catId){

    $("#dictmanager_list_table").empty().append("<table id='dictmanager-table' class='table table-responsive table-striped table-bordered table-hover table-text-center biology-table'><thead id='dictmanager-thead' class=''></thead><tbody id='dictmanager-tbody' class='table-tbody'></tbody></table>");

    $("#dictmanager-thead").empty().append(
            "<tr>" +
            "<th width='5%'></th>"+
            "<th class='table-thead' width='20%'>操作</th>"+
            "<th class='table-thead' width='20%'>CODE</th>"+
            "<th class='table-thead' width='15%'>名称</th>"+
            "<th class='table-thead' width='10%'>是否可用</th>"+
            "<th class='table-thead' width='10%'>描述</th>"+
            "<th class='table-thead' width='20%'>字典项</th>"+
            "<th class='table-thead' style='display: none'>创建时间</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#dictmanager-tbody").empty().append(loadStr);
    rundictmanagerDataTables(function(){
        dictmanagerTable=$("#dictmanager-table").dataTable({
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
                $("#dictmanager-table input").prop("checked",false);
                $("#dictmanager_"+sel_dictmanager_id).prop("checked",true);
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

function rundictmanagerDataTables(callback,id,catId){
    sel_dictmanager_id=null;
    sel_dictmanager_uuid=null;
    sel_dictmanager_code=null;
    sel_dictmanager_name=null;
    $("#btn_dictmanager_edit,#btn_dictmanager_delete").addClass("disabled");

    var data={};
    doPost("/action/dictmanager/list",data,function(objs){
        if(objs.httpCode=="200"){
            var data=objs.data,
                str = '';
            for( var i=0;i<data.length;i++){
                var itemStr="",remark=convertStr(data[i].remark)==""?"":data[i].remark,valid=data[i].validMark==0?"不可用":"可用";
                if(data[i].dictItemPos.length>0){
                    for(var j=0;j<data[i].dictItemPos.length;j++){
                        var t=data[i].dictItemPos[j];
                        itemStr+="<span style='padding-left: 3px;color: blue;'>"+t.name+"</span>";
                    }
                }
                str += "<tr id='tr_dictmanager_" + data[i].uuid + "'>"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='dictmanager_" + data[i].uuid + "' type='checkbox' name='cbx_dictmanager_list' onclick=\"set_dictmanager_Sel(this,'"+data[i].uuid+"')\">"+
                    "<i></i></label></td>"+
                    "<td> <a onclick='getDictItem(this)'  id='a,dictmanager," + data[i].uuid + ","+data[i].code+","+data[i].name+"'>字典项</a></td>"+
                    "<td>"+data[i].code+"</td>"+
                    "<td>"+data[i].name +"</td>"+
                    "<td>"+valid+"</td>"+
                    "<td>"+remark+"</td>"+
                    "<td>"+ itemStr +"</td>"+
                    "<td style='display: none;'>"+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")  +"</td>"+
                    "</tr>";
            }
            $("#dictmanager-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#dictmanager-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_dictmanager_id="",
    sel_dictmanager_name="",
    sel_dictmanager_uuid="",
    sel_dictmanager_code="";
function set_dictmanager_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#dictmanager_list_table input[name='cbx_dictmanager_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id){
            sel_dictmanager_id=id;
        }
        $("#btn_dictmanager_edit,#btn_dictmanager_delete").removeClass("disabled")

    }else{
        $("#btn_dictmanager_edit,#btn_dictmanager_delete").addClass("disabled");
    }
}


//点击tr赋值
function getDictItem(obj){
    var id=$(obj).attr("id").split(",");
    sel_dictmanager_uuid=id[2];
    sel_dictmanager_code=id[3];
    sel_dictmanager_name=id[4];
    $("#dictitemmanager_widget-grid").show().siblings().hide();
    $("#dictitemmanager_btns,#regionList_dictitemmanager_div,#dictitemmanager_tab_ul").show();
    loaddictitemmanagerTable("",id[2]);
}

//新增验证
function validatedictmanager() {
    $("#dictmanager-form").validate({
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
            $(element).closest('.input-group-dictmanager').removeClass('has-success').addClass('has-error');
            btnConfirmState();
        },

        unhighlight: function(element){
            $(element).closest('.input-group-dictmanager').removeClass('has-error').addClass('has-success');
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
    $('#dictmanager-form .input-group-dictmanager').each(function () {
        if($(this).hasClass("has-success")){
            size+=1;
        }
    });
    if(validateSize==size){
        $("#dictmanagerBtn").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }else{
        $("#dictmanagerBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }
}

function addDictManager(){

    var validMark= $("#dictmanager_validMark option:selected").val(),
     name = $.trim($("#dictmanager_name").val()),
     code = $.trim($("#dictmanager_code").val()),
     remark = $.trim($("#dictmanager_describe").val());
    var data = {name:name,validMark: validMark,code:code,describe:remark };
    doPost("/action/dictmanager/add",data,function(objs){
        if(objs.httpCode=="200"){
            showMsg("温馨提示","添加成功。");
            loaddictmanagerTable();
            $("#dictmanager_widget-grid").show().siblings().hide();
            $("#dictmanager_btns,#regionList_dictmanager_div,#dictmanager_tab_ul").show();
        }else{
            if(objs.code=="Resource.InUse" && objs.httpCode=="400"){
                showErrorMsg("温馨提示","该字典已经存在");
            }else{
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
            }
        }
    });


}


function addProductCatValidate(){
    $("#dictmanager-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            dictmanagerCat_type:{
                required:true
            },
            dictmanager_region:{
                required:true
            },
            dictmanager_image:{
                required:true
            },
            dictmanager_status:{
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
            dictmanagerCat_type:{
                required:"产品类别不能为空"
            },
            dictmanager_region:{
                required:"地域不能为空"
            },
            dictmanager_image:{
                required:"镜像不能为空"
            },
            dictmanager_status:{
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
         $(element).removeClass('dictmanager-hsa-success').addClass('dictmanager-hsa-error');
         dictmanagerValidateBtn("dictmanager-form","dictmanagerBtn","dictmanagerCat_type");
         },

         unhighlight: function(element){
         $(element).removeClass('dictmanager-hsa-error').addClass('dictmanager-hsa-success');
         $(element).parent().find("em").remove();
         dictmanagerValidateBtn("dictmanager-form","dictmanagerBtn","dictmanagerCat_type");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}
function editProductCatValidate(){
    $("#dictmanager_edit-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            dictmanagerCat_type:{
                required:true
            },
            dictmanager_edit_region:{
                required:true
            },
            dictmanager_image:{
                required:true
            },
            dictmanager_status:{
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
            dictmanagerCat_type:{
                required:"产品类别不能为空"
            },
            dictmanager_edit_region:{
                required:"地域不能为空"
            },
            dictmanager_image:{
                required:"镜像不能为空"
            },
            dictmanager_status:{
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
         $(element).removeClass('dictmanager-hsa-success').addClass('dictmanager-hsa-error');
         dictmanagerValidateBtn("dictmanager_edit-form","dictmanager_editBtn");
         },

         unhighlight: function(element){
         $(element).removeClass('dictmanager-hsa-error').addClass('dictmanager-hsa-success');
         $(element).parent().find("em").remove();
         dictmanagerValidateBtn("dictmanager_edit-form","dictmanager_editBtn");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

