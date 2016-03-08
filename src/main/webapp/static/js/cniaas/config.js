/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: Zhangly
 * Date: 2014/11/12
 * Description:
 */

function getConfigInfo(){
    $("#email_server_config_container").empty();
    $("#payee_config_list").empty();
    $("#email_server_config_info").empty();
    $("#payee_config_container").empty();

    doPost("/action/systemDictionary/list",{},function(objs){
        if(objs.httpCode == "200"){
            for(var i=0;i<objs.datas.length;i++){
                if(objs.datas[i].name == "resourceNotifySM" || objs.datas[i].name == "resourceNotifyMail"|| objs.datas[i].name == "isOpenRegister"){
                    if(objs.datas[i].value == "true"){
                        $("#edit-"+objs.datas[i].name).prop("checked",true);
                        $("#"+objs.datas[i].name).html("已开启");
                        continue;
                    }else{
                        $("#"+objs.datas[i].name).html("未开启");
                        continue;
                    }
                }else if(objs.datas[i].name == "resourceExpireNotifyBeforeTime" || objs.datas[i].name == "resourceExpireKeepTime"){
                    $("#"+objs.datas[i].name).html(objs.datas[i].value / 86400 );
                    $("#edit-"+objs.datas[i].name).val(objs.datas[i].value / 86400);
                }else if(objs.datas[i].name == "maxUploadSize" ){
                    if(objs.datas[i].value == 0 || objs.datas[i].value == null){
                        $("#"+objs.datas[i].name).html("--");
                        $("#edit-"+objs.datas[i].name).val("");
                    }else{
                        $("#"+objs.datas[i].name).html(Math.round(objs.datas[i].value  / 1024 / 1024 * 100) / 100 );
                        $("#edit-"+objs.datas[i].name).val(Math.round(objs.datas[i].value  / 1024 / 1024 * 100) / 100);
                    }

                }else if(["alipayKey","smsVkey","apiSecretKey","apiVendorSk"].indexOf(objs.datas[i].name) >= 0){
                    $("#"+objs.datas[i].name).html("******");
                    $("#edit-"+objs.datas[i].name).val(objs.datas[i].value);
                }else{
                    $("#"+objs.datas[i].name).html(objs.datas[i].value);
                    $("#edit-"+objs.datas[i].name).val(objs.datas[i].value);
                }
            }

            if(objs.data.systemSmtps && objs.data.systemSmtps.length != 0){
                for(var i=0;i<objs.data.systemSmtps.length;i++){
                    addEmailServerConfig(objs.data.systemSmtps[i]);
                }
            }else{
                $("#email_server_config_container").addClass("initConfig").empty().append('<span style="float: left; position: relative; left: 80px; bottom: 30px;"><a href="javascript:void(0);" class="btn btn-default" onclick="addEmailServerNode(this)" style=""><i class="fa fa-plus"></i></a></span>');
            }
            if(objs.data.systemPayeeInfos && objs.data.systemPayeeInfos.length != 0){
                for(var i=0;i<objs.data.systemPayeeInfos.length;i++){
                    addPayeeConfig(objs.data.systemPayeeInfos[i]);
                }
            }else{
                $("#payee_config_container").addClass("initConfig").empty().append('<span style="float: left; position: relative; left: 80px; bottom: 30px;"><a href="javascript:void(0);" class="btn btn-default" onclick="addPayeeNode(this)" style=""><i class="fa fa-plus"></i></a></span>');
            }

            $("#email_server_config_container").find(".fa:last").removeClass("fa-minus").addClass("fa-plus");
            $("#payee_config_container").find(".fa:last").removeClass("fa-minus").addClass("fa-plus");

            setLastBtn();
        }
    });
}

function saveConfigInfo(type){

    var alipayPartner   =   $.trim($("#edit-alipayPartner").val());
    var alipayKey       =   $.trim($("#edit-alipayKey").val());
    var alipayAccount   =   $.trim($("#edit-alipayAccount").val());
    var domain   =   $.trim($("#edit-domain").val());
    var idcCompanyName   =   $.trim($("#edit-idcCompanyName").val());
    var resourceExpireNotifyBeforeTime   =   $.trim($("#edit-resourceExpireNotifyBeforeTime").val());
    var resourceExpireKeepTime   =   $.trim($("#edit-resourceExpireKeepTime").val());
    var maxUploadSize   =   $.trim($("#edit-maxUploadSize").val());
    var uploadDir   =   $.trim($("#edit-uploadDir").val());
    var uploadUrl   =   $.trim($("#edit-uploadUrl").val());
    var smsAddress   =   $.trim($("#edit-smsAddress").val());
    var smsAccount   =   $.trim($("#edit-smsAccount").val());
    var smsVkey   =   $.trim($("#edit-smsVkey").val());
    var autoNotifyBeginTime   =   $.trim($("#edit-autoNotifyBeginTime").val());
    var autoNotifyEndTime   =   $.trim($("#edit-autoNotifyEndTime").val());
    var apiBaseAddres   =   $.trim($("#edit-apiBaseAddres").val());
    var apiAccountKey   =   $.trim($("#edit-apiAccountKey").val());
    var apiSecretKey   =   $.trim($("#edit-apiSecretKey").val());
    var apiVendorAk   =   $.trim($("#edit-apiVendorAk").val());
    var apiVendorSk   =   $.trim($("#edit-apiVendorSk").val());
    var resourceNotifySM   =   $("#edit-resourceNotifySM").prop("checked");
    var resourceNotifyMail   =   $("#edit-resourceNotifyMail").prop("checked");
    var portalSystemLogoPath   =   $.trim($("#edit-portalSystemLogoPath").val());
    var managerSystemLogoPath   =   $.trim($("#edit-managerSystemLogoPath").val());
    var carouselFigureMaxNum   =   $.trim($("#edit-carouselFigureMaxNum").val());
    var idcUuid   =   $.trim($("#edit-idcUuid").val());
    var sdkIPs   =   $.trim($("#edit-sdkIPs").val());
    var customerRoleId   =   $.trim($("#edit-customerRoleId").val());
    var isOpenRegister   =   $("#edit-isOpenRegister").prop("checked");
    if(resourceNotifySM){
        resourceNotifySM = "1";
    }else{
        resourceNotifySM = "0";
    }
    if(resourceNotifyMail){
        resourceNotifyMail = "1";
    }else{
        resourceNotifyMail = "0";
    }
    if(isOpenRegister){
        isOpenRegister = "1";
    }else{
        isOpenRegister = "0";
    }


    console.log("apiVendorAk=" + apiVendorAk);

    var systemPayeeInfo = getPayeeData();
    var systemSmtp = getServerNodeData();

    systemPayeeInfo = JSON.stringify(systemPayeeInfo);
    systemSmtp = JSON.stringify(systemSmtp);
    var data = {
        alipayPartner:alipayPartner,
        alipayKey:alipayKey,
        alipayAccount:alipayAccount,
        systemPayeeInfo:systemPayeeInfo,
        domain:domain,
        idcCompanyName:idcCompanyName,
        resourceExpireNotifyBeforeTime:resourceExpireNotifyBeforeTime * 86400,
        resourceExpireKeepTime:resourceExpireKeepTime * 86400,
        maxUploadSize:maxUploadSize * 1024 * 1024,
        uploadDir:uploadDir,
        uploadUrl:uploadUrl,
        smsAddress:smsAddress,
        smsAccount:smsAccount,
        smsVkey:smsVkey,
        autoNotifyBeginTime:autoNotifyBeginTime,
        autoNotifyEndTime:autoNotifyEndTime,
        apiBaseAddres:apiBaseAddres,
        apiAccountKey:apiAccountKey,
        apiSecretKey:apiSecretKey,
        apiVendorAk:apiVendorAk,
        apiVendorSk:apiVendorSk,
        resourceNotifySM:resourceNotifySM,
        resourceNotifyMail:resourceNotifyMail,
        isOpenRegister:isOpenRegister,
        systemSmtp:systemSmtp,
        delSystemPayeeInfos:delSystemPayeeInfos,
        delSystemSmtps:delSystemSmtps,
        portalSystemLogoPath:portalSystemLogoPath,
        carouselFigureMaxNum:carouselFigureMaxNum,
        idcUuid:idcUuid,
        //sdkIPs:sdkIPs,
        customerRoleId:customerRoleId,
        managerSystemLogoPath:managerSystemLogoPath
    };
    var url = "/action/systemDictionary/edit",
        message = "修改系统配置成功";

    if(type == "create"){
        url = "/action/systemDictionary/create";
        message = "初始化系统配置成功";
    }

    doPost(url,data,function(objs){
        if(objs.httpCode == "200"){
            showMsgs("操作成功",message,function(){
                if(type == "create"){
                    window.location.replace("/action/idcManager/index");
                }else{
                    getConfigInfo();

                    showInfo();
                    delSystemSmtps = "";
                    delSystemPayeeInfos = "";
                }
            });
        }else{
            showErrorMsg(message+"失败","程序内部异常");
        }
    });
}

/**
 * 验证配置信息是否符合格式
 */
function validateConfig() {
    $("#config-edit-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            alipayPartner: {
                required: true
            },
            alipayKey: {
                required: true
            },
            alipayAccount: {
                required: true
            },
            domain: {
                required: true
            },
            idcCompanyName: {
                required: true
            },
            resourceExpireNotifyBeforeTime: {
                required: true
            },
            resourceExpireKeepTime: {
                required: true
            },
            maxUploadSize: {
                required: true
            },
            uploadDir: {
                required: true
            },
            uploadUrl: {
                required: true
            },
            smsAddress: {
                required: true
            },
            smsAccount: {
                required: true
            },
            smsVkey: {
                required: true
            },
            autoNotifyBeginTime: {
                required: true
            },
            autoNotifyEndTime: {
                required: true
            },
            apiBaseAddres: {
                required: true
            },
            apiAccountKey: {
                required: true
            },
            apiSecretKey: {
                required: true
            },
            apiVendorAk: {
                required: true
            },
            apiVendorSk: {
                required: true
            },
            resourceNotifySM: {
                required: true
            },
            resourceNotifyMail: {
                required: true
            },
            /*fromAddr: {
                required: true,
                email:true
            },*/
            isDefault: {
                required: true
            }/*,
            host: {
                required: true
            },
            port: {
                required: true
            },
            name: {
                required: true
            },
            password: {
                required: true
            },
            account_name: {
                required: true
            },
            account: {
                required: true
            },
            bank_name: {
                required: true
            },
            description: {
                required: true
            }*/

        },
        messages: {
            alipayPartner: {
                required: "请输入支付宝partner"
            },
            alipayKey: {
                required: "请输入支付宝account"
            },
            alipayAccount: {
                required: "请输入支付宝key"
            },
            domain: {
                required: "请输入域名"
            },
            idcCompanyName: {
                required: "请输入企业名称"
            },
            resourceExpireNotifyBeforeTime: {
                required: "请输入续费通知提前天数"
            },
            resourceExpireKeepTime: {
                required: "请输入到期资源保留天数"
            },
            maxUploadSize: {
                required: "请输入单个附件大小"
            },
            uploadDir: {
                required: "请输入附件路径"
            },
            uploadUrl: {
                required: "请输入附件访问地址"
            },
            smsAddress: {
                required: "请输入接口地址"
            },
            smsAccount: {
                required: "请输入用户名"
            },
            smsVkey: {
                required: "请输入密码"
            },
            autoNotifyBeginTime: {
                required: "请输入发送起始时间"
            },
            autoNotifyEndTime: {
                required: "请输入发送截止时间"
            },
            apiBaseAddres: {
                required: "请输入地址"
            },
            apiAccountKey: {
                required: "请输入account_key"
            },
            apiSecretKey: {
                required: "请输入secret_key"
            },
            apiVendorAk: {
                required: "请输入vendor_ak"
            },
            apiVendorSk: {
                required: "请输入vendor_sk"
            },
            resourceNotifySM: {
                required: "开启短信通知"
            },
            resourceNotifyMail: {
                required: "开启邮件通知"
            },
            /*fromAddr: {
                required: "请输入发件人邮箱",
                email:"请按邮箱格式输入"
            },*/
            isDefault: {
                required: "是否为默认发件服务器"
            }
           /* host: {
                required: "请输入smtp服务器"
            },
            port: {
                required: "请输入smtp端口"
            },
            name: {
                required: "请输入用户名"
            },
            password: {
                required: "请输入密码"
            },
            account_name: {
                required: "请输入收款账户名"
            },
            account: {
                required: "请输入收款账户"
            },
            bank_name: {
                required: "请输入收款账户银行"
            },
            description: {
                required: "请输入备注"
            }*/

        },

        highlight: function(element){
            $(element).closest('.input-group-register').removeClass('has-success').addClass('has-error');
        },

        unhighlight: function(element){
            $(element).closest('.input-group-register').removeClass('has-error').addClass('has-success');
        },

        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343');
            element.after(error);
        }

    });
}

function emailCheck(_this){
    var errorStr = '<em class="invalid" style="text-align: left; color: rgb(252, 67, 67);">请按邮箱格式输入</em>';
    var value = $(_this).val();
    var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!emailReg.test(value)){
        //$(_this).focus();
        if(value == ''){
            errorStr = '<em class="invalid" style="text-align: left; color: rgb(252, 67, 67);">邮箱不能为空</em>';
        }
        $(_this).closest('span').find("em").remove();
        $(_this).closest('span').append(errorStr);
    }else{
        $(_this).closest('span').find("em").remove();
    }
}
function valueRequired(_this){
    var value = $(_this).val();
    var errorStr = '<em class="invalid" style="text-align: left; color: rgb(252, 67, 67);">值不能为空</em>';
    if(value == ''){
        $(_this).closest('span').find("em").remove();
        $(_this).closest('span').append(errorStr);
    }else{
        $(_this).closest('span').find("em").remove();
    }
}
function addPayeeNode(_this){
    /*if($("#payee_config_container").find('.fa-minus').length == 0){
        $(_this).closest(".row").remove();
    }*/
    if($("#payee_config_container").hasClass("initConfig")){
        $("#payee_config_container").removeClass("initConfig").empty();
    }
    $("#payee_config_container").append('<div class="payee" payeeid="0"><div class="row row-padding">'+
        '<span class="col-lg-2 col-md-2 col-md-2 config-label">开户名称:</span>'+
        '<span class="col-lg-4 col-md-4"><input type="text" maxlength="255" onblur="valueRequired(this)" name="account_name" class="form-control" placeholder=""></span>'+
        '    <span class="col-lg-2 col-md-2 col-md-2 config-label">开户账号:</span>'+
        '    <span class="col-lg-4 col-md-4"><input type="text" maxlength="255" onchange="valueRequired(this)" name="account" class="form-control" placeholder=""></span>'+
        '    </div>'+
        '<div class="row row-padding">'+
        '<span class="col-lg-2 col-md-2 col-md-2 config-label">开户银行:</span>'+
        '<span class="col-lg-4 col-md-4"><input type="text" maxlength="255" onblur="valueRequired(this)"  name="bank_name" class="form-control" placeholder=""></span>'+
        '    <span class="col-lg-2 col-md-2 col-md-2 config-label">描述:</span>'+
        '    <span class="col-lg-4 col-md-4"><input type="text"  maxlength="255"  name="description" class="form-control" placeholder=""></span>'+
        '        <span style="float: right; position: relative; left: 50px;bottom:30px;">'+
        '            <a onclick="addPayeeNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-plus"></i></a></span>'+
        '    </div></div>');

    $(_this).closest("div").append('<span style="float: right; position: relative; left: 50px;bottom:30px;">'+
        '            <a onclick="removePayeeNode(this)" class="btn btn-default" href="javascript:void(0);">'+
        '<i class="fa fa-minus"></i></a></span>');

    $(_this).closest("span").remove();
    setLastBtn();
}

var delSystemPayeeInfos = "";
function removePayeeNode(_this){
    if($(_this).closest(".payee").attr("payeeid") != "0"){
        delSystemPayeeInfos += $(_this).closest(".payee").attr("payeeid") + ',';
    }

    $(_this).closest(".payee").remove();
    setLastBtn();
}

function getPayeeData(){
    var id,account_name,account,bank_name,description;
    var data = {};
    var payeeList = [];
    $(".payee").each(function(){
        id = $(this).attr("payeeid");
        account_name = $(this).find("input[name='account_name']").val();
        account = $(this).find("input[name='account']").val();
        bank_name = $(this).find("input[name='bank_name']").val();
        description = $(this).find("input[name='description']").val();

        data = {
            id:id,
            accountName:account_name,
            account:account,
            bankName:bank_name,
            description:description
        };
        payeeList.push(data);
    });

    return payeeList;

}


function addEmailServerNode(_this){
    /*if($("#email_server_config_container").find('.fa-minus').length == 0){
        $(_this).closest(".row").remove();
    }*/
    if($("#email_server_config_container").hasClass("initConfig")){
        $("#email_server_config_container").removeClass("initConfig").empty();
    }
    $("#email_server_config_container").append('<div class="email_server_config" smtpid="0">'+
        '<div class="row row-padding">'+
        '<span class="col-lg-2 col-md-2 col-md-2 config-label">发件人邮箱:</span>'+
        '<span class="col-lg-4 col-md-4"><input type="text" id="edit-from_addr " onblur="emailCheck(this)" name="fromAddr" class="form-control" placeholder=""></span>'+
        '<span class="col-lg-2 col-md-2 col-md-2 config-label">是否为默认发件服务器:</span>'+
        '<span class="col-lg-4 col-md-4"><label class="radio"> <input type="radio" name="isDefault" > <i></i></label></span>'+
        '</div>'+
        '<div class="row row-padding">'+
        '    <span class="col-lg-2 col-md-2 col-md-2 config-label">smtp服务器:</span>'+
        '    <span class="col-lg-4 col-md-4"><input type="text" maxlength="128" id="edit-host" onblur="valueRequired(this)" name="host" class="form-control" placeholder=""></span>'+
        '        <span class="col-lg-2 col-md-2 col-md-2 config-label">smtp端口:</span>'+
        '        <span class="col-lg-4 col-md-4"><input type="text" maxlength="5" id="edit-port" onblur="valueRequired(this)" name="port" class="form-control" placeholder=""></span>'+
        '        </div>'+
        '        <div class="row row-padding">'+
        '            <span class="col-lg-2 col-md-2 col-md-2 config-label">用户名:</span>'+
        '            <span class="col-lg-4 col-md-4"><input type="text"  maxlength="255" id="edit-name" onblur="valueRequired(this)" name="name" class="form-control" placeholder=""></span>'+
        '                <span class="col-lg-2 col-md-2 col-md-2 config-label">密码:</span>'+
        '                <span class="col-lg-4 col-md-4"><input type="password"  maxlength="255" id="edit-password" onblur="valueRequired(this)" name="password" class="form-control" placeholder=""></span>'+
        '                    <span style="float: right; position: relative; left: 50px;bottom:30px;">'+
        '                        <a onclick="addEmailServerNode(this)" class="btn btn-default" href="javascript:void(0);">'+
        '                            <i class="fa fa-plus"></i>'+
        '                        </a>'+
        '                    </span>'+
        '                </div>'+
        '            </div>');

    $(_this).closest("div").append('<span style="float: right; position: relative; left: 50px;bottom:30px;">'+
        '            <a onclick="removeEmailServerNode(this)" class="btn btn-default" href="javascript:void(0);">'+
        '<i class="fa fa-minus"></i></a></span>');

    $(_this).closest("span").remove();
    setLastBtn();
}
var delSystemSmtps = "";
function removeEmailServerNode(_this){
    if($(_this).closest(".email_server_config").attr("smtpid") != "0"){
        delSystemSmtps += $(_this).closest(".email_server_config").attr("smtpid") + ',';
    }

    if($(_this).closest(".email_server_config").find("input[name='isDefault']").prop("checked")){
        $(".email_server_config:first").find("input[name='isDefault']").prop("checked",true);
    }
    $(_this).closest(".email_server_config").remove();
    setLastBtn();
}


function getServerNodeData(){
    var id,from_addr,isDefault,host,port,name,password;
    var serverNode = {};
    var serverNodeList = [];

    $(".email_server_config").each(function(){
        id = $(this).attr("smtpid");
        from_addr = $(this).find("input[name='fromAddr']").val();
        isDefault = $(this).find("input[name='isDefault']").prop("checked");
        if(isDefault){
            isDefault = "DEFAULT";
        }else{
            isDefault = "NOT_DEFAULT";
        }
        host = $(this).find("input[name='host']").val();
        port = $(this).find("input[name='port']").val();
        name = $(this).find("input[name='name']").val();
        password = $(this).find("input[name='password']").val();

        if(from_addr == "" && host == "" && port == "" && name == "" && password == "" ){
            return;
        }

        serverNode = {
            id:id,
            fromAddr:from_addr,
            host:host,
            port:Number(port),
            name:name,
            password:password,
            isDefault:isDefault
        };
        serverNodeList.push(serverNode);
    });
    return serverNodeList;
}

function addEmailServerConfig(data){
    var showInfostr = "";
    var editInfostr = "";
    var passwordLabel = "";
    var isTrue = "否";
    var editIsDefault = "";

    if(data.password != ''){
        passwordLabel = "******";
    }

    if(data.isDefault == "DEFAULT"){
        isTrue = "是";
        editIsDefault = "checked='true'";
    }


    showInfostr = '<div class="email_server_config_info"><div class="row row-padding">'+
                  '    <span class="col-lg-2 col-md-2 col-md-2 config-label">发件人邮箱:</span>'+
                  '    <span class="col-lg-4 col-md-4"> <label id="from_addr " class="form-control" >'+ data.fromAddr +'</label></span>'+
                  '    <span class="col-lg-2 col-md-2 col-md-2 config-label">是否为默认发件服务器:</span>'+
                  '    <span class="col-lg-4 col-md-4"> <label id="isDefault"  class="form-control" >'+ isTrue +'</label></span>'+
                  '</div>'+
                  '<div class="row row-padding">'+
                  '    <span class="col-lg-2 col-md-2 config-label">smtp服务器:</span>'+
                  '    <span class="col-lg-4 col-md-4"> <label id="host" class="form-control" >' + data.host + '</label></span>'+
                  '<span class="col-lg-2 col-md-2 config-label">smtp端口:</span>'+
                  '<span class="col-lg-4 col-md-4"> <label id="port" class="form-control" >' + data.port + '</label></span>'+
                  '</div>'+
                  '    <div class="row row-padding">'+
                  '        <span class="col-lg-2 col-md-2 config-label">用户名:</span>'+
                  '        <span class="col-lg-4 col-md-4"> <label id="name"  class="form-control" >' + data.name + '</label></span>'+
                  '        <span class="col-lg-2 col-md-2 config-label">密码:</span>'+
                  '        <span class="col-lg-4 col-md-4"> <label id="password" class="form-control" >' + passwordLabel  + '</label></span>'+
                  '    </div></div>';


    $("#email_server_config_info").append(showInfostr);

    editInfostr = '<div class="email_server_config" smtpid="'+data.id+'">'+
        '<div class="row row-padding">'+
        '<span class="col-lg-2 col-md-2 config-label">发件人邮箱:</span>'+
        '<span class="col-lg-4 col-md-4"><input type="text" id="edit-from_addr "  onblur="emailCheck(this)" name="fromAddr"  value="'+ data.fromAddr +'" class="form-control" placeholder=""></span>'+
        '<span class="col-lg-2 col-md-2 config-label">是否为默认发件服务器:</span>'+
        '<span class="col-lg-4 col-md-4"><label class="radio"><input type="radio" name="isDefault" '+ editIsDefault +' ><i></i></label></span>'+
        '</div>'+
        '<div class="row row-padding">'+
        '<span class="col-lg-2 col-md-2 config-label">smtp服务器:</span>'+
        '<span class="col-lg-4 col-md-4"><input type="text" maxlength="128" id="edit-host" onblur="valueRequired(this)" name="host"  value="'+ data.host +'" class="form-control" placeholder=""></span>'+
        '<span class="col-lg-2 col-md-2 config-label">smtp端口:</span>'+
        '<span class="col-lg-4 col-md-4"><input type="text" maxlength="5" id="edit-port" name="port" onblur="valueRequired(this)" value="'+ data.port +'" class="form-control" placeholder=""></span>'+
        '</div>'+
        '<div class="row row-padding">'+
        '<span class="col-lg-2 col-md-2 config-label">用户名:</span>'+
        '<span class="col-lg-4 col-md-4"><input type="text"  maxlength="255" id="edit-name" name="name" onblur="valueRequired(this)"  value="'+ data.name +'" class="form-control" placeholder=""></span>'+
        '<span class="col-lg-2 col-md-2 config-label">密码:</span>'+
        '<span class="col-lg-4 col-md-4"><input type="password"  maxlength="255" id="edit-password" name="password" onblur="valueRequired(this)" value="'+ data.password +'" class="form-control" placeholder=""></span>'+
        '<span style="float: right; position: relative; left: 50px;bottom:30px;">'+
        '<a onclick="removeEmailServerNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-minus"></i></a>'+
        '</span></div></div>';

    $("#email_server_config_container").append(editInfostr);
}

function addPayeeConfig(data){
    var showInfostr = "";
    var editInfostr = "";


    showInfostr = '<div class="payee_config_list"><div class="row row-padding">'+
                   '<span class="col-lg-2 col-md-2 config-label">开户名称:</span>'+
                   '<span class="col-lg-4 col-md-4"> <label id="account_name" class="form-control" >'+ data.accountName +'</label></span>'+
                   '<span class="col-lg-2 col-md-2 config-label">开户账号:</span>'+
                   '<span class="col-lg-4 col-md-4"> <label id="account" class="form-control" >'+ data.account +'</label></span>'+
                   '</div>'+
                   '<div class="row">'+
                   '<span class="col-lg-2 col-md-2 config-label">开户银行:</span>'+
                   '<span class="col-lg-4 col-md-4"> <label id="bank_name" class="form-control" >'+ data.bankName +'</label></span>'+
                   '<span class="col-lg-2 col-md-2 config-label">描述:</span>'+
                   '<span class="col-lg-4 col-md-4"> <label id="description" class="form-control" >'+ data.description +'</label></span>'+
                   '</div></div>';


    $("#payee_config_list").append(showInfostr);

    editInfostr = '<div class="payee" payeeid="'+data.id+'">'+
                    '<div class="row row-padding">'+
                    '<span class="col-lg-2 col-md-2 config-label">开户名称:</span>'+
                    '<span class="col-lg-4 col-md-4"><input type="text" maxlength="255" onblur="valueRequired(this)" id="edit-account_name" name="account_name" value="'+ data.accountName +'" class="form-control" placeholder=""></span>'+
                    '<span class="col-lg-2 col-md-2 config-label">开户账号:</span>'+
                    '<span class="col-lg-4 col-md-4"><input type="text" maxlength="255" onblur="valueRequired(this)" id="edit-account" name="account" value="'+ data.account +'" class="form-control" placeholder=""></span>'+
                    '</div>'+
                    '<div class="row row-padding">'+
                    '    <span class="col-lg-2 col-md-2 config-label">开户银行:</span>'+
                    '    <span class="col-lg-4 col-md-4"><input type="text" maxlength="255" onblur="valueRequired(this)" id="edit-bank_name" name="bank_name" value="'+ data.bankName +'" class="form-control" placeholder=""></span>'+
                    '        <span class="col-lg-2 col-md-2 config-label">描述:</span>'+
                    '        <span class="col-lg-4 col-md-4"><input type="text"  maxlength="255" id="edit-description" name="description" value="'+ data.description +'" class="form-control" placeholder=""></span>'+
                    '            <span style="float: right; position: relative; left: 50px;bottom:30px;">'+
                    '                <a onclick="removePayeeNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-minus"></i></a></span>'+
                    '        </div>'+
                    '    </div>';

    $("#payee_config_container").append(editInfostr);

}
function setLastBtn(){
    /*if($("#payee_config_container").html() == ""){
       $("#payee_config_container").append('<div class="row row-padding"><span style=" position: relative; left: 120px;bottom:40px;">'+
           '<a onclick="addPayeeNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-plus"></i></a></span></div>');
    }

    if($("#email_server_config_container").html() == ""){
        $("#email_server_config_container").append('<div class="row row-padding"><span style=" position: relative; left: 80px;bottom:40px;">'+
            '<a onclick="addEmailServerNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-plus"></i></a></span></div>');
    }*/
    var delPayeeBtnStr = "";
    if($("#payee_config_container").find('.payee').size() > 1) {
        delPayeeBtnStr = '<a onclick="removePayeeNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-minus"></i></a>';
    }
    var delemailBtnStr = "";
    if($("#email_server_config_container").find('.email_server_config').size() > 1) {
        delemailBtnStr = '<a onclick="removeEmailServerNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-minus"></i></a>';
    }

    $(".payee:last").find("span:last").css("left","80px").empty().append(delPayeeBtnStr +
        '<a style="" onclick="addPayeeNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-plus"></i></a>');
    $(".email_server_config:last").find("span:last").css("left","80px").empty().append(delemailBtnStr +
        '<a style="" onclick="addEmailServerNode(this)" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-plus"></i></a>');

}