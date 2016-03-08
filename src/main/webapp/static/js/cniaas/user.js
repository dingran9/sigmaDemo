/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:用户
 */
function loadUserData() {
    $("#user_list_table").empty().append("<table id='user_table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='user_thead' class='' style='border-top: 1px solid #CCC;'></thead><tbody id='user_tbody'  class='table-tbody'></tbody></table>");
    $("#user_thead").empty().append(
            "<tr><th width='5%'></th>"+
            "<th class='table-thead' width='20%'>"+rpL("email")+"</th>"+
            "<th class='table-thead' width='20%'>"+rpL("phone")+"</th>"+
            "<th class='table-thead' width='20%'>"+rpL("belong_manager")+"</th>"+
            /*"<th class='table-thead' width='15%'>"+rpL("name")+"</th>"+*/
            "<th class='table-thead' width='15%'>"+rpL("status")+"</th>"+
            "<th class='table-thead' width='25%'>"+rpL("createTime")+"</th>"+
            "</tr>");

    userTableInit();
}

var userTable;
var userValue;

var userAccountColIndex = [
    "createTime",
    "email",
    "mobilePhone",
    "belongManager",
    "name",
    "status",
    "createTime"
];

function userTableInit(){
//    $("#btn_user_edit,#btn_user_reset_pwd").addClass("disabled");
    userTable = $("#user_table").dataTable({
        "bDestroy": true,
        /*"bSort":false,*/
        "iDisplayLength" : 10,
        "aaSorting": [[ 6, "desc" ]],
        "bServerSide": true,
        "bAutoWidth": true,
        "sPaginationType": "bootstrap_full",
        "sAjaxDataProp":"datas",
        "sRowSelect": "single",
        "sAjaxSource": "/action/userAccount/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "createTime",sort = "desc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = userAccountColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }

            var pageNo = '', pageSize = '';

            pageSize = oSettings._iDisplayLength;
            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#user_filter_type").html();
            var keyword = $("#userValue").val()?$("#userValue").val():"";
            if(type == "createTime"){
                keyword = getStartEndTime($("#startDate").val(),$("#endDate").val());
            }
            var data = {keyword:keyword,type:type,pageNo:pageNo,pageSize:pageSize,param:params,sort:sort};
            oSettings.qXHRj = doPost(sSource,data,fnCallback);
        },
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str = "";
            var status = "";
            var belongManager="-";
            var time = convertStr(aData.createTime)==""?"-": new Date(aData.createTime).Format("yyyy-MM-dd hh:mm:ss");
            var name=convertStr(aData.name)==""?"":aData.name;
            if(aData.status=="NOT_ACTIVE"){
                status='<span class="not-action-type">'+rpL(aData.status)+'<span>';
            }else if(aData.status=="ENABLE"){
                status='<span class="success-type">'+rpL(aData.status)+'<span>';
            }else{
                status='<span class="disable-type">'+rpL(aData.status)+'<span>';
            }
            if(convertStr(aData.belongManager)!=""){
                belongManager=aData.belongManager.email;
            }
            str += "<td class='check-tr'><label class='checkbox'>"+
                "<input id='user_" + aData.id + "' type='checkbox' name='cbx_user_list' onclick=\"set_user_Sel(this,'"+aData.id+"')\">"+
                "<i></i></label></td>"+
                "<td><a onclick=\"showUserDetail('"+aData.id+"')\">"+aData.email+"</a></td>"+
                "<td>"+aData.mobilePhone+"</td>"+
                "<td>"+belongManager+"</td>"+
                /*"<td>"+name+"</td>"+*/
                "<td>"+status +"</td>"+
                "<td>"+time +"</td>";
            $(nRow).empty().append(str);
//            $(nRow).prop("title","双击可看详情");
//            $(nRow).attr("ondblclick","showUserDetail('"+aData.id+"');");
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
        '    <div class="input-group-btn" style="left:5px;margin-top:1px;">'+
        '    <button id="user_filter_name" type="button" class="btn btn-default" tabindex="-1" style="height: 33px;">全部</button>'+
        '    <button style="height: 33px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="user_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        '    <li><a onclick="user_filter_column_onchange(this)" value="email"  href="javascript:void(0);">邮件</a></li>'+
        '    <li><a onclick="user_filter_column_onchange(this)" value="createTime" href="javascript:void(0);">创建时间</a></li>'+
        '    <li><a onclick="user_filter_column_onchange(this)" value="status"  href="javascript:void(0);">状态</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="filter_value_select" style="left: 5px; position: relative;">' +
//        '<input id="userValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div>');

    getKeydownAndKeyupInterval("userValue",500,execUserSearch);


}
function execUserSearch() {
    var data = userTable.fnSettings();
    userValue = $("#userValue").val();
    //$(".dt-bottom-row").remove();
    userTable.fnDraw();
}
function execFilter(){
    var data = userTable.fnSettings();
    //$(".dt-bottom-row").remove();
    userTable.fnDraw();
}

function user_filter_column_onchange(_this){
    var value = $(_this).attr("value");
    $("#user_filter_name").html($(_this).html());
    user_filter_value_select(value);
    $("#user_filter_type").html(value);
}

function user_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#filter_value_select").empty();
            $("#user_filter_type").html("");
            execFilter();
            break;
        case "email":
            $("#filter_value_select").empty().append('<input id="userValue" class="form-control col-sm-1" style="width: 160px;" type="text" placeholder="邮箱">');
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
            $("#filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="userValue"  value="" onchange="execFilter()">'+
                '<option value="">全部</option>'+
                '<option value="DISABLE">禁用</option>'+
                '<option value="ENABLE">可用</option>'+
                '<option value="NOT_ACTIVE">未激活</option>'+
                '</select>');
            break;
    }
    getKeydownAndKeyupInterval("userValue",500,execUserSearch);
    getKeydownAndKeyupInterval("startDate",500,execUserSearch);
    getKeydownAndKeyupInterval("endDate",500,execUserSearch);

}

var sel_user_id="";
var all_user_data="";
function set_user_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#user_list_table input[name='cbx_user_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_user_data = null;
        // all_user_data = userTable.fnGetData(obj.parent);
        if(null != id)
            sel_user_id=id;

        $("#btn_user_edit,#btn_user_reset_pwd").removeClass("disabled");

    }else{
        all_user_data = null;
        $("#btn_user_edit,#btn_user_reset_pwd").addClass("disabled");
    }
}
/**
 * 添加客户
 */
function addUser(){

    var name = $("#user_add_name").val();
    var id_card = $("#user_add_id_card").val();
    var mobile_phone = $("#user_add_mobile_phone").val();
    if("" == mobile_phone){
        showErrorMsg("手机不能为空。");
        return;
    }
    var email = $("#user_add_email").val();
    if("" == email){
        showErrorMsg("邮箱不能为空。");
        return;
    }
    var password = $("#user_add_pwd").val();
    var rePassword = $("#user_add_rePwd").val();
    if("" == password){
        showErrorMsg("密码不能为空。");
        return;
    }
    if("" == rePassword){
        showErrorMsg("密码不能为空。");
        return;
    }
    if(password!=rePassword){
        showErrorMsg("两次密码不一致。");
        return;
    }
    var paw=hex_md5($.trim($("#user_add_pwd").val()));
    var data = {name:name,idCard:id_card,mobilePhone:mobile_phone,email:email,status:$("#user_add_status").val(),password:paw,isCompany:false};

    $("#user_add_btn").attr("disabled",true);
    doPost("/action/userAccount/create",data,function(objs){
        if(objs.httpCode == "200"){
            $("#user_add_btn").attr("disabled",false);
            $("#user_widget-grid").show().siblings().hide();
            $("#user_btns").show();
            loadUserData();
        }else if(objs.httpCode == 400 && objs.code == "Parameter.Invalid"){
            console.log("code:400,code:Parameter.Invalid,message:"+objs.message);
            showErrorMsg("",objs.message);
        }
    });
}
/**
 * 修改信息
 */
function updateUser(){

    var name = $("#user_edit_name").val();
    var id_card = $("#user_edit_id_card").val();
    var mobile_phone = $("#user_edit_mobile_phone").val();
    if("" == mobile_phone){
        showErrorMsg("手机不能为空。");
        return;
    }
    var email = $("#user_edit_email").val();
    if("" == email){
        showErrorMsg("邮箱不能为空。");
        return;
    }
    var belongManger=$("#user_edit_manager").val();
    if("" == belongManger){
        showErrorMsg("所属管理员不能为空。");
        return;
    }
    var data = {belongManagetId:belongManger,accountId:sel_user_id,name:name,idCard:id_card,mobilePhone:mobile_phone,email:email,status:$("#user_edit_status").val()};

    $("#user_edit_btn").attr("disabled",true);
    doPost("/action/userAccount/edit",data,function(objs){
        if(objs.httpCode == "200"){
            $("#user_edit_btn").attr("disabled",false);
            $("#user_widget-grid").show().siblings().hide();
            $("#user_btns").show();
            loadUserData();
        }else if(objs.httpCode == 400 && objs.code == "Parameter.Invalid"){
            console.log("code:400,code:Parameter.Invalid,message:"+objs.message);
            showErrorMsg("",objs.message);
        }
    });
}
/**
 * 重置密码
 */
function resetPwd(){
    var password = $("#reset_password").val();
    var confirm_password = $("#confirm_reset_password").val();

    if("" == password){
        showErrorMsg("密码不能为空。");
        return;
    }
    if(password.length < 8){
        showErrorMsg("密码格式不正确。");
        return;
    }
    if("" == confirm_password){
        showErrorMsg("确认密码不能为空。");
        return;
    }
    if(confirm_password.length < 8){
        showErrorMsg("确认密码格式不正确。");
        return;
    }
    if(password != confirm_password){
        showErrorMsg("两次密码不一致。")
        return;
    }
    password = hex_md5(password);
    var data = {accountId:sel_user_id,password:password};
    $("#user_reset_pwd_btn").attr("disabled",true);
    doPost("/action/userAccount/resetPwd",data,function(objs){
        if(objs.httpCode == "200"){
            $("#user_reset_pwd_btn").attr("disabled",false);
            $("#user_widget-grid").show().siblings().hide();
            $("#user_btns").show();
            loadUserData();
        }
    });
}

/**
 * 获取详情
 * @param id
 */

function showUserDetail(id){
    doPost("/action/userAccount/info",{accountId:id},function(objs){
        if(objs.httpCode=="200"){
            objs=objs.data;

            $("#user_edit_name").val(objs.name);
            $("#user_edit_id_card").val(objs.idCard);
            $("#user_edit_mobile_phone").val(objs.mobilePhone);
            $("#user_edit_email").val(objs.email);

            var status;
            if(objs.status=="NOT_ACTIVE"){
                status='<span class="not-action-type">'+rpL(objs.status)+'<span>';
            }else if(objs.status=="ENABLE"){
                status='<span class="success-type">'+rpL(objs.status)+'<span>';
            }else{
                status='<span class="disable-type">'+rpL(objs.status)+'<span>';
            }
            $("#user_detail_email").html(objs.email);
            $("#user_detail_phone").html(objs.mobilePhone);
            $("#user_detail_name").html(objs.name);
            $("#user_detail_status").html(status);
            $("#user_detail_regMode").html(rpL(objs.regMode));
            $("#user_detail_sex").html(rpL(rpL(objs.sex)));
            $("#user_detail_createTime").html(new Date(objs.createTime).Format("yyyy-MM-dd hh:mm:ss"));
            $("#user_detail_updateTime").html(new Date(objs.updateTime).Format("yyyy-MM-dd hh:mm:ss"));
            if(convertStr(objs.userEnterpricePo)!=""){
                $("#user_detail_companyName").html(convertStr(objs.userEnterpricePo.name)==""?"-":objs.userEnterpricePo.name);
                $("#user_detail_ad").html(convertStr(objs.userEnterpricePo.address)==""?"-":objs.userEnterpricePo.address);
                $("#user_detail_zipCode").html(convertStr(objs.userEnterpricePo.zipCode)==""?"-":objs.userEnterpricePo.zipCode);
                $("#user_detail_fax").html(convertStr(objs.userEnterpricePo.fax)==""?"-":objs.userEnterpricePo.fax);
                $("#user_detail_website").html(convertStr(objs.userEnterpricePo.website)==""?"-":objs.userEnterpricePo.website);
                $("#user_detail_icp").html(convertStr(objs.userEnterpricePo.icp)==""?"-":objs.userEnterpricePo.icp);
            }
            if(convertStr(objs.billCashPo)!=""){
                $("#user_detail_balance").html(objs.billCashPo.balance);
                $("#user_detail_consumeAmountCurYear").html(objs.billCashPo.consumeAmountCurYear);
                $("#user_detail_totalCost").html(objs.billCashPo.consumeAmountHistory);

            }
            var str="";
            loadUserOrderInfoPoListTable(objs.orderInfoPoList);
            $("#user_detail_modal").show().siblings().hide();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });
}

function loadUserOrderInfoPoListTable(objs){

    $("#user_orderInfoPoList_table").empty().append("<table id='user-orderInfoPoList-table' class='table table-responsive table-striped table-bordered table-hover table-text-center' style='margin-bottom:0;'><thead id='user-orderInfoPoList-thead' class=''></thead><tbody id='user-orderInfoPoList-tbody'></tbody></table>");
    var  loadStr="<tr class='odd'><td valign='top' colspan='6' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>";
    $("#user-orderInfoPoList-tbody").empty().append(loadStr);
    runuserOrderInfoPoListDataTables(objs)
}
function runuserOrderInfoPoListDataTables(objs,callback) {
    var data = objs;
    var str = '';
    var relPayAmount = "";
    var totalPrice = "";
    var status = "";
    var accountDetail = "";
    var endTime="";
    str+="<tr>" +
        "<td>商品</td>" +
        "<td>总价格(元)</td>" +
        "<td>状态</td>" +
        "<td>订单类型</td>" +
        "<td>来源</td>" +
        "<td>计费起始时间</td>" +
        "<td>计费截止时间</td>" +
        "</tr>";
    if(data.length<=0){
        str+="<tr class='odd'><td valign='top' colspan='7' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
    }else{
        for (var i = 0; i < data.length; i++) {
            if (data[i].status == "NotPay") {
                totalPrice = '<span style="margin-left: 5px;">' + data[i].totalPrice + '</span>';
                status = '<span class="pay-balance">未支付<span>';
            } else if (data[i].status == "HavePay") {
                totalPrice = '<span style="margin-left: 5px;">' + data[i].totalPrice + '<span>';
                status = '<span class="success-type">已支付<span>';
            } else {
                totalPrice = '<span style="margin-left: 5px;">' + data[i].totalPrice + '<span>';
                status = '已取消';
            }

            if(new Date().getTime()>data[i].billEndTime){
                endTime="<span class='disable-type' style='word-break: break-word;'>"  + new Date(data[i].billEndTime).Format("yyyy-MM-dd hh:mm:ss")+"</span>";
            }else{
                endTime=   new Date(data[i].billEndTime).Format("yyyy-MM-dd hh:mm:ss")
            }
            accountDetail = "<span class='account-span'>" + "邮箱:" + data[i].account.email + "</br>" + "手机:" + data[i].account.mobilePhone + "</span";
            relPayAmount = convertStr(data[i].relPayAmount) == "" ? "-" : data[i].relPayAmount;
            str += "<tr>" +
                "<td>" + rpL(data[i].resourceType) + "</td>" +
                "<td class='pay-balance'>" + totalPrice + "</td>" +
                "<td>" + status + "</td>" +
                "<td>" + rpL(data[i].type) + "</td>" +
                "<td>" + rpL(data[i].createType) + "</td>" +
                "<td  style='word-break: break-word;'>" + new Date(data[i].billBeginTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                "<td style='word-break: break-word;'>" +endTime + "</td>" +
                "</tr>";
        }
    }
    $("#user-orderInfoPoList-table").empty().append(str);
}

function adduserAccountValidate(){
    $("#user-add-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            account_email:{
                required:true,
                email:true,
                checkEmail:true
            },
            create_user_pwd:{
                required:true,
                pwdValidator:true,
                rangelength:[8,20]
            },
            create_user_rePwd:{
                required:true,
                equalTo:"#user_add_pwd"
            },
            user_phone:{
                required:true,
                phoneNumValidator:true,
                checkPhone:true
            }
        },
        messages:{
            account_email:{
                required:"请输入邮箱",
                checkEmail:"邮箱已被注册",
                email:"请按邮箱格式输入"
            },
            create_user_pwd:{
                required:"请输入密码",
                pwdValidator:"密码必须由8-20位数字及大小写字母构成",
                rangelength:"密码长度在8-20位之间"
            },
            create_user_rePwd:{
                required:"请再次输入密码",
                equalTo:"两次输入密码不一致"
            },
            user_phone:{
                required:"请输入手机号",
                phoneNumValidator:"请按手机号格式输入",
                checkPhone:"手机号已被使用"
            }
        },
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function edituserAccountValidate(){
    $("#user-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            user_edit_email:{
                required:true,
                email:true
            },
            user_edit_mobile_phone:{
                required:true,
                phoneNumValidator:true
            }
        },
        messages:{
            user_edit_email:{
                required:"请输入邮箱",
                email:"请按邮箱格式输入"
            },
            user_edit_mobile_phone:{
                required:"请输入手机号",
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
    doPost("/action/userAccount/checkEmail",{email:value},function(objs){
        if(objs.httpCode == "200"){
            result = true;
        }else{
            result = false;
        }
    },true,false);
    return result;
},"");
/**
 * 验证手机号是否被注册
 */
jQuery.validator.addMethod("checkPhone", function(value, element,param) {
    var result = false;
    doPost("/action/userAccount/checkPhone",{mobilePhone:value},function(objs){
        if(objs.httpCode == "200"){
            result = true;
        }else{
            result = false;
        }
    },true,false);
    return result;
},"");


