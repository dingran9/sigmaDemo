/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:管理员用户
 */
function managerUserData() {
    $("#manager_list_table").empty().append("<table id='manager_table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='manager_thead' class='' style='border-top: 1px solid #CCC;'></thead><tbody id='manager_tbody' class='table-tbody'></tbody></table>");
    $("#manager_thead").empty().append(
            "<tr><th width='5%'></th>"+
            "<th class='table-thead' width='20%'>"+rpL("email")+"</th>"+
            "<th class='table-thead' width='15%'>"+rpL("status")+"</th>"+
            "<th class='table-thead' width='20%'>"+rpL("roleType")+"</th>"+
            "<th class='table-thead' width='25%'>"+rpL("phone")+"</th>"+
            "<th class='table-thead' width='15%'>"+rpL("createTime")+"</th>"+
            "</tr>");

    managerTableInit();
}

var managerTable;
var managerValue;

var idcManagerColIndex = [
    "email",
    "email",
    "status",
    "isStaff",
    "createTime"
];

function managerTableInit(){
    $("#btn_manager_delete,#btn_manager_enabled,#btn_manager_disabled").addClass("disabled");
    managerTable = $("#manager_table").dataTable({
        "bDestroy": true,
        "iDisplayLength" : 10,
        "aaSorting": [[ 5, "desc" ]],
        /*"bSort":false,*/
        "bServerSide": true,
        "bAutoWidth": true,
        "sPaginationType": "bootstrap_full",
        "sAjaxDataProp":"datas",
        "sRowSelect": "single",
        "sAjaxSource": "/action/idcManager/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {

            var params = "email",sort = "asc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = idcManagerColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }

            var pageNo = '', pageSize = '';

            pageSize =  oSettings._iDisplayLength;
            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#manager_filter_type").html();
            var keyword = $("#managerValue").val()?$("#managerValue").val():"";
            if(type == "createTime") {
                keyword = getStartEndTime($("#startDate").val(),$("#endDate").val());
            }
            var data = {keyword:keyword,type:type,pageNo:pageNo,pageSize:pageSize,param:params,sort:sort};
            oSettings.qXHRj = doPost(sSource,data,fnCallback);
        },
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str = '';
            var status="";
            var time="";
            var phone;
            if(aData.status=="NOT_ACTIVE"){
                status='<span class="not-action-type">'+rpL(aData.status)+'<span>';
            }else if(aData.status=="ENABLE"){
                status='<span class="success-type">'+rpL(aData.status)+'<span>';
            }else{
                status='<span class="disable-type">'+rpL(aData.status)+'<span>';
            }
            time= convertStr(aData.createTime)==""?"-": new Date(aData.createTime).Format("yyyy-MM-dd hh:mm:ss");
            phone=convertStr(aData.mobilePhone)==""?"":aData.mobilePhone;
            str += "<td class='check-tr'><label class='checkbox'>"+
                "<input id='manager_" + aData.id + "' type='checkbox' name='cbx_manager_list' onclick=\"set_manager_Sel(this,'"+aData.id+"','"+aData.status+"')\">"+
                "<i></i></label></td>"+
                "<td>"+aData.email+"</td>"+
                "<td>"+status+"</td>"+
                "<td>"+aData.role.name+"</td>"+
                "<td>"+phone+"</td>"+
                "<td>"+ time +"</td>";

            $(nRow).empty().append(str);
//            $(nRow).prop("title","双击可看详情");
            $(nRow).attr("ondblclick","showUserDetail('"+aData.id+"');");
        },
        "oLanguage": {
            "sZeroRecords": "没有检索到数据",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {"sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            },
            "sFilterPlace": "请输入关键词",
            "sProcessing": "<img src='/static/smartadmin/img/loading-image.gif' />"
        },
        "aoColumnDefs": [
            {
                bSortable: false,
                aTargets: [ 0 ]
            },
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });

    $(".dataTables_length").remove();
    $(".dataTables_filter").empty().css("left","0").append( '<div class="input-group">'+
        '    <div class="input-group-btn" style="margin-top:1px;left:5px;">'+
        '    <button id="manager_filter_name" type="button" class="btn btn-default" tabindex="-1" style="height: 33px;">全部</button>'+
        '    <button style="height: 33px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="manager_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        '    <li><a onclick="manager_filter_column_onchange(this)" value="email"  href="javascript:void(0);">邮件</a></li>'+
        '    <li><a onclick="manager_filter_column_onchange(this)" value="createTime" href="javascript:void(0);">创建时间</a></li>'+
        '    <li><a onclick="manager_filter_column_onchange(this)" value="status"  href="javascript:void(0);">状态</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="filter_value_select" style="left: 5px; position: relative;">' +
        '<input id="managerValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div>');

    getKeydownAndKeyupInterval("managerValue",500,execManagerSearch);

}

function execManagerSearch() {
    var data = managerTable.fnSettings();
    managerValue = $("#managerValue").val();
    //$(".dt-bottom-row").remove();
    managerTable.fnDraw();
}
function execFilter(){
    var data = managerTable.fnSettings();
    //$(".dt-bottom-row").remove();
    managerTable.fnDraw();
}

function manager_filter_column_onchange(_this){
    var value = $(_this).attr("value");
    $("#manager_filter_name").html($(_this).html());
    manager_filter_value_select(value);
    $("#manager_filter_type").html(value);
}

function manager_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#filter_value_select").empty();
            $("#manager_filter_type").html("");
            break;
        case "email":
            $("#filter_value_select").empty().append('<input id="managerValue" class="form-control col-sm-1" style="width: 160px;" type="text" placeholder="邮箱">');
            break;
        case "createTime":{
            $("#filter_value_select").empty().append(
                    '<input id="startDate" class="form-control col-sm-1" type="text" style="width: 120px;height: 32px;" placeholder="起始时间"/>' +
                    '<span class="col-sm-1" style="width:20px;margin-left: 1px;margin-top:10px;">--</span> ' +
                    '<input id="endDate" class="form-control col-sm-1" type="text" style="width: 120px;margin-left: 158px;margin-top:-32px;height: 32px;" placeholder="截止时间"/>');

//            $(".dataTables_filter .input-group").css("width","100%");

            // START AND FINISH DATE
            $('#startDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#endDate').datepicker('option', 'minDate', selectedDate);
                    execFilter();
                }
            });

            $('#endDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#startDate').datepicker('option', 'maxDate', selectedDate);
                    execFilter();
                }
            });

            break;
        }
        case "status":
            $("#filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="managerValue"  value="" onchange="execFilter()">'+
                '<option value="">全部</option>'+
                '<option value="DISABLE">禁用</option>'+
                '<option value="ENABLE">可用</option>'+
                '</select>');
            break;
    }

    execFilter();

    getKeydownAndKeyupInterval("managerValue",500,execManagerSearch);
    getKeydownAndKeyupInterval("startDate",500,execManagerSearch);
    getKeydownAndKeyupInterval("endDate",500,execManagerSearch);

}

var sel_manager_id="";
var all_manager_data="";
function set_manager_Sel(obj,id,status){
    var obj_checked = obj.checked;
    $("#manager_list_table input[name='cbx_manager_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_manager_data = null;
        // all_manager_data = managerTable.fnGetData(obj.parent);
        if(null != id)
            sel_manager_id=id;
        $("#btn_manager_edit, #btn_manager_resetPwd").removeClass("disabled");
        if(status=="ENABLE"){
            $("#btn_manager_disabled").removeClass("disabled");
            $("#btn_manager_delete,#btn_manager_enabled").addClass("disabled");
        }else{
            $("#btn_manager_disabled").addClass("disabled");
            $("#btn_manager_delete,#btn_manager_enabled").removeClass("disabled");
        }

    }else{
        $("#btn_manager_delete,#btn_manager_enabled,#btn_manager_edit,#btn_manager_disabled, #btn_manager_resetPwd").addClass("disabled");
        all_manager_data = null;
    }
    //console.log("id="+id);
}

function showManagerDetail(id){
    doPost("/action/idcManager/detail",{managerId:id},function(objs){

    });
}


function addaccountValidate(){
    $("#manager-wizard-1").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            create_manager_email:{
                required:true,
                email:true,
                checkEmail:true
            },
            create_manager_pwd:{
                required:true,
                pwdValidator:true,
                rangelength:[8,20]
            },
            create_manager_rePwd:{
                required:true,
                equalTo:"#create_manager_pwd"
            },
            create_manager_phone:{
                phoneNumValidator:true
            }
        },
        messages:{
            create_manager_email:{
                required:"请输入邮箱",
                checkEmail:"邮箱已被注册",
                email:"请按邮箱格式输入"
            },
            create_manager_pwd:{
                required:"请输入密码",
                pwdValidator:"密码必须由8-20位数字及大小写字母构成",
                rangelength:"密码长度在8-20位之间"
            },
            create_manager_rePwd:{
                required:"请再次输入密码",
                equalTo:"两次输入密码不一致"
            },
            create_manager_phone:{
                phoneNumValidator:"请按手机号格式输入"
            }
        },
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

/**
 * 验证邮箱是否被注册
 */
jQuery.validator.addMethod("checkEmail", function(value, element,param) {
    var result = false;
    doPost("/action/idcManager/checkEmail",{email:value},function(objs){
        if(objs.httpCode == "200"){
            result = true;
        }else{
            result = false;
        }
    },true,false);
    return result;
},"");

/**
 * 编辑账户信息
 */
function editAccountInfo(){
    var data = {managerId:sel_manager_id};
    doPost("/action/idcManager/edit",data,function(objs){
        if(objs.httpCode == "200"){
            showMsg("编辑成功","账户信息修改完成");
        }else{
            showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
        }
    });
}

/**
 * 重置账户密码（后台登陆账户）
 */
function resetAccountPassword(){
    var newPassword = $("#reset_password").val();
    doPost("/action/idcManager/resetPassword",{managerId:sel_manager_id,password:hex_md5(newPassword)},function(objs){
        if(objs.httpCode == "200"){
            showMsg("操作成功","重置密码完成");
            clearForm("manager_reset_pwd");
        }else{
            showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
        }
    });
}


function resetPwdFormValidate(){
    $("#reset_pwd_form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            newPassword:{
                required:true,
                pwdValidator:true,
                rangelength:[8,20]
            },
            confirmPwd:{
                required:true,
                equalTo:"#reset_password"
            }
        },
        messages:{
            newPassword:{
                required:"请输入密码",
                pwdValidator:"密码必须由8-20位数字及大小写字母构成",
                rangelength:"密码长度在8-20位之间"
            },
            confirmPwd:{
                required:"请再次输入密码",
                equalTo:"两次输入密码不一致"
            }
        },
        highlight:function(element){
            $(element).closest("td").addClass("state-error").removeClass("state-success");
            setResetPwdBtnState();
        },
        unhighlight:function(element){
            $(element).closest("td").addClass("state-success").removeClass("state-error");
            setResetPwdBtnState();
        },
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function setResetPwdBtnState(){
    var size = 0;
    $("#reset_pwd_form td").each(function(){
        if($(this).hasClass("state-success")){
            size++;
        }
    });
    if(2 === size){
        $("#manager_reset_pwd_btn").addClass("btn-primary").removeClass("disabled txt-color-darken");
    }else{
        $("#manager_reset_pwd_btn").removeClass("btn-primary").addClass("disabled txt-color-darken");
    }
}



function editManagerFormValidate(){
    $("#manager-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            manager_edit_phone:{
                phoneNumValidator:true
            }
        },
        messages:{
            manager_edit_phone:{
                phoneNumValidator:"请按手机格式输入"
            }
        },
        highlight:function(element){
            $(element).closest("td").addClass("state-error").removeClass("state-success");
            setEditManagerFormBtnState();
        },
        unhighlight:function(element){
            $(element).closest("td").addClass("state-success").removeClass("state-error");
            setEditManagerFormBtnState();
        },
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function setEditManagerFormBtnState(){
    var size = 0;
    $("#manager-form td").each(function(){
        if($(this).hasClass("state-success")){
            size++;
        }
    });
    if(1 === size){
        $("#manager_edit_btn").addClass("btn-primary").removeClass("disabled txt-color-darken");
    }else{
        $("#manager_edit_btn").removeClass("btn-primary").addClass("disabled txt-color-darken");
    }
}
