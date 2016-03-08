/**
 * Created by Administrator on 2015/3/10.
 */

var disk_snapTable;


function  userList_diskSnapshot_onchange(user){
    $("#toolbar_snapshot").show();
    $("#widget-grid-snapshot").show();
    var params={
        "url":"/action/volumeSnapshot/findUserVolumeSnapshotList",
        "data":{"user":user}
    };
    if(params.data.user==null||params.data.user==""){
        showErrorMsg("","用户不能为空");
        return;
    }
    diskSnapshotLoad(params);
}

function initDiskSnapshotBtnStatus(){

    $("#btn_disksnap_delete,#btn_disksnap_rollback").addClass('disabled');
    all_disk_snap_data = null;
    sel_disk_snap_row_id = "";
    sel_disk_snap_belong_disk_id = "";
    sel_disk_snap_belong_disk_name= "";
    se_disk_snap_region_id="";
}


function diskSnapshotLoad(params){

    initDiskSnapshotBtnStatus();

    $("#disk_snapshot_list_table").empty().append("<table id='disk_snap_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='disk_snap_thead'></thead><tbody id='disk_snap_tbody'></tbody></table>");
    $("#disk_snap_thead").empty().append(
            "<tr><th></th>"+
            "<th class='talign_c'>"+rpL("name")+"</th>"+
            "<th class='talign_c'>"+rpL("disk_belong")+"</th>"+
            "<th class='talign_c'>"+rpL("type")+"</th>"+
            "<th class='talign_c'>"+rpL("state")+"</th>"+
            "<th class='talign_c' style='width:15%;'>"+rpL("createTime")+"</th>"+
            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='6' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#disk_snap_tbody").empty().append(loadStr);
    runDiskSnapDataTables(function(){
        disk_snapTable = $("#disk_snap_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 5, "desc" ]],
            "sRowSelect": "single",
            "aoColumnDefs": [
                {
                    bSortable: false,
                    aTargets: [ 0 ]
                },
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ],
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
        //afterTableLoad("snap_tab");
    },params);
}

function runDiskSnapDataTables(callback,params) {

    doPost(params.url,params.data, function (objs) {
        if (objs.httpCode == "200") {
            var str = "";
            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                for (var i = 0; i < objs.data.snapshot_list.length; i++) {
                    str += "<tr>" +
                        "<td><label class='checkbox'><input type='checkbox' name='cbx_disk_snap_list' onclick=\"setDiskSnapSel(this,'" + objs.data.snapshot_list[i].snapshotId + "','" +
                        objs.data.snapshot_list[i].volumeid + "','" + objs.data.snapshot_list[i].volumename+"','" + objs.data.snapshot_list[i].volumetype+"','" + objs.data.snapshot_list[i].state+"')\"><i></i></label></td>" +
                        "<td class='text-center'>" + objs.data.snapshot_list[i].name + "</td>" +
                        "<td class='text-center'>" + objs.data.snapshot_list[i].volumename + "</td>" +
                        "<td class='text-center'>" + rpL(objs.data.snapshot_list[i].volumetype) + "</td>" +
                        "<td class='text-center'>" + rpL(objs.data.snapshot_list[i].state) + "</td>" +
                        "<td class='text-center'>" + objs.data.snapshot_list[i].createDate + "</td>" +
                        "</tr>";
                    //dateFormat("yyyy-MM-dd",new Date(objs.snapshot_list[i].createTime + "+0800"))
                }
                $("#disk_snap_tbody").empty().append(str);
            }else{
                showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            }
        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='6' style='border-width:0;'><span>没有检索到数据</span></td></tr>";
            $("#disk_snap_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            return function () {
            };
        }
        $("#disk_snap_thead").show();
        callback();
    });
}


//刷新
function refreshDiskSnapshot(){
        var region  = $("#regionList_snapshot .btn-primary").attr('id');
        var params={
            "url":"/action/volumeSnapshot/findVolumeSnapshotList",
            "data":{"region":region}
        };
    diskSnapshotLoad(params);
}

var sel_disk_snap_row_id = "",
    sel_disk_snap_belong_disk_id = "",
    sel_disk_snap_belong_disk_name= "",
    all_disk_snap_data,
    se_disk_snap_region_id="";
function setDiskSnapSel(obj,id,diskId,diskName,volumetype,state){

    se_disk_snap_region_id = $("#regionList_snapshot .btn-primary").attr('id');

    var obj_checked = obj.checked;
    $("#disk_snap_table input[name='cbx_disk_snap_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id)
        sel_disk_snap_row_id = id;
        sel_disk_snap_belong_disk_id = diskId;
        sel_disk_snap_belong_disk_name = diskName;
        all_disk_snap_data = snapTable.fnGetData(obj.parent);

        if("BackedUp"==state){
            $("#btn_disksnap_rollback").removeClass('disabled');

        }else if("BackingUp"==state){
            $("#btn_disksnap_rollback").addClass('disabled');

        }
        $("#btn_disksnap_delete").removeClass('disabled');
    }else{
        sel_disk_snap_row_id = "";
        sel_disk_snap_belong_disk_id = "";
        sel_disk_snap_belong_disk_name= "";
        all_disk_snap_data = null;
        $("#btn_disksnap_delete,#btn_disksnap_rollback").addClass('disabled');
    }
}
/*
/**
 * 快照详情
 * @param diskSnapshotId

function showDiskSnapDetail(diskSnapshotId){
    doPost("/action/volumeSnapshot/findVolumeSnapshotDetail", {"volumeSnapId":diskSnapshotId}, function (objs) {
        if (objs.httpCode == "200") {

            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                var stable = objs.data.volume_snap_model.stable.toString()=="true"?"是":"否";
                //$("#snap_d_id").html(objs.data.volume_snap_model.volume_snap_id);
                $("#disk_snap_d_name").html(objs.data.volume_snap_model.name);
                $("#disk_snap_d_stable").html(stable);
                //$("#disk_snap_d_ins_id").html(objs.data.volume_snap_model.instance_id);
                $("#disk_snap_d_ins_name").html(objs.data.volume_snap_model.volume_name);
                $("#disk_snap_d_region").html(objs.data.volume_snap_model.region);
                $("#disk_snap_d_region_remark").html(objs.data.volume_snap_model.region_remark);
                var remark = objs.data.volume_snap_model.remark==null||objs.data.volume_snap_model.remark==""?
                    "无":objs.data.volume_snap_model.remark;
                $("#disk_snap_d_remark").html(remark);
                $("#disk_snap_d_createT").html(convertTimeZoneToLocal(objs.data.volume_snap_model.create_time.substring(0,19)));
                disableRightKey();
                $("#disk_snap_d_modal").modal("show");
            }
            else{
                showErrorMsg(rpL(objs.data.code), rpL(objs.data.message));
                console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            }

        } else {
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg(rpL(objs.code), "获取快照信息失败。");
        }
    });
}*/
/**
 * 删除快照
 */
function deleteDiskSnap(){
    if(all_disk_snap_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    showConfirm("fa-trash-o", "删除磁盘快照", "是否要删除磁盘快照?", function () {
        //$("#btn_disksnap_delete").addClass('disabled');
        doPost("/action/volumeSnapshot/deleteVolumeSnapshot", {"regionId":se_disk_snap_region_id,
            "volumeSnapId":sel_disk_snap_row_id,"volumeName":sel_disk_snap_belong_disk_name}, function (objs) {
            if (objs.httpCode == "200") {
                if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                    showMsg("操作成功", "成功删除磁盘快照。");
                    refreshDiskSnapshot();
                }
                else{
                    showErrorMsg("操作失败", rpL(objs.data.message));
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                }
            } else {
                console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                showErrorMsg(rpL(objs.data.code), "删除磁盘快照失败。");
            }
        });
    });
}

function rollbackDiskSnap(){
    if(all_disk_snap_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }

    showConfirm("fa-trash-o","快照回滚","是否要进行快照回滚（回滚后该磁盘的快照将全部清空）?",function() {
        doPost("/action/volumeSnapshot/rollbackSnapshotVolume", {"regionId": se_disk_snap_region_id, "volumeSnapId": sel_disk_snap_row_id,
            "volumeId": sel_disk_snap_belong_disk_id, "volumeName": sel_disk_snap_belong_disk_name}, function (objs) {
            if (objs.httpCode == "200") {
                if (objs.data.httpCode == "200" && objs.data.code == "Success") {
                    showMsg("操作成功", "成功回滚快照。");
                    refreshDiskSnapshot();
                }
                else {
                    showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                }
            } else {
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg(rpL(objs.code), "回滚快照失败。");
            }
            $("#btn_disksnap_rollback").removeClass("disabled");
        });
    });
}