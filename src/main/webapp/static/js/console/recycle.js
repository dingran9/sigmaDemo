
function listRegionsFromRecycle(){
    doPost("/action/region/findRegionList",{},function(objs){
        if(objs.httpCode == "200") {
            var data = objs.data;
            var str = "";
            if(data==null||data.length<=0){
                showErrorMsg("","获取地域列表失败！");
                return;
            }
            for(var i=0;i<data.length;i++){
                str +=" <a onclick=\"loadRecycle('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
            }
                $("#regionList_recycle").empty().append(str);
                $("#toolbar_ins_recycle").show();
                $("#widget-grid-ins_recycle").show();
                loadRecycle(data[0].regionUuid);
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });
}
//切换地域
function loadRecycle(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    //snapshotLoad(id);
    var type = $("#recycle_tab_ul").find("li.active").find("a").attr("func");
    loadRecycleDataByType(type);
}
//根据不同标签加载数据
function loadRecycleDataByType(type){
    if(type ==1){
        insRecycle();
    }else if(type == 2){
        diskRecycle();
    }else{
        showErrorMsg("操作失败","服务器内部错误");
    }
}

//刷新
function refreshRecycle(type){
    loadRecycleDataByType(type);
}

/**
 * 快照列表
 */
var sel_ins_recycle_row_id = "",
    sel_disk_recycle_row_id = "",
    sel_ins_recycle_region_id="",
    all_recycle_data,
    sel_ins_row_id, //用来判断快照所在vm
    insRecycleTable;
function setInsRecycleSel(obj,id,ins_id){

    sel_ins_recycle_region_id = $("#regionList_recycle .btn-primary").attr('id');

    var obj_checked = obj.checked;
    $("#ins_recycle_table input[name='cbx_ins_recycle_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id)
        sel_ins_recycle_row_id = id;
        sel_ins_row_id = ins_id;
        all_recycle_data = insRecycleTable.fnGetData(obj.parent);
        $("#btn_delete,#btn_rollback").removeClass('disabled');
    }else{
        sel_ins_recycle_row_id = "";
        sel_ins_row_id = "";
        all_recycle_data = null;
        $("#btn_delete,#btn_rollback").addClass('disabled');
    }
}
function insRecycle(){
    $("#btn_delete,#btn_rollback").addClass('disabled');
    all_recycle_data = null;
    sel_ins_recycle_row_id = "";
    $("#recycle_list_table").empty().append("<table id='ins_recycle_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='ins_recycle_thead'></thead><tbody id='ins_recycle_tbody'></tbody></table>");
    $("#ins_recycle_thead").empty().append(
            "<tr><th></th>"+
            "<th class='talign_c'>"+rpL("instance_name")+"</th>"+
            "<th class='talign_c'>"+rpL("instance_number")+"</th>"+
            "<th class='talign_c'>"+rpL("status")+"</th>"+
            "<th class='talign_c'>"+rpL("configure")+"</th>"+
            "<th class='talign_c'>"+rpL("image")+"</th>"+
            "<th class='talign_c'>"+rpL("end_time")+"</th>"+
            "<th class='talign_c'>"+rpL("recovery_period")+"</th>"+
            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='8' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#ins_recycle_tbody").empty().append(loadStr);

    //runInsRecycleDataTablesByPage();
    runInsRecycleDataTablesByPage("ins_recycle_table","/action/instance/findRecyclePage",setInstanceStr);
}


function diskRecycle(){
    $("#btn_delete,#btn_rollback").addClass('disabled');
    all_recycle_data = null;
    sel_disk_recycle_row_id = "";
    $("#disk_recycle_list_table").empty().append("<table id='disk_recycle_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='ins_recycle_thead'></thead><tbody id='ins_recycle_tbody'></tbody></table>");
    $("#disk_recycle_table thead").empty().append(
            "<tr><th></th>"+
            "<th class='talign_c'>"+rpL("disk_name")+"</th>"+
            "<th class='talign_c'>"+rpL("disk_display_name")+"</th>"+
            "<th class='talign_c'>"+rpL("users_belong")+"</th>"+
            "<th class='talign_c'>"+rpL("type")+"</th>"+
            "<th class='talign_c'>"+rpL("status")+"</th>"+
            "<th class='talign_c'>"+rpL("disk_size")+"（G）"+"</th>"+
            "<th class='talign_c'>"+rpL("instance_name")+"</th>"+
            "<th class='talign_c'>"+rpL("end_time")+"</th>"+
                "<th class='talign_c'>"+rpL("recovery_period")+"</th>"+
            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#disk_recycle_table tbody").empty().append(loadStr);

    //runInsRecycleDataTablesByPage();
    runInsRecycleDataTablesByPage("disk_recycle_table","/action/volume/findRecyclePage",setDiskStr);
}
function runInsRecycleDataTablesByPage(tableid,action,rowCallback){
    var regionId =  $("#regionList_recycle .btn-primary").attr('id');
    insRecycleTable =  $("#"+tableid).dataTable({
        "bDestroy":true,
        "bRetrieve":true,
        "bAutoWidth": true,
        "bServerSide": true,
        "sAjaxDataProp":"data",
        "sPaginationType" : "bootstrap_full",
        'bSort':false,
        "sRowSelect": "single",
        "sAjaxSource": action,
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var pageSize,pageNo;
            pageSize = oSettings._iDisplayLength;
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
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str = rowCallback(aData);

            $(nRow).empty().append(str);
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

function setInstanceStr(aData){
    var str="",
        color_status= (aData.status=="ExpireClose")?"'console-red'":"",
        lasttime =parseInt(aData.recycleTime - new Date().getTime()),
        isExpiredStr = "",
        isExpiredStatus = "";

    if(lasttime>0){
        var time= lasttime/(24*3600*1000);
        if(time>3){
            isExpiredStatus="console-green'";
        }else{
            isExpiredStatus="console-orange'";
        }
        var day = (time < 1)?"小时":"天";
        isExpiredStr=Math.round(time) +day+"内";
    }else if(lasttime==0){
        isExpiredStr = "--";
        isExpiredStatus="'";
    }
    else{
        isExpiredStr ="已到期";
        isExpiredStatus="console-red'";
    }

    var endTime = "--";
    if(aData.endTime){
        endTime = new Date(aData.endTime).Format("yyyy-MM-dd hh:mm:ss");
    }

    var expiredTime = (aData.endTime==null||aData.endTime==""||aData.endTime==0)?"--":endTime;

    var modifyHostNameContent = '<span id="modify_name'+aData.instance_id+'">' +
        '<span style="margin-left: 5px;" id="hostname_span'+aData.instance_id+'">'+convertStr(aData.displayName,"--") +'</span>&nbsp;' +
        '<a style="cursor:pointer;" title="可编辑" class="" onclick="showModify(\''+aData.instance_id+'\')"><i class="fa fa-pencil"></i></a>' +
        '</span>' +
        '<snap id="modify_input'+aData.instance_id+'" style="display:none;">'+
        '<input id="modify_host_name'+aData.instance_id+'" class="text-input" type="text" value="'+convertStr(aData.displayName)+'"/>' +
        '<a id="btn_modify_name'+aData.instance_id+'" style="text-align: center;cursor:pointer;" onclick="modifyName(\''+aData.instance_id+'\')"><i class="fa fa-check-square-o text-fa" ></i></a>' +
        '</span>';

    str +=
        "<td><label class='checkbox'><input type='checkbox' name='cbx_list' " +
        "onclick=\"setInsRecycleSel(this,'" + aData.instance_id + "','" + aData.status + "','" + aData.public_ip+ "','" + aData.nodeIp+"','" + aData.publicIpId+"','" +aData.cpu +"','" +aData.ram +"')\"><i></i></label></td>" +
        "<td class='text-center'>" + modifyHostNameContent + "</td>" +
        "<td class='text-center'>" + aData.hostname + "</td>" +
        "<td class="+color_status+"' text-center'>" + formatInsStatus(aData.recycleStatus)+ "</td>" +
        "<td class='text-center'>" +
        aData.cpu+"核"+ "&nbsp"+
        aData.ram+"GB"+ "<br>"+
        convertStrToLine(aData.bandWidth)+"Mbps"+
        "</td>" +
        "<td class='text-center'>" + aData.image + "</td>" +
        "<td class='text-center'>" +  expiredTime +"</td>" +
        "<td class='text-center "+isExpiredStatus+">" + isExpiredStr+"</td>";

    return str;
}


function setDiskStr(aData){
    var str = "",endTime = '--';
    var hostname=(aData.instance_name==""||null)?"无":aData.instance_name;
    var isExpiredStatus= (aData.status=="ExpireClose")?"'biology-red'":"";
    var strStatus = "未挂载",
        status = "<img src='/static/images/statusIcon/unmounted.png'>"+strStatus,
        isExpiredStr = "",
        lasttime =parseInt(aData.recycleTime - new Date().getTime());

    if (hostname != "无") {
        strStatus = "已挂载";
        status = "<img src='/static/images/statusIcon/mounted.png'>"+strStatus;
    }
    if(aData.endTime){
        endTime = new Date(aData.endTime).Format("yyyy-MM-dd hh:mm:ss");
    }


    if(lasttime>0){
        var time= lasttime/(24*3600*1000);
        if(time>3){
            isExpiredStatus="console-green'";
        }else{
            isExpiredStatus="console-orange'";
        }
        var day = (time < 1)?"小时":"天",
            isExpiredStr=Math.round(time) +day+"内";
    }else if(lasttime==0){
        isExpiredStr = "--";
        isExpiredStatus="'";
    }
    else{
        isExpiredStr ="已到期";
        isExpiredStatus="console-red'";
    }
    str +=
        "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_volume_list' " +
        "onclick=\"setDiskSel(this,'" + aData.volume_id +"','"+aData.status+ "','"+aData.name+ "','"+aData.size+ "')\"><i></i></label></td>" +
        "<td class='text-center'>" + aData.name + "</td>" +
        "<td class='text-center'>" + convertStr(aData.display_name) + "</td>" +
        "<td class='text-center'>" + convertStr(aData.user) + "</td>" +
        "<td class='text-center'>" + rpL(aData.type) + "</td>" +
        "<td class="+isExpiredStatus+"' text-center' style='text-align: center;'>" +  status + "</td>"+
        "<td class='text-center'>" + aData.size + "</td>" +
        "<td class='text-center'>" + hostname + "</td>" +
        /*"<td class='text-center'>" + aData.created_at + "</td>" +*/
        "<td class='text-center'>" + endTime + "</td>"+
            "<td class='text-center "+isExpiredStatus+">" + isExpiredStr+"</td>";
    return str;
}

/**
 * 快照详情
 * @param snapshotId
 */
//列表分页后没有使用到
function showSnapDetail(snapshotId,regionID){
    var data = {"snapshotId":snapshotId,"regionId":regionID};
    doPost("/action/snapshot/findSnapshotDetail",data , function (objs) {
        if (objs.httpCode == "200"&&objs.code=="Success") {
            $("#ins_recycle_d_name").html(objs.data.snapshot.name);
            $("#ins_recycle_d_ins_name").html(objs.data.snapshot.instance.hostname);
            $("#ins_recycle_d_ins_ip").html(objs.data.snapshot.instance.publicIp);
            $("#ins_recycle_d_image_name").html(objs.data.snapshot.instance.image);
            $("#ins_recycle_d_createT").html(objs.data.snapshot.createDate);
            disableRightKey();
            $("#ins_recycle_d_modal").modal("show");

        } else {
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            showErrorMsg(rpL(objs.data.code), "获取快照信息失败。");
        }
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
        case "Arrears":
            return "&nbsp;欠费删除";
        default:
            return "<img style='height:16px;width:16px;' src='/static/images/statusIcon/UNKNOWN.png'>&nbsp;未知";
    }
}