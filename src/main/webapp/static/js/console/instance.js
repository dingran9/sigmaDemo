
//按用户获取云主机列表
/*function  userList_instance_onchange(user){
    $("#toolbar_instance").show();
    $("#widget-grid").show();
    var params={
        "url":"/action/instance/findInstanceListByUser",
        "data":{"user":user}
    }
    if(params.data.user==null||params.data.user==""){
        return;
    }
    loadInstanceData(params);
}*/
/**
 * 地域列表
 */
function listRegionsFromInstance(){
    doPost("/action/region/findRegionList",{},function(objs){
        if(objs.httpCode == "200") {
                var data = objs.data;
                var str = "";
                if(data==null||data.length<=0){
                    showErrorMsg("","获取地域列表失败！");
                    return;
                }
                for(var i=0;i<data.length;i++){
                    str +=" <a onclick=\"loadInstance('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' id2 ='"+data[i].id+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
                }
                $("#regionList_instance").empty().append(str);
                $("#toolbar_instance").show();
                $("#widget-grid").show();
                $("#toolbar_not_open_instance").show();
                $("#widget-not-open-grid").show();
                loadInstance(data[0].regionUuid);//加载第一个
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });
}
//切换地域云主机
function loadInstance(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");

    beforeTableLoad("instance_tab_ul","instance_tab");
    loadInstanceData(id);

    var params_not_open ={
        "url":"/action/instance/findNotOpenInstanceList",
        "data":{"region":id}
    };
    //获取未开通云主机列表
    loadInstanceNotOpenData(params_not_open);

    var params_failed={
        "url":"/action/instance/findFailedInstanceList",
        "data":{"region":id}
    };

    //获取创建失败云主机列表
    loadInstanceFailedData(params_failed);

}

//刷新
function refreshInstance(){
    loadInstanceData($("#regionList_instance .btn-primary").attr('id'));
}


//刷新待开通列表
function refreshInstanceNotOpen(){
    var id = $("#regionList_instance .btn-primary").attr('id');
    var params_not_open ={
        "url":"/action/instance/findNotOpenInstanceList",
        "data":{"region":id}
    };
    //获取未开通云主机列表
    loadInstanceNotOpenData(params_not_open);

}

//刷新创建失败列表
function refreshInstanceFailed(){
    var id = $("#regionList_instance .btn-primary").attr('id');
    var params_failed ={
        "url":"/action/instance/findFailedInstanceList",
        "data":{"region":id}
    };
    //获取未开通云主机列表
    loadInstanceFailedData(params_failed);

}

//设置下拉菜单列不可用
function setDisabled(obj){
    obj.addClass("disabled").addClass('btn').addClass("text-left");
}
//取消下拉菜单列不可用
function cancelDisabled(obj){
    obj.removeClass("disabled").removeClass('btn').removeClass("text-left");
}

//设置选中行赋值
var sel_row_id = "",
    sel_region_id="",
    public_ip = "",
    public_ip_id = "",
    node_ip = "",
    oTable = '',
    sel_row_ids = [],
    sel_row_cpu = "",
    sel_row_memory = "",
    all_data;
function setSelRowId(obj,id,status,publicIP,nodeIp,publicIpId,cpu,ram){

    sel_region_id = $("#regionList_instance .btn-primary").attr('id');

    //选中状态 并赋值
    if(obj.checked){
        $(obj).closest('tr').attr("select", "yes");
        $(obj).closest('tr').attr("id", id);
        $(obj).closest('tr').attr("status", status);
        $(obj).closest('tr').attr("publicIP", publicIP);
        $(obj).closest('tr').attr("publicIpId", publicIpId);
        $(obj).closest('tr').attr("nodeIp", nodeIp);
        $(obj).closest('tr').attr("cpu", cpu);
        $(obj).closest('tr').attr("ram", ram);

    }
    else{
        $(obj).closest('tr').attr("select", "no");
    }
    var selectedRow = $("#ins_table tr[select ='yes']");


    //多选时
    if(selectedRow.length>1){
        sel_row_ids.length=0;
        $("#configBtn").addClass("disabled");
        setDisabled($("#btn_dropdown a"));
        $("#btn_start,#btn_vnc,#btn_ins_monitor,#btn_close,#btn_reboot,#btn_reconstruct,#btn_delete").addClass('disabled');

        var allStatus = [];//获取所有状态
        for(var i=0;i<selectedRow.length;i++){
            var id = selectedRow[i].attributes[2].value;
            var status = selectedRow[i].attributes[3].value;

            //存储状态
            allStatus.push(status);
            sel_row_ids.push(id);

        }

        var tmp = []; //一个新的临时数组
        for (var i = 0; i < allStatus.length; i++) //遍历当前数组
        {
            if (tmp.indexOf(allStatus[i]) == -1) tmp.push(allStatus[i]);
        }

        //所选状态不统一
        if(tmp.length!=1){
            return;
        }
        //根据统一状态判断
        var  status = tmp[0];
        if(status=="SHUTOFF" || status=="ERROR" ){
            $("#btn_start,#btn_delete").removeClass('disabled');
        }else if(status=="ACTIVE"){
            $("#btn_close").removeClass('disabled');
        }else{
            $("#btn_start,#btn_delete,#btn_close").addClass('disabled');
        }

    }

    else if(selectedRow.length==1){//单选时

        sel_row_id = $(selectedRow[0]).attr("id");
        status = $(selectedRow[0]).attr("status");
        public_ip = $(selectedRow[0]).attr("publicip");
        public_ip_id = $(selectedRow[0]).attr("publicipid");
        node_ip = $(selectedRow[0]).attr("nodeip");
        sel_row_cpu = $(selectedRow[0]).attr("nodeip");
        sel_row_memory = $(selectedRow[0]).attr("ram");
        all_data = oTable.fnGetData(obj.parent);


        if(sel_row_ids.length==2){
            sel_row_ids.length=0;
            sel_row_ids.push(sel_row_id);
        }
        $("#configBtn,#btn_change_bandwidth").removeClass("disabled");
        cancelDisabled($("#btn_create_snap_show,#btn_ins_rollback_show,#btn_allocate,#btn_getPassword," +
            "#btn_release_show,#btn_rebuild_show,#btn_resetPassword,#btn_upgrade_instance,#btn_release"));//对有权限的按钮取消禁用状态；
        $("#btn_start,#btn_vnc,#btn_ins_monitor,#btn_close,#btn_reboot,#btn_reconstruct,#btn_delete,#btn_live_migrate").removeClass('disabled');
        //setDisabled($("#btn_dropdown a"));

        if(status=="SHUTOFF"){
            $("#btn_ins_monitor,#btn_reconstruct").addClass("disabled");
            $("#btn_start,#btn_delete").removeClass('disabled');
            $("#btn_vnc,#btn_close").addClass('disabled');
            $("#btn_reboot").addClass('disabled');
            setDisabled($("#btn_resetPassword"));
            setDisabled($("#btn_live_migrate"));
            cancelDisabled($("#btn_ins_rollback_show"));
        }else if(status == "ACTIVE"){
            $("#btn_start,#btn_delete,#btn_reconstruct").addClass('disabled');
            $("#btn_ins_monitor").removeClass("disabled");
            $("#btn_close,#btn_vnc").removeClass('disabled');
            cancelDisabled($("#btn_live_migrate"));
            setDisabled($("#btn_ins_rollback_show"));

        }else if(status == "ERROR"){
            $("#btn_ins_monitor").addClass("disabled");
            $("#btn_reconstruct,#btn_delete").remove("disabled");
            setDisabled($("#btn_create_snap_show"));
            setDisabled($("#btn_resetPassword"));
            setDisabled($("#btn_live_migrate"));
            setDisabled($("#btn_ins_rollback_show"));
            //$("#btn_start").removeClass('disabled');
        }else if(status == "UNKNOWN"){
            $("#btn_ins_monitor").addClass("disabled");
            $("#btn_start,#btn_reconstruct,#btn_delete").removeClass('disabled');
            setDisabled($("#btn_live_migrate"));
            setDisabled($("#btn_ins_rollback_show"));
        }else if(status == "REBUILD"){
            setDisabled($("#btn_resetPassword"));
            $("#btn_reconstruct,#btn_delete").addClass('disabled');
            setDisabled($("#btn_live_migrate"));
            setDisabled($("#btn_ins_rollback_show"));
        }else if(status == "Refunded"){
            $("#btn_start,#btn_reboot,#btn_vnc,#btn_ins_monitor,#btn_reconstruct,#btn_live_migrate").addClass('disabled');
            setDisabled($("#btn_dropdown a"));
            $("#btn_close,#btn_delete").remove("disabled");
        }else{
            $("#btn_start,#btn_close,#btn_reboot,#btn_vnc,#btn_ins_monitor,#btn_reconstruct,#btn_live_migrate").addClass('disabled');
            setDisabled($("#btn_dropdown a"));
        }

        if((public_ip==""||public_ip==null||public_ip=="null") && (status == "ACTIVE")){
            setDisabled($("#btn_release"));
            cancelDisabled($("#btn_allocate"));
        }else if(public_ip){
            cancelDisabled($("#btn_release"));
            setDisabled($("#btn_allocate"));
        }else{
            $("#btn_release,#btn_allocate").addClass("disabled btn text-left");
        }

        setDisabled($("#btn_config_firewall"));
        if(public_ip != ""&& public_ip!="无"&&public_ip!=null){
            cancelDisabled($("#btn_config_firewall"));
        }
    }else{
        //do nothing
    }
    if(selectedRow.length==0){//不选
        sel_row_id = "";
        public_ip = "";
        public_ip_id = "";
        sel_row_cpu = "";
        sel_row_memory = "";
        node_ip = "";
        all_data = null;
        sel_row_ids.length=0;
        $("#configBtn,#btn_start,#btn_close,#btn_reboot,#btn_vnc,#btn_ins_monitor,#btn_delete,#btn_reconstruct,#btn_live_migrate").addClass('disabled');
        setDisabled($("#btn_dropdown a"));
    }
}

/**
 * 加载云主机数据
 */

function initBtnStatus(){
    $("#btn_start,#btn_close,#btn_vnc,#btn_ins_monitor,#btn_reboot,#btn_allocate,#btn_release,#btn_delete,#btn_reconstruct,#btn_live_migrate").addClass('disabled');
    setDisabled($("#btn_dropdown a"));
    all_data = null;
    sel_row_id = "";
    sel_region_id = "";
}

function loadInstanceData(regionId){
    initBtnStatus();
    $("#instances_list_table").empty().append("<table id='ins_table' class='table table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='ins_thead' class='talign_c'></thead><tbody id='ins_tbody'></tbody></table>");
    $("#ins_thead").empty().append(
            "<tr><th></th>"+
            "<th class='talign_c'>"+rpL("instance_name")+"</th>"+
            "<th class='talign_c'>"+rpL("instance_number")+"</th>"+
            "<th class='talign_c'>"+rpL("users_belong")+"</th>"+
            "<th class='talign_c'>"+rpL("status")+"</th>"+
            "<th class='talign_c'>"+rpL("configure")+"</th>"+
            "<th class='talign_c'>"+rpL("IP_address")+"</th>"+
            "<th class='talign_c'>"+rpL("image")+"</th>"+
            "<th class='talign_c'>"+rpL("end_time")+"</th>"+
            "<th class='talign_c'>"+rpL("remaining_time")+"</th>"+
            "</tr>");
    var  loadStr="<tr class='odd'><td  class='text-center' valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>";
    $("#ins_tbody").empty().append(loadStr);
    initInstanceTable(regionId);
}
function initInstanceTable(regionId){
    oTable =  $("#ins_table").dataTable({
        "bDestroy":true,
        "bRetrieve":true,
        "bAutoWidth": true,
        "bServerSide": true,
        "sAjaxDataProp":"data",
        "sPaginationType" : "bootstrap_full",
        'bSort':false,
        "sRowSelect": "single",
        "sAjaxSource": "/action/instance/findInstancePage",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var pageSize = oSettings._iDisplayLength,
                pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;

            var params = {"regionId":regionId,pageNo:pageNo,pageSize:pageSize};
            oSettings.qXHRj = doPost(sSource,params,fnCallback);
        },
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ],
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {

        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str="",
                color_status= (aData.status=="ExpireClose")?"'console-red'":"",
                lasttime =parseInt(aData.remainingTime),
                isExpiredStr = "",
                isExpiredStatus = "";
            if(lasttime>0){
                var time= parseInt(lasttime/(24*3600*1000));
                if(time>30){
                    isExpiredStatus="console-green'";
                }else if(time>3){
                    isExpiredStatus="console-orange'";
                }else{
                    isExpiredStatus="console-red'";
                }
                isExpiredStr=time +"天后到期";
            }else if(lasttime==0){
                isExpiredStr = "--";
                isExpiredStatus="'";
            }
            else{
                isExpiredStr ="已经到期";
                isExpiredStatus="console-red'";
            }
            var endTime = "--";
            if(aData.endTime){
                endTime = new Date(aData.endTime).Format("yyyy-MM-dd hh:mm:ss");
            }
            var expiredTime = (aData.endTime==null||aData.endTime==""||aData.endTime==0)?"--":endTime;
            var apply="";
            if(aData.isApply=="1"){
                apply="(测)"
            }
            var modifyHostNameContent = '<span id="modify_name'+aData.instance_id+'">' +
                '<span style="margin-left: 5px;" id="hostname_span'+aData.instance_id+'">'+convertStr(aData.displayName,"--") +'</span>&nbsp;' +
                '<a style="cursor:pointer;" title="可编辑" class="" onclick="showModify(\''+aData.instance_id+'\')"><i class="fa fa-pencil"></i></a>' +
                '</span>' +
                '<snap id="modify_input'+aData.instance_id+'" style="display:none;">'+
                '<input id="modify_host_name'+aData.instance_id+'" class="text-input" type="text" value="'+convertStr(aData.displayName)+'"/>' +
                '<a id="btn_modify_name'+aData.instance_id+'" style="text-align: center;cursor:pointer;color:#3276b1;" onclick="modifyName(\''+aData.instance_id+'\')"><i class="fa fa-check-square-o text-fa" ></i></a>' +
                '</span>';

            str +=
                "<td><label class='checkbox'><input type='checkbox' name='cbx_list' " +
                "onclick=\"setSelRowId(this,'" + aData.instance_id + "','" + aData.status + "','" + aData.public_ip+ "','" + aData.nodeIp+"','" + aData.publicIpId+"','" +aData.cpu +"','" +aData.ram +"')\"><i></i></label></td>" +
                    "<td class='text-center'>" + modifyHostNameContent + "</td>" +
                    "<td class='text-center'>" +apply+ aData.hostname + "</td>" +
                "<td class='text-center'>" + convertStrToLine(aData.user) + "</td>" +
                "<td class="+color_status+"' text-center'>" + formatInsStatus(aData.status)+ "</td>" +
                "<td class='text-center'>" +
                    aData.cpu+"核"+ "&nbsp"+
                    aData.ram+"GB"+ "<br>"+
                    convertStrToLine(aData.bandWidth)+"Mbps"+
                "</td>" +
                "<td class='text-center'>" +
                "内："+ aData.inner_ip + "<br>"+
                "外："+ convertStrToLine(aData.public_ip)+ "</td>" +
                "<td class='text-center'>" + aData.image + "</td>" +
                "<td class='text-center'>" +  expiredTime +"</td>" +
                "<td class='text-center "+isExpiredStatus+"'>" + isExpiredStr+"</td>";

            $(nRow).empty().append(str);
            $(nRow).bind("dblclick",{"instanceId":aData.instance_id,"status":aData.status,"regionId":regionId,callback:setDetailModal},showDetail);
        },
        "oLanguage": {
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {"sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            },
            "sFilterPlace":"请输入关键词",
            "sZeroRecords": "没有检索到数据",
            "sProcessing": "<img src='./loading.gif'/>"
        }

    });
}
/**
 * 显示修改云主机名称
 * @param id
 */
var modifyId = '';
function showModify(id){
    $("#modify_name"+id).hide();
    $("#modify_input"+id).show();
    modifyId = id;
}
document.onkeydown=keyDownSearch;

function keyDownSearch(e) {
    // 兼容FF和IE和Opera

    var theEvent = e || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    var target = theEvent.target;
    if (code == 13) {
        console.log(modifyId);

        if(modifyId != ''){
            console.log(modifyId);
            $("#modify_input"+modifyId).find("a").trigger("click");
        } else{

        }
        return false;
    }
    return true;
}

function modifyName(id){

    var name = $("#modify_host_name"+id).val();
    if(name == ""){
        $("#modify_host_name"+id).focus();
        return;
    }

    $("#btn_modify_name"+id).addClass('disabled');

    if(modifyInstanceName(id,name) ){
        $("#hostname_span"+id).html(name);
        $("#modify_name"+id).show();
        $("#modify_input"+id).hide();
        modifyId = '';
    }else{
        $("#btn_modify_name"+id).removeClass('disabled');
    }

}
/**
 * 修改云主机名称
 * @param id
 */
function modifyInstanceName(id,name){
    var result = false;
    doPost("/action/instance/modifyDisplayName", {"instanceId":id,"name":name}, function (objs){
        if (objs.httpCode == "200"&&objs.code=="Success") {
            result =  true;

        }else{
            showErrorMsg(rpL(objs.data.code), "修改云主机名称失败。");
        }
    },"",false);
    return result;
}

/**
 * 启动云主机
 */
function startIns(){
    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    //批量处理
    if(sel_row_ids!=null&&sel_row_ids.length>=2){
        showConfirm("fa-play", "启动云主机", "是否要启动这"+sel_row_ids.length+"台云主机?", function () {
            showConsoleMsgs("操作成功", "准备启动...", function (obj) {
                doPost("/action/instance/startInstanceBatch", {"resourceId":sel_row_ids.join(","),"regionId":sel_region_id}, function (objs){
                    if (objs.httpCode == "200"&&objs.data==true) {
                        showMsg("操作成功", "成功启动"+sel_row_ids.length+"台云主机。");
                        refreshInstance();
                    } else {
                        showErrorMsg("", "启动云主机失败。");
                    }
                });
            });
        });

    }
    //单台
    else {
        showConfirm("fa-play", "启动云主机", "是否要启动该云主机?", function () {
            $("#btn_start").addClass('disabled');
            showMsgs("操作成功", "准备启动...", function (obj) {
                doPost("/action/instance/startInstance", {"instanceId":sel_row_id,"regionId":sel_region_id}, function (objs){

                    if (objs.httpCode == "200"&&objs.code=="Success") {
                        if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                            showMsg("操作成功", "成功启动云主机。");
                            refreshInstance();
                        }else{
                            showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                        }
                    } else {
                        $("#btn_start").removeClass('disabled');
                        console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                        showErrorMsg(rpL(objs.data.code), "启动云主机失败。");
                    }
                });
            },100);
        });
    }

}

/**
 * 关闭云主机
 */
function closeIns(){
    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    if(sel_row_ids!=null&&sel_row_ids.length>=2){

        showConfirm("fa-stop", "关闭云主机", "是否要关闭这"+sel_row_ids.length+"台云主机?", function () {
            showConsoleMsgs("操作成功", "关闭中...", function (obj) {
                doPost("/action/instance/stopInstanceBatch",{"resourceId":sel_row_ids.join(","),"regionId":sel_region_id}, function (objs){
                    if (objs.httpCode == "200"&&objs.data==true) {
                        console.log(objs.data);
                        showMsg("操作成功", "成功关闭"+sel_row_ids.length+"台云主机。");
                        refreshInstance();
                    } else {
                        showErrorMsg("", "关闭云主机失败。");
                    }
                });
            });
        });
    }
    else{
        showConfirm("fa-stop", "关闭云主机", "是否要关闭该云主机?", function () {
            $("#btn_close").addClass('disabled');
            showMsgs("操作成功", "关闭中...", function (obj) {
                doPost("/action/instance/stopInstance",{"instanceId":sel_row_id,"regionId":sel_region_id}, function (objs){

                    if (objs.httpCode == "200"&&objs.code=="Success") {
                        if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                            showMsg("操作成功", "成功关闭云主机。");
                            refreshInstance();
                        }else{
                            showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                        }
                    } else {
                        $("#btn_close").removeClass('disabled');
                        console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                        showErrorMsg(rpL(objs.data.code), "关闭云主机失败。");
                    }
                });
            },100);
        });
    }
}

/**
 * 重启云主机
 */
function rebootIns(){
    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    showConfirm("fa-stop", "重启云主机", "是否要重启该云主机?", function () {
        $("#btn_reboot").addClass('disabled');
        showMsgs("操作成功", "重启中...", function () {
            doPost("/action/instance/rebootInstance",{"instanceId":sel_row_id,"regionId":sel_region_id}, function (objs){
                
                if (objs.httpCode == "200"&&objs.code=="Success") {
                    if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                        showMsg("操作成功", "成功重启云主机。");
                        refreshInstance();
                    }else{
                        showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                    }
                } else {
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                    showErrorMsg(rpL(objs.data.code), "重启云主机失败。");
                    $("#btn_reboot").removeClass('disabled');
                }
            });
        },100);
    });
}


/**
 * vnc 控制台
 */
function vncConsole() {
    if (all_data == null) {
        showErrorMsg("", "请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    showMsgs("操作成功", "WebVNC...", function (obj) {
        doPost("/action/instance/vncConsole",{"instanceId":sel_row_id,"regionId":sel_region_id},function (objs) {
            
            if (objs.httpCode == "200") {
                window.open(objs.data,"newwindow","height=500,width=800,top=100,left=200");

            } else {
                showErrorMsg(rpL(objs.data.code), "远程连接云主机失败。");
                console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            }
        });
    },100);
}

/**
 * 重装操作系统
 */
function rebuild(){
    var image_id = $("#rebuild_ins_images").val();
    if(image_id==""){
        showErrorMsg("","请选择镜像。");
        return ;
    }

    $("#btn_confirm").addClass('disabled');
    $('#reset_instance_modal').modal("hide");
    showMsg("操作成功", "重装系统中...");
    doPost("/action/instance/rebuildInstance", {"instanceId":sel_row_id,"regionId":sel_region_id,"imageId":image_id}, function (objs) {
        $("#btn_confirm").removeClass('disabled');
        if (objs.httpCode == "200"&&objs.code=="Success") {
            clearForm("reset_instance");
            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                showMsg("操作成功", "成功重装系统云主机，请重置密码后进行登录使用。",8000);
                refreshInstance();
            }else{
                showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
            }
        } else {
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            showErrorMsg(rpL(objs.data.code), "重装系统云主机失败。");
        }
    });
}


//按用户显示快照列表

function rollback_snapshot_list_onchange(){
    var currentUser = $("#rollback_ins_list").val();

    if(currentUser==null||currentUser=="") return;
    var params={
        "url":"/action/snapshot/findUserSnapshotList",
        "data":{"user":currentUser}
    };

    //openSnapshotList(params);
}

function roolbackInsSnapshotList(){
    clearForm("reset_instance");

    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    $("#btn_confirm").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');

    clearForm("reset_instance");
    var snap_ins= document.getElementById("rollback_ins_snap").options;
    clearOptions(snap_ins);
    doPost("/action/snapshot/findSnapshotList",{"instanceId":sel_row_id,"regionId":sel_region_id},function (objs){
        if(objs.httpCode=="200"&&objs.code=="Success"){
            if(objs.data!=null&&objs.data.snapshot_list.length>0){
                addOption(snap_ins,"---请选择---","");

                for(var i=0;i<objs.data.snapshot_list.length;i++){
                    addOption(snap_ins,objs.data.snapshot_list[i].name,objs.data.snapshot_list[i].snapshotId);
                }
                $("#btn_ins_oper").val("ins_rollback");
                $("#ins_oper_modal_label").text("从快照回滚");
                $("#rollback_snap_div_modal").show();
                $("#rebuild_div_modal , #release_div_modal , #create_snap_div_modal").hide();
                disableRightKey();
                $('#reset_instance_modal').modal("show");
            }else{
                showErrorMsg("", "该主机当前无快照");
            }
        }else{
            showErrorMsg(rpL(objs.data.code),"获取快照列表失败。");
        }
    });
}


/**
 * 从快照回滚
 */
function rollbackInsSnap(){
    var snapshotId = $("#rollback_ins_snap").val();
    if(snapshotId==""||snapshotId==null){
        showErrorMsg("","请先选择快照。");
        return;
    }
    setDisabled($("#btn_confirm"));
    showMsg("操作成功", "快照回滚中...");
    $('#reset_instance_modal').modal("hide");
    doPost("/action/snapshot/rollbackSnapshot", {"instanceId":sel_row_id,"snapshotId":snapshotId}, function (objs) {
        if (objs.httpCode == "200") {
            if((objs.data.code==null||objs.data.code=="")){
                if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                    showMsg("操作成功", "成功回滚快照。");
                    refreshInstance();
                }else{
                    showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                }
            }
            else{
                showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            }
        } else {
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            showErrorMsg(rpL(objs.data.code), "回滚快照失败。");
        }
        cancelDisabled($("#btn_confirm"));
    });
}


/**
 * 初始化镜像
 */
function initImages(id){
    id = (id==null || id=="")?"ins_images":id;
    var images = document.getElementById(id).options;
    clearOptions(images);
    addOption(images, "---正在加载中---", "");
    doPost("/action/image/findImageList", {"regionId":sel_region_id}, function (objs) {
        if (objs.httpCode == "200") {
            clearOptions(images);
            if (objs.data.length > 0) {
                addOption(images, "---请选择---", "");
                for (var i = 0; i < objs.data.length; i++) {
                    if(objs.data[i].stable.toString()=="true") {
                        addOption(images, objs.data[i].name, objs.data[i].imageUuid);
                    }
                }
            } else {
                addOption(images, "---当前无镜像---", "");
            }

        } else {
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            showErrorMsg(rpL(objs.data.code), "获取镜像列表失败。");
        }
    });
}

/**
 * 下来列表选中”确定”按钮可用
 */

function changeREBImage(){
    var ins_images=$("#rebuild_ins_images").val();
    if(null==ins_images||""==ins_images){
        $("#btn_confirm").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }else{
        $("#btn_confirm").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }

}

function confirm_rebulid(){
    var oper = $("#btn_ins_oper").val();
    if(oper=="rebuild"){
        rebuild();
        return;
    }
    if(oper=="ins_rollback"){
        rollbackInsSnap();
    }
}



/**
 * 打开创建快照
 */

function create_snap_show(){
    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }

    $("#create_ins_snap_name").val("");
    $("#ins_snap_remark").val("");
    $("#create_snap_div_modal").show();
    $("#rebuild_div_modal, #release_div_modal , #rollback_snap_div_modal").hide();
    disableRightKey();
    $("#ins_snap_modal").modal("show");
}


/**
 * 创建快照
 */


function createInsSnap(){
    var name = $("#create_ins_snap_name").val();
    if(name==""){
        showErrorMsg("","快照名称不能为空。");
        return;
    }
    $("#ins_snap_modal").modal('hide');
    showMsg("操作成功", "创建快照中，稍后可点击左侧导航“主机快照”进行查看。");
    doPost("/action/snapshot/createSnapshot", {"instanceId":sel_row_id,"name":name,"regionId":sel_region_id}, function (objs) {
        if (objs.httpCode == "200"&objs.code=="Success") {
            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                showMsg("操作成功", "正在创建快照。");
                loadInstanceData(sel_region_id);
            }else{
                showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
            }
        } else {showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            showErrorMsg(rpL(objs.data.code), "创建快照失败。");
        }
    });
}
/**
 * check 快照名成是否为空
 */
function checkSnapName(){
    var value=$("#create_ins_snap_name").val();
    if(convertStr(value)==""){
        $("#btn_snap_confirm").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }
    else{
        $("#btn_snap_confirm").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }
}


/**
 * 获取云主机详情
 */
/*function showDetail(data){
    var instanceId = data.data.instanceId,
        regionId = data.data.regionId;

    if(instanceId==null || instanceId==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }

    doPost("/action/instance/findInstanceDetail", {"instanceId":instanceId,"regionId":regionId}, function (objs) {
        if (objs.httpCode == "200"&&objs.code=="Success") {
            $("#d_hostname").html(objs.data.instance_model.displayName);
            $("#dhostname").html(objs.data.instance_model.hostname);
            $("#d_cpu").html(objs.data.instance_model.cpu + "核");
            $("#d_memory").html(parseInt(objs.data.instance_model.ram) + "GB");
            $("#d_disk").html(objs.data.instance_model.disk + "个");
            $("#d_public_ip").html(objs.data.instance_model.public_ip);
            $("#d_inner_ip").html(objs.data.instance_model.inner_ip);
            $("#d_image").html(objs.data.instance_model.image);
            $("#d_node").html(objs.data.instance_model.node);
            if(objs.data.instance_model.status=="ExpireClose"){
                var statusStr = "<span class='console-red'>ExpireClose</span>";
            }else{
                statusStr = objs.data.instance_model.status;
            }
            $("#d_status").html(rpL(statusStr));
            $("#d_create_time").html(objs.data.instance_model.create_time);
            $("#d_expried_time").html(new Date(objs.data.instance_model.endTime).Format("yyyy-MM-dd hh:mm:ss"));
            disableRightKey();
            $("#ins_detail_modal").modal("show");
        } else {
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            showErrorMsg(rpL(objs.data.code), "获取云主机信息失败。");
        }
    });
}*/


function showDetail(data){
    var instanceId = data.data.instanceId,
        status = data.data.status,
        regionId = data.data.regionId,
        callback = data.data.callback;

    if(instanceId==null || instanceId==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    if(status=="NotOpen"){
        showErrorMsg("","云主机处在待开通状态，不能查看详情。");
        return;
    }
    $("#d_status").removeClass("console-red");
    doPost("/action/instance/findInstanceDetail", {"instanceId":instanceId,"regionId":regionId}, function (objs) {
        if (objs.httpCode == "200"&&objs.code=="Success") {
            if(objs.data.instance_model !== null){
                if(callback){
                    callback(objs.data);
                }
            }else{
                showErrorMsg("", "获取云主机信息失败。");
            }

        } else {
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg(rpL(objs.code), "获取云主机信息失败。");
        }
    });
}


function setDetailModal(data){
    $("#d_hostname").html(data.instance_model.displayName);
    $("#dhostname").html(data.instance_model.hostname);
    $("#d_cpu").html(data.instance_model.cpu + "核");
    $("#d_memory").html(parseInt(data.instance_model.ram) + "GB");
    $("#d_disk").html(data.instance_model.disk + "个");
    $("#d_public_ip").html(data.instance_model.public_ip);
    $("#d_inner_ip").html(data.instance_model.inner_ip);
    $("#d_image").html(data.instance_model.image);
    $("#d_node").html(data.instance_model.node);
    if(data.instance_model.status=="ExpireClose"){
        var statusStr = "<span class='console-red'>ExpireClose</span>";
    }else{
        statusStr = data.instance_model.status;
    }
    $("#d_status").html(rpL(statusStr));
    $("#d_create_time").html(data.instance_model.create_time);
    $("#d_expried_time").html(new Date(data.instance_model.endTime).Format("yyyy-MM-dd hh:mm:ss"));
    disableRightKey();
    $("#ins_detail_modal").modal("show");
    modifyIdBydetail = "";
}

/**
 * 重置云主机密码
 */
var flag = false;
function resetPassWord(){
    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("提示","云主机ID不能为空。");
        return;
    }

    showConfirm("fa-trash-o", "重置密码", "<font color='red'></font>新密码在实例重启后生效，确定是否要重置云主机登录密码?", function () {
        setDisabled($("#btn_resetPassword"));
        $("#ins_resetPW_modal").modal('hide');
        showMsgs("操作成功", "密码重置中...", function () {
            doPost("/action/instance/resetInstancePassword", {"instanceId":sel_row_id ,"regionId":sel_region_id}, function (objs) {
                if (objs.httpCode == "200"&&objs.data!=null&&objs.data!="") {
                    $("#newPasswordLabel").text(objs.data);
                    $("#copyPwdBtn").attr("data-clipboard-text",objs.data);
                    if(!flag){
                        copyToClipBoardInit("copyPwdBtn");
                        flag = true;
                    }
                    $("#resetPasswordModal").modal("show");
                    cancelDisabled($("#btn_resetPassword"));
                    $("#resetPasswordModal").on('hidden.bs.modal',function(){
                        showConfirm("fa-stop", "重启云主机", "需要重启云主机才能生效，是否立刻重启该云主机?", function (obj) {
                            doPost("/action/instance/rebootInstance",{"instanceId":sel_row_id,"regionId":sel_region_id}, function (objs){
                                obj.remove();
                                if (objs.httpCode == "200"&&objs.code=="Success") {
                                    if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                                        showMsg("操作成功", "成功重启云主机。");
                                        loadInstanceData(sel_region_id);
                                    }else{
                                        showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                                    }
                                } else {
                                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                                    showErrorMsg(rpL(objs.data.code), "重启云主机失败。");
                                    $("#btn_reboot").removeClass('disabled');
                                }
                            });
                        });
                    });
                } else {
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                    showErrorMsg(rpL(objs.data.code), "云主机密码重置失败。");
                }
            });
        },100);
    });
}

/**
 * 分配公网IP
 */
function allocate_public_ip(){
    if(all_data==null){
        showErrorMsg("","请选中一行");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空");
        return;
    }
    showConfirm("fa-play", "分配公网IP", "是否为该云主机分配公网IP?", function () {
        $("#btn_destroy").addClass('disabled');
        showMsgs("操作成功", "正在分配公网IP...", function () {
            doPost("/action/instance/allocatePublicIp", {"instanceId":sel_row_id,"regionId":sel_region_id,"publicIpId":public_ip_id,"bandWidth":0}, function (objs){
                if (objs.httpCode == "200") {
                    if(objs.data.httpCode == "200" && objs.data.code=="Success") {
                        showMsg("操作成功", "分配公网IP成功");
                        refreshInstance();
                    }
                    else{
                        $("#btn_allocate").removeClass('disabled');
                        showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                        console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                    }
                } else {
                    $("#btn_allocate").removeClass('disabled');
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                    showErrorMsg(rpL(objs.data.code), "为云主机分配公网IP失败。");
                }
            });
        },100);
    });

}


/**
 * 释放公网IP
 */
function release_public_ip(){
    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    showConfirm("fa-play", "释放公网IP", "是否释放该云主机公网IP?", function () {
        $("#btn_release").addClass('disabled');
        $('#ins_release_publicIp_modal').modal("hide");
        showMsgs("操作成功", "正在释放公网IP...", function (obj) {
            doPost("/action/instance/releasePublicIp", {"instanceId":sel_row_id,"regionId":sel_region_id,"publicIpId":public_ip_id}, function (objs){
                if (objs.httpCode == "200") {
                    if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                        showMsg("操作成功", "成功释放该云主机公网IP。");
                        refreshInstance();
                    }
                    else{
                        $("#btn_release").removeClass('disabled');
                        showErrorMsg(rpL(objs.data.code), rpL(objs.data.message));
                        console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                    }
                } else {
                    $("#btn_release").removeClass('disabled');
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                    showErrorMsg(rpL(objs.data.code), "释放该云主机公网IP失败。");
                }
            });
        },100);
    });

}
//初始化系统配置
function init_upgrate_ins(){
    clearForm("ins-upgrade-wizard-1");
    $("#upgrade_ins_cpu").val(sel_row_cpu);
    $("#upgrade_ins_memory").val(sel_row_memory * 1024);
    selectConfigration();
    $("#ins_upgrade_modal").modal("show");
    initUpgradeModalValue();
}

//升级配置
function upgrade_instance(){

    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }

    var cpu = $("#upgrade_ins_cpu").val(),
        ram = $("#upgrade_ins_memory").val();

    if(sel_row_cpu==cpu && sel_row_memory == (ram / 1024)){
        showErrorMsg("","配置没有更改，无需升级");
        return;
    }

    $("#ins_upgrade_modal").modal("hide");

    doPost("/action/instance/resizeInstance", {"instanceId":sel_row_id,"cpu":cpu,"ram":ram,"regionId":sel_region_id}, function (objs){
        if (objs.httpCode == "200") {
            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                showMsg("操作成功", "升级云主机配置成功，请稍后查看。");
                refreshInstance();
            }
            else{
                if(objs.data.code == "Resource.NotFound" && objs.data.message.indexOf("Vm") >= 0){
                    showErrorMsg(rpL(objs.data.code), rpL("云主机不存在"));
                }else{
                    showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                }
            }
        } else {
            showErrorMsg(rpL(objs.data.code), "升级云主机配置失败。");
        }
    });
}


//初始化升级modal界面上的元素；
function initUpgradeModalValue(){
    $('.memory-upgrade').addClass('memory').removeClass('memory-upgrade');
    $('.cpu-upgrade').addClass('cpu').removeClass('cpu-upgrade');
    $(".option.cpu").removeClass("disabled").removeClass('no-span').removeClass('current');
    $(".option.memory").removeClass("disabled").removeClass('no-span').removeClass('current');

    $('.option.memory').each(function(){
        $(this).addClass("btn-span");
        if($(this).attr('data-value') < Number(sel_row_memory * 1024)){
            $(this).removeClass("btn-span").addClass('disabled');
        }
    });
    $('.option.cpu').each(function(){
        $(this).addClass("btn-span");
        if($(this).attr('data-value') < Number(sel_row_cpu)){
            $(this).removeClass("btn-span").addClass('disabled');
        }
    });

    $(".option.memory[data-value='"+sel_row_memory * 1024+"']").removeClass("btn-span").addClass('current');
    $(".option.cpu[data-value="+sel_row_cpu+"]").removeClass("btn-span").addClass('current');

}
function selectConfigration(){
    $(".option.memory").click(function(){
        if(!($(this).hasClass("disabled"))){
            $(this).removeClass("btn-span").addClass("current").siblings()
                .addClass("btn-span").removeClass("current");
            var memory = $(this).attr("data-value");
            $("#ins_memory").val(memory);
            $("#upgrade_ins_memory").val(memory);
        }
    });
    $(".option.cpu").click(function(){
        if(!($(this).hasClass("disabled"))){
            $(this).removeClass("btn-span").addClass("current").siblings()
                .addClass("btn-span").removeClass("current");
            var cpu = $(this).attr("data-value");
            $("#ins_cpu").val(cpu);
            $("#upgrade_ins_cpu").val(cpu);
        }
    });
}
function getInstanceBandwidth(_this){

    if(_this != undefined){
        sel_row_id  = $("#instanceDetail_id").val();
        $("#ins_detail_modal").modal("hide");
    }

    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    var data = {
        data:{
           instanceId :sel_row_id,
           status :"",
            regionId :$("#regionList_instance a.btn-primary").attr("id"),
           callback :setBandwidthChangeModal
        }
    };

    showDetail(data);
}

var oBandwidthManager;
function setBandwidthChangeModal(data){

    var regionId = $("#regionList_instance a.btn-primary").attr("id2");


    doPost("/action/product/findProduct", {"billCycle": 1, regionId: regionId}, function (datas) {
        if (datas.httpCode == "200") {
            if (datas.data.cpu == undefined || datas.data.cpu == null || datas.data.mem == null || datas.data.mem == undefined) {
                showErrorMsg("该地域下无可用带宽产品", "请联系系统管理员");
            } else {
                $("#ins_bandwidth_change_modal").modal("show");
                $("#ins_bandwidth_change_hostName").text(data.instance_model.hostname);
                $("#ins_bandwidth_change_region").text($("#regionList_instance").find("a.btn-primary").text());

                $("#ins_bandwidth_change_modal").on("shown.bs.modal",function(){
                    //初始化带宽slider
                    oBandwidthManager = initBandwidthSlider("uc-band","uc-band-value");
                    var unitArray = oBandwidthManager.initPage(datas.data['bandwidth']);

                    oBandwidthManager.init(unitArray,function(){});

                    $("#uc-band-value").val(data.instance_model.bandWidth).trigger("blur");
                });

            }
        } else {
            showErrorMsg("获取带宽产品信息失败", rpLRespond(datas.message));
        }

    });
}

function confirmChangeBandwidth(){
    var bandSize =  $("#uc-band-value").val();


    showMsg("操作成功","正在变更带宽...");

    doPost("/action/instance/changeBandwidth",
        {
            "instanceId":sel_row_id,
            "regionId":$("#regionList_instance a.btn-primary").attr("id"),
            "bandwidth":bandSize
        },
        function (objs) {
            if(objs.httpCode == "200"){
                showMsg("操作成功","带宽变更成功");
                $("#ins_bandwidth_change_modal").modal("hide");
            }else{
                showErrorMsg("变更失败",rpLRespond(objs.message));
            }
        }

    );
}

//重建
function reconstructIns(){

    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    showConfirm("fa-play", "重建云主机", "重建之后用户数据将丢失，是否重新创建云主机?", function () {
        $("#btn_reconstruct").addClass('disabled');
        showMsgs("操作成功", "正在重建云主机...", function (obj) {
            doPost("/action/instance/reconstructInstance", {"instanceId":sel_row_id,"regionId":sel_region_id}, function (objs){
                if (objs.httpCode == "200") {
                    if((objs.data.toString()=="true")) {
                        showMsg("操作成功", "重新创建云主机成功，请稍后查看列表。");
                        refreshInstance();
                    }
                    else{
                        $("#btn_reconstruct").removeClass('disabled');
                        showErrorMsg("创建失败", "系统异常");
                    }
                } else {
                    $("#btn_reconstruct").removeClass('disabled');
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                    showErrorMsg(rpL(objs.data.code), "重新创建云主机失败。");
                }
            });
        },100);
    });

}

/**
 * 删除
 */
function deleteIns(){

    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    //批量处理
    if(sel_row_ids!=null&&sel_row_ids.length>=2){
        showConfirm("fa-play", "删除云主机", "是否删除这"+sel_row_ids.length+"台云主机至回收站?", function () {
            showConsoleMsgs("操作成功", "正在删除云主机...", function (obj) {
                doPost("/action/instance/deleteInstanceBatch",{"resourceId":sel_row_ids.join(","),"regionId":sel_region_id}, function (objs){
                    if (objs.httpCode == "200"&&objs.data==true) {
                        showMsg("操作成功", "成功删除"+sel_row_ids.length+"台云主机。");
                        refreshInstance();
                    } else {
                        showErrorMsg("", "删除云主机失败。");
                    }
                });
            });
        });
    }else{
        showConfirm("fa-play", "删除云主机", "是否删除云主机?", function () {
            $("#btn_delete").addClass('disabled');
            showMsgs("操作成功", "正在删除云主机...", function () {
                doPost("/action/instance/deleteInstance", {"instanceId":sel_row_id,"regionId":sel_region_id}, function (objs){
                    if (objs.httpCode == "200"&&objs.code=="Success") {
                        if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                            showMsg("操作成功", "删除云主机成功。");
                            refreshInstance();
                        }else{
                            showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                        }
                    } else {
                        $("#btn_delete").removeClass('disabled');
                        console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                        showErrorMsg(rpL(objs.data.code), "删除云主机失败。");
                    }
                });
            },100);
        });
    }
}


/*
 防火墻模块
 */
var firewallRuleTable;
function firewallRulesLoad(){
    $("#firewall_rule_list_table").empty().append("<table id='firewall_rule_table' class='talign_c table table-responsive table-striped table-bordered table-hover smart-form has-tickbox'><thead id='firewall_rule_thead'></thead><tbody id='firewall_rule_tbody'></tbody></table>");
    $("#firewall_rule_thead").empty().append(
            "<tr><th class='talign_c' >"+rpL("源CIDR")+"</th>"+
            "<th class='talign_c' >"+rpL("协议")+"</th>"+
            "<th class='talign_c' >"+rpL("起始端口")+"</th>"+
            "<th class='talign_c' >"+rpL("结束端口")+"</th>"+
            "<th class='talign_c' >"+rpL("添加规则")+"</th>"+
            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='6' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#firewall_rule_tbody").empty().append(loadStr);
    runFirewallRuleDataTables(function(){
        firewallRuleTable = $("#firewall_rule_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 1, "asc" ]],
            "sRowSelect": "single",
            "oLanguage": {
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {"sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                // "sZeroRecords": "没有检索到数据",
                "sProcessing": "<img src='./loading.gif'/>"
            }
        });
        //useIpTableTrClick();
        $("#config_firewall_modal .dt-bottom-row .row .col-sm-6:first-Child").removeClass("col-sm-6").addClass("col-sm-5");
        $("#config_firewall_modal .dt-bottom-row .row .col-sm-6:last-Child").removeClass("col-sm-6").addClass("col-sm-7");
    });
}
function runFirewallRuleDataTables(callback) {

    doPost("/action/instance/findFirewallRulesList", {
        "regionId":sel_region_id,
        "ipaddressid":public_ip_id,
        "ipaddress":public_ip }, function (objs) {
        if (objs.data!=null&&objs.httpCode == "200"&&objs.code=="Success") {
            var firewallRuleList = objs.data.firewallRuleModels;
            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                var str = "";
                for (var i = 0; i < firewallRuleList.length; i++) {
                    if (firewallRuleList[i].protocol.toLowerCase() == 'icmp') {
                        firewallRuleList[i].startport = 'N/A';
                        firewallRuleList[i].endport = 'N/A';
                    }
                    str += "<tr id='" + firewallRuleList[i].fireWallId + "'>" +
                        "<td class='text-center'>" + firewallRuleList[i].cidrlist + "</td>" +
                        "<td class='text-center'>" + firewallRuleList[i].protocol.toUpperCase() + "</td>" +
                        "<td class='text-center'>" + firewallRuleList[i].startport + "</td>" +
                        "<td class='text-center'>" + firewallRuleList[i].endport + "</td>" +
                        "<td class='text-center'><button type='button' id='deleteRule' class='btn btn-default btn-primary' onclick='deleteFirewallRule(\"" + firewallRuleList[i].fireWallId + "\");' style='border:solid 1px #ccc;padding: 3px 6px;'>删除</button></td>" +
                        "</tr>";
                }
                str += "<tr id='appendRuleTr'><td class='text-center'><div class='form-group'><div class='controls'><input class='' type='text' style='border-color: #468847;border: 1px solid #ccc;' id='source_cidr' name='aSourceCIDR' onchange='validateCIDR();'></div></div></td>" +
                    "<td class='text-center'><select id='aProtocol' onchange='isAvailablePort();'><option value ='TCP'>TCP</option><option value ='UDP'>UDP</option><option value='ICMP'>ICMP</option></select></td>" +
                    "<td class='text-center'><input id='aStartPort' name='aStartPort' onchange='validatePort();'></td>" +
                    "<td class='text-center'><input id='aEndPort' name='aEndPort' onchange='validatePort();'></td>" +
                    "<td class='text-center'><button type='button' id='appendRule' class='btn btn-default txt-color-darken disabled' onclick='addFirewallRule()' style='border:solid 1px #ccc; padding: 3px 6px;'>添加</button></td></tr>";
            }else{
                showErrorMsg(rpL(objs.data.code), objs.data.message);
            }
            $("#firewall_rule_tbody").empty().append(str);
        } else {

            var loadStr = "<tr id='appendRuleTr'><td><div class='form-group'><div class='controls'><input class=''  type='text' style='border-color: #468847;border: 1px solid #ccc;' id='source_cidr' name='aSourceCIDR' onchange='validateCIDR();'></div></div></td>" +
                "<td class='text-center'><select id='aProtocol'  onchange='isAvailablePort();'><option value ='TCP'>TCP</option><option value ='UDP'>UDP</option><option value='ICMP'>ICMP</option></select></td>" +
                "<td class='text-center'><input id='aStartPort' name='aStartPort' onchange='validatePort();'></td>" +
                "<td class='text-center'><input id='aEndPort' name='aEndPort' onchange='validatePort();'></td>" +
                "<td class='text-center'><button type='button' id='appendRule' class='btn btn-default txt-color-darken disabled' onclick='addFirewallRule();' style='border:solid 1px #ccc; padding: 3px 6px;'>添加</button></td></tr>";
            // loadStr +="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='6' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
            $("#firewall_rule_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            return function () {
            };
        }

        $('#source_cidr').onpropertychange = function () {
            validateCIDR();
        };
        if (window.addEventListener) {
            document.getElementById("source_cidr").addEventListener('input', validateCIDR, false);
        }
        callback();
    });
}

function validateCIDR(){
    $("#source_cidr").removeClass('success').css('border', 'solid 1px #808080').css('color', '#808080');
    var vCIDR = $("#source_cidr").val();
    if(vCIDR.indexOf('/') > 0 && vCIDR.split('/')[1] != null && $.trim(vCIDR.split('/')[1]) !=""  && vCIDR.split('/')[1] != undefined){
        var vIP = vCIDR.split('/')[0];
        var vMask = vCIDR.split('/')[1];
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(vIP)) {
            $("#source_cidr").removeClass('success').addClass('error').css('border', 'solid 1px #b94a48').css('color', '#b94a48');
            showErrorMsg("请按CIDR规则填写值", "'/'前面的数值应该符合IP地址格式");
            return;
        }
        if (vMask == 0) {
            if (vIP !== ("0.0.0.0")) {
                $("#source_cidr").removeClass('success').addClass('error').css('border', 'solid 1px #b94a48').css('color', '#b94a48');
                showErrorMsg("请按CIDR规则填写值", "如果网络前缀为/0，那么前面的IP地址应为：0.0.0.0");
            } else {
                $("#source_cidr").removeClass('error').addClass('success').css('border', 'solid 1px #468847').css('color', '#468847');
            }
        }
        else if (vMask == 32) {
            $("#source_cidr").removeClass('error').addClass('success').css('border', 'solid 1px #468847').css('color', '#468847');
        }
        else if (reg.test(vIP) && vMask < 32 && vMask > 1) {
            var longIP = ip2long(vIP);
            var netMask = 0xffffffff << (32 - vMask);
            if ((longIP & ~netMask) == 0) {
                $("#source_cidr").removeClass('error').addClass('success').css('border', 'solid 1px #468847').css('color', '#468847');
            } else {
                $("#source_cidr").removeClass('success').addClass('error').css('border', 'solid 1px #b94a48').css('color', '#b94a48');
                showErrorMsg("请按CIDR规则填写值", "IP地址的后" + convertStr(32 - vMask) + "位应该为0");
            }
        } else {
            $("#source_cidr").removeClass('success').addClass('error').css('border', 'solid 1px #b94a48').css('color', '#b94a48');
            showErrorMsg("请按CIDR规则填写值", "请检查IP地址格式或者网络前缀位是否小于0或大于32");
        }
    }
    alidateAppendBtn();
}
function isAvailablePort(){
    if($("#aProtocol").val() == "ICMP"){
        $('#aEndPort').addClass('success').hide();
        $('#aStartPort').addClass('success').hide();
        alidateAppendBtn($("#aProtocal").val());
    }else{
        $('#aEndPort').show();
        $('#aStartPort').show();
        alidateAppendBtn();
    }
}
function validatePort(){
    var verifyStr = /^\+?[1-9][0-9]*$/;
    var aStartPort = $.trim($("#aStartPort").val());
    var aEndPort = $.trim($('#aEndPort').val());
    if(aStartPort == "" ){
        $("#aStartPort").removeClass('success').css('border', 'solid 1px #808080').css('color', '#808080');
        return;
    }
    if(aEndPort == ""){
        $("#aEndPort").removeClass('success').css('border', 'solid 1px #808080').css('color', '#808080');
        return;
    }
    if( !verifyStr.test(aStartPort)){
        $("#aStartPort").removeClass('success').addClass('error').css('border','solid 1px #b94a48').css('color','#b94a48');
        showErrorMsg('起始端口',"起始端口值应该为正整数");
        return ;
    }
    if(aEndPort == ""){
        $("#aEndPort").removeClass('success').addClass('error').css('border','solid 1px #b94a48').css('color','#b94a48');
        return;
    }
    if(!verifyStr.test(aEndPort)){
        $("#aEndPort").removeClass('success').addClass('error').css('border','solid 1px #b94a48').css('color','#b94a48');
        showErrorMsg('结束端口',"结束端口值应该为正整数");
        return;
    }
    if (aStartPort > aEndPort ){
        $("#aStartPort").removeClass('success').addClass('error').css('border','solid 1px #b94a48').css('color','#b94a48');
        $("#aEndPort").removeClass('success').addClass('error').css('border','solid 1px #b94a48').css('color','#b94a48');
        showErrorMsg('请检查起始端口和结束端口的值',"起始端口应不大于结束端口");
        return;
    }else{
        $("#aStartPort").removeClass('error').addClass('success').css('border','solid 1px #468847').css('color','#468847');
        $("#aEndPort").removeClass('error').addClass('success').css('border','solid 1px #468847').css('color','#468847');
    }
    alidateAppendBtn();
}
function alidateAppendBtn(){
    if($("#aProtocol").val() != "ICMP"){
        var aStartPort = $.trim($("#aStartPort").val()),
            aEndPort = $.trim($('#aEndPort').val()),
            size = 0;
        if(aStartPort == "" ){
            $("#aStartPort").removeClass('success').css('border', 'solid 1px #808080').css('color', '#808080');
            $("#appendRule").addClass("txt-color-darken").addClass("disabled").removeClass("btn-primary");
            return;
        }
        if(aEndPort == ""){
            $("#aEndPort").removeClass('success').css('border', 'solid 1px #808080').css('color', '#808080');
            $("#appendRule").addClass("txt-color-darken").addClass("disabled").removeClass("btn-primary");
            return;
        }
    }

    $('#appendRuleTr input').each(function(){
        if ($(this).hasClass('success')){size++;}
    });
    if(size == 3){
        $("#appendRule").removeClass("txt-color-darken").removeClass("disabled").addClass("btn-primary");
    }else{
        $("#appendRule").addClass("txt-color-darken").addClass("disabled").removeClass("btn-primary");
    }
}

function addFirewallRule(){
    var aCIDR = $("#source_cidr").val(),
        aProtocol = $("#aProtocol").val(),
        aStartPort = $("#aStartPort").val(),
        aEndPort = $('#aEndPort').val();

    doPost("/action/instance/createFirewallRule", {
        "regionId":sel_region_id,
        "protocol":aProtocol,
        "startport":aStartPort,
        "endport":aEndPort,
        "cidrlist":aCIDR,
        "ipaddressid":public_ip_id,
        "ipaddress":public_ip,
        "instanceId":sel_row_id
    } , function (objs) {
        if (objs.httpCode == "200"&& objs.code=="Success") {
            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                showMsg("操作成功", "添加规则成功。");
                firewallRulesLoad();
            }else{
                showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
            }
        }
        else {
            showErrorMsg(rpL(objs.data.code), "添加规则失败。");
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
        }
    });

}

function deleteFirewallRule(ruleID){

    doPost("/action/instance/deleteFirewallRule", {
        "regionId":sel_region_id,
        "fireWallId":ruleID,
        "instanceId":sel_row_id
    }, function (objs) {
        if (objs.httpCode == "200") {
            if (objs.httpCode == "200"&&objs.code=="Success") {
                showMsg('操作成功', "成功删除规则。");
                setTimeout(firewallRulesLoad, 1000);
            }else{
                showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
            }
        } else {
            showErrorMsg(rpL(objs.data.code), "删除失败。");
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
        }
    });
}

//初始化云主机迁移物理机列表
function init_live_migrate_ins(){

    $('#ins_live_migrate_modal').modal("show");
    var ins_live_migrate_select = document.getElementById("ins_live_migrate_select").options;
    clearOptions(ins_live_migrate_select);
    addOption(ins_live_migrate_select, "---正在加载中---", "");
    doPost("/action/instance/findInstanceDetail", {"instanceId":sel_row_id,"regionId":sel_region_id}, function (objs) {
        if (objs.httpCode == "200"&&objs.code=="Success") {
            $("#select_node_label").empty().append(objs.data.instance_model.node+"("+ objs.data.instance_model.nodeIp+")");
        }
    });
    doPost("/action/host/findHostForMigration",{"regionId":sel_region_id,"instanceId":sel_row_id}, function (objs) {
            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                if(objs.data.node_list.length>0){
                    clearOptions(ins_live_migrate_select);
                    addOption(ins_live_migrate_select, "---请选择---", "");
                    for(var i=0;i<objs.data.node_list.length;i++){
                        addOption(ins_live_migrate_select,objs.data.node_list[i].hostname+"("+objs.data.node_list[i].ip+")",objs.data.node_list[i].uuid);
                    }
                }else{
                    clearOptions(ins_live_migrate_select);
                    addOption(ins_live_migrate_select, "---当前无物理节点---", "");
                }

            }else{
                showErrorMsg("","获取物理节点失败。");
            }
    });

}

//迁移操作
function live_migrate(){

    if(all_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_row_id==null || sel_row_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }

    var hostId  = $("#ins_live_migrate_select").val();
    if(hostId==null||hostId==""){
        showErrorMsg("","请选择一台物理节点。");
        return;
    }

    showConfirm("fa-play", "迁移云主机", "是否迁移云主机?", function () {
        $("#btn_live_migrate").addClass('disabled');
        $('#ins_live_migrate_modal').modal("hide");
        showConsoleMsgs("操作成功", "正在迁移云主机...", function (obj) {
            doPost("/action/instance/liveMigrateInstance", {"regionId":sel_region_id,"instanceId":sel_row_id,"hostId":hostId}, function (objs){
                if (objs.httpCode == "200") {
                    if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                        showMsg("操作成功", "成功迁移主机");
                        refreshInstance();
                    }
                    else{
                        $("#btn_live_migrate").removeClass('disabled');
                        showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                    }
                } else {
                    $("#btn_live_migrate").removeClass('disabled');
                    showErrorMsg(rpL(objs.data.code), "成功迁移主机失败。");
                }
            });
        });
    });

}


/**
 * 格式化云主机状态
 *
 * ACTIVE	 正常运行中
 * BUILD	 正在创建中
 * REBUILD	 虚拟机重置，但调用重置接口或回滚快照时为这个状态
 * SHUTOFF	 已经被用户关闭，比如在命令行中运行‘shutdown -h’命令
 * REBOOT	 正在重启中
 * HARD_REBOOT	 强制重启中
 * SOFT_DELETED	 已释放，一周之内可以恢复
 * ERROR	 出现异常
 * DESTROYED	 已经被销毁，无法恢复
 * RESTORING	 正在恢复删除的虚拟机
 * UNKNOWN	 状态未知，请联系管理员
 */
function formatInsStatus(status){
    switch(status){
        case "ACTIVE":
            return "<img style='height:16px;width:16px;' src='/static/images/statusIcon/ACTIVE.png'>&nbsp;运行中";
        case "BUILD":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;创建中";
        case "REBUILD":
            return "重装系统";
        case "SHUTOFF":
            return "<img style='height:16px;width:16px;' src='/static/images/statusIcon/SHUTOFF.png'>&nbsp;已关闭";
        case "REBOOT":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;重启中";
        case "HARD_REBOOT":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;强制重启中";
        case "SOFT_DELETED":
            return "已释放";
        case "ERROR":
            return "<img style='height:16px;width:16px;' src='/static/images/statusIcon/ERROR.png'>&nbsp;出现异常";
        case "DESTROYED":
            return "<img style='height:16px;width:16px;' src='/static/images/statusIcon/DESTROYED.png'>&nbsp;已销毁";
        case "RESTORING":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;正在恢复";
        case "SNAPSHOT":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;创建快照中";
    /**-------new state begin-----------*/
        case "STARTING":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;开机中";
        case "STOPPING":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;关机中";
        case "EXPUNGING":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;销毁中";
        case "MIGRATING":
            return "<i class='fa fa-spin fa-spinner'></i>&nbsp;迁移中";
        case "SHUTDOWNED":
            return "<img style='height:16px;width:16px;' src='/static/images/statusIcon/SHUTOFF.png'>&nbsp;已关闭";
    /**-------new state end-----------*/
        case "NotOpen":
            return "&nbsp;待开通";
        case "DisposeFailure":
            return "&nbsp;开通失败";
        case "ExpireClose":
            return "&nbsp;到期关闭";
        default:
            return "<img style='height:16px;width:16px;' src='/static/images/statusIcon/UNKNOWN.png'>&nbsp;未知";
    }
}