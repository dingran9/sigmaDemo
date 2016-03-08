/**
 * Created by songxiaoguang on 2014/10/10.
 */


function  userList_snapshot_onchange(user){
    $("#toolbar_snapshot").show();
    $("#widget-grid-snapshot").show();
    var params={
        "url":"/action/snapshot/findUserSnapshotList",
        "data":{"user":user}
    };
    if(params.data.user==null||params.data.user==""){
        return;
    }
    snapshotLoad(params);
}

function listRegionsFromSnapshot(){
    doPost("/action/region/findRegionList",{},function(objs){
        if(objs.httpCode == "200") {
            var data = objs.data;
            var str = "";
            if(data==null||data.length<=0){
                showErrorMsg("","获取地域列表失败！");
                return;
            }
            for(var i=0;i<data.length;i++){
                str +=" <a onclick=\"loadInstance('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
            }
                $("#regionList_snapshot").empty().append(str);
                $("#toolbar_snapshot").show();
                $("#widget-grid-snapshot").show();
                loadSnapshot(data[0].regionUuid);
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}
//切换地域
function loadSnapshot(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    //snapshotLoad(id);
    var type = $("#snap_tab_ul").find("li.active").find("a").attr("func");
    loadSnapDataByType(type);
}
//根据不同标签加载数据
function loadSnapDataByType(type){
    var id = $("#regionList_snapshot").find("a.btn-primary").attr("id"),
        params;
    if(type !== "2"){
            params={
            "url":"/action/snapshot/findSnapshotList",
            "data":{"region":id}
        };
        snapshotLoad(params);
    }else if(type == "2"){
        var params_diskSnapshot ={
            "url":"/action/volumeSnapshot/findVolumeSnapshotList",
            "data":{"region":id}
        };
        diskSnapshotLoad(params_diskSnapshot);
    }else{
        showErrorMsg("操作失败","服务器内部错误");
    }
}
//刷新
function refreshSnapshot(){
    //snapshotLoad($("#regionList_snapshot .btn-primary").attr('id'));
    loadSnapDataByType("1");
}

/**
 * 快照列表
 */
var sel_snap_row_id = "",
    sel_snap_region_id="",
    all_snap_data,
    sel_ins_row_id, //用来判断快照所在vm
    snapTable;
function setSnapSel(obj,id,ins_id){

    sel_snap_region_id = $("#regionList_snapshot .btn-primary").attr('id');

    var obj_checked = obj.checked;
    $("#snap_table input[name='cbx_snap_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id)
        sel_snap_row_id = id;
        sel_ins_row_id = ins_id;
        all_snap_data = snapTable.fnGetData(obj.parent);
        $("#btn_delete,#btn_rollback").removeClass('disabled');
    }else{
        sel_snap_row_id = "";
        sel_ins_row_id = "";
        all_snap_data = null;
        $("#btn_delete,#btn_rollback").addClass('disabled');
    }
}
function snapshotLoad(params){
    $("#btn_delete,#btn_rollback").addClass('disabled');
    all_snap_data = null;
    sel_snap_row_id = "";
    $("#snapshot_list_table").empty().append("<table id='snap_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='snap_thead'></thead><tbody id='snap_tbody'></tbody></table>");
    $("#snap_thead").empty().append(
            "<tr><th></th>"+
            "<th class='talign_c'>"+rpL("snap_name")+"</th>"+
            "<th class='talign_c'>"+rpL("instance_name")+"</th>"+
            /*"<th class='talign_c'>"+rpL("image_name")+"</th>"+*/
            // "<th class='talign_c'>"+rpL("region")+"</th>"+
            "<th class='talign_c' style='width:30%;'>"+rpL("create_time")+"</th>"+
            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='6' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#snap_tbody").empty().append(loadStr);

    //snaploadData(params);
    runDiskSnapDataTablesByPage();
}
function snaploadData(params) {

    runSnapDataTables(function(){
        snapTable = $("#snap_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 4, "desc" ]],
            "sRowSelect": "single",
            "aoColumnDefs": [
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
                "sProcessing": "<img src=’./loading.gif’ />"
            }
        });
    },params);
}
function runSnapDataTables(callback,params) {

    var regionId =  $("#regionList_snapshot .btn-primary").attr('id');
    doPost(params.url, {"instanceId":"","regionId":regionId},  function (objs) {
        if (objs.httpCode == "200"&&objs.code=="Success") {
            var str = "";
            if(objs.data!=null&&objs.data.snapshot_list!=null){
                for (var i = 0; i < objs.data.snapshot_list.length; i++) {
                    str += "<tr ondblclick=\"showSnapDetail('" + objs.data.snapshot_list[i].snapshotId  +"','"+regionId+ "')\" title='双击可查看详情'>" +
                        "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_snap_list' onclick=\"setSnapSel(this,'" + objs.data.snapshot_list[i].snapshotId+ "','" + objs.data.snapshot_list[i].instanceId + "')\"><i></i></label></td>" +
                        "<td class='text-center'>" + objs.data.snapshot_list[i].name + "</td>" +
                        "<td class='text-center'>" + objs.data.snapshot_list[i].instance.hostname+ "</td>" +
                        /*"<td class='text-center'>" + objs.data.snapshot_list[i].instance.image + "</td>" +*/
                        //"<td class='text-center'>" + objs.data.snapshot_list[i].region + "</td>" +
                        "<td class='text-center'>" + objs.data.snapshot_list[i].createDate + "</td>" +
                        "</tr>";
                }
            }

            $("#snap_tbody").empty().append(str);

        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='6' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
            $("#snap_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            return function () {
            };
        }
        $("#snap_thead").show();
        callback();
    });
}

function runDiskSnapDataTablesByPage(){
    var regionId =  $("#regionList_snapshot .btn-primary").attr('id');
    snapTable =  $("#snap_table").dataTable({
        "bDestroy":true,
        "bRetrieve":true,
        "bAutoWidth": true,
        "bServerSide": true,
        "sAjaxDataProp":"data",
        "sPaginationType" : "bootstrap_full",
        'bSort':false,
        "sRowSelect": "single",
        "sAjaxSource": "/action/snapshot/findSnapshotPageList",
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
            var str="";
            str +=
                "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_snap_list' onclick=\"setSnapSel(this,'" + aData.uuid+ "','" + aData.instanceId + "')\"><i></i></label></td>" +
                "<td class='text-center'>" + aData.name + "</td>" +
                "<td class='text-center'>" + aData.instanceName+ "</td>" +
                /*"<td class='text-center'>" + aData.instance.image + "</td>" +*/
                //"<td class='text-center'>" + aData.region + "</td>" +
                "<td class='text-center'>" + aData.createDate + "</td>";
            $(nRow).empty().append(str);
           /* $(nRow).bind("dblclick",function(){
                showSnapDetail(aData.uuid,regionId);
            });*/
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
 * 下来列表选中”确定”按钮可用
 */

function changeSnapshot(){
    var ins_snapshots=$("#rollback_ins_snapshots").val();
    if(null==ins_snapshots||""==ins_snapshots){
        $("#btn_snapshot_confirm").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }else{
        $("#btn_snapshot_confirm").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }

}

/**
 * 在快照列表中回滚快照
 */
function rollbackSnaprollbackSnap(){
    if(all_snap_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }

    var regionId =  $("#regionList_snapshot .btn-primary").attr('id');

    doPost("/action/instance/findInstanceDetail", {"instanceId":sel_ins_row_id,"regionId":regionId}, function (objs) {

        if(objs.httpCode == "200"&& objs.code=="Success"){
            if(!objs.data.instance_model){
                showErrorMsg("回滚操作失败","查询不到云主机");
                return;
            }else{
                if(objs.data.instance_model.status!="SHUTOFF"){
                    showErrorMsg("","请先关闭云主机。");
                    return;
                }
            }
        }

        showConfirm("fa-trash-o","快照回滚","是否要进行快照回滚?",function() {
            setDisabled($("#btn_snapshot_confirm"));
            showMsg("操作成功", "快照回滚中...");
            $('#ins_oper_modal').modal("hide");
            doPost("/action/snapshot/rollbackSnapshot", {"snapshotId":sel_snap_row_id,"regionId":regionId}, function (objs) {
                if (objs.httpCode == "200"&&objs.code=="Success") {
                    if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                        showMsg("操作成功", "成功回滚快照。");
                        snapshotLoad(sel_snap_region_id);
                    }else{
                        showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                    }
                } else {
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                    showErrorMsg(rpL(objs.data.code), "回滚快照失败。");
                }
                cancelDisabled($("#btn_snapshot_confirm"));
            });
        });
    });
}

/**
 * 删除快照
 */
function deleteSnap(){
    if(all_snap_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    showConfirm("fa-trash-o", "删除快照", "是否要删除快照?", function () {
        $("#btn_delete").addClass('disabled');
        doPost("/action/snapshot/deleteSnapshot", {"snapshotId":sel_snap_row_id,"regionId":sel_snap_region_id}, function (objs) {
            if (objs.httpCode == "200"&&objs.code=="Success") {
                if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                    showMsg("操作成功", "成功删除快照,稍后刷新列表查看。");
                    snapshotLoad({});
                }else{
                    showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                }
            } else {
                console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                showErrorMsg(rpL(objs.data.code), "删除快照失败。");
            }
        });
    });
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
            $("#snap_d_name").html(objs.data.snapshot.name);
            $("#snap_d_ins_name").html(objs.data.snapshot.instance.hostname);
            $("#snap_d_ins_ip").html(objs.data.snapshot.instance.publicIp);
            $("#snap_d_image_name").html(objs.data.snapshot.instance.image);
            $("#snap_d_createT").html(objs.data.snapshot.createDate);
            disableRightKey();
            $("#snap_d_modal").modal("show");

        } else {
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            showErrorMsg(rpL(objs.data.code), "获取快照信息失败。");
        }
    });
}