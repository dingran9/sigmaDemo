/**
 * Created by songxiaoguang on 2014/10/10.
 */


/*function  userList_disk_onchange(user){
    $("#toolbar_disk").show();
    $("#widget-grid-disk").show();
    var params={
        "url":"/action/volume/findUserVolumeList",
        "data":{"user":user}
    }
    if(params.data.user==null||params.data.user==""){
        return;
    }
    diskloadData(params);
}*/

/**
 * 地域列表
 */
function listRegionsFromDisk(){
    doPost("/action/region/findRegionLis" +
        "t",{},function(objs){
        if(objs.httpCode == "200") {
                var data = objs.data;
                var str = "";
                if(data==null||data.length<=0){
                    showErrorMsg("","获取地域列表失败！");
                    return;
                }
                for(var i=0;i<data.length;i++){
                    str +=" <a onclick=\"loadDisk('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' id2 ='"+data[i].id+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
                }
                $("#regionList_disk").empty().append(str);
                $("#toolbar_disk").show();
                $("#widget-grid-disk").show();
                loadDisk(data[0].regionUuid);//加载第一个
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });
}

//切换地域
function loadDisk(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    diskloadData(id);
}
//刷新
function refreshDisk(){
    diskloadData($("#regionList_disk .btn-primary").attr('id'));
}


var sel_disk_row_id = "",
    sel_disk_region_id="",
    sel_disk_row_name="",
    sel_disk_row_instanceID = "",
    sel_disk_row_size = "",
    all_disk_data = null;
function setDiskSel(obj,id,status,name,size){
    sel_disk_region_id = $("#regionList_disk .btn-primary").attr('id');

    var obj_checked = obj.checked;
    $("#disk_table input[name='cbx_volume_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;
    if(obj.checked) {

        if (null != id){
            sel_disk_row_id = id;
        }
        sel_disk_row_name=name;
        sel_disk_row_size=size;
        all_disk_data = null;
        all_disk_data = diskTable.fnGetData(obj.parent);
        if("available"==status){
            $("#btn_disk_down").addClass("disabled");
            $("#btn_disk_create").addClass("disabled");
            $("#btn_disk_up").removeClass("disabled");
            $("#btn_disk_delete").removeClass("disabled");
            $("#btn_disksnap_create").addClass("disabled");
        }else if("in-use"==status){//已挂载状态
            $("#btn_disk_down").removeClass("disabled");
            $("#btn_disk_create").addClass("disabled");
            $("#btn_disk_up").addClass("disabled");
            $("#btn_disk_delete").addClass("disabled");
            $("#btn_disksnap_create").removeClass("disabled");
        }
        else if("error"==status){
            $("#btn_disk_delete").removeClass("disabled");
            $("#btn_disk_create").removeClass("disabled");
            $("#btn_disk_up").addClass("disabled");
            $("#btn_disk_down").addClass("disabled");
            $("#btn_disksnap_create").addClass("disabled")
        }
    }else{
        sel_disk_row_id = "";
        all_disk_data = null;
        sel_disk_row_name="";
        sel_disk_row_size="";
        $("#btn_disk_up,#btn_disk_down,#btn_disk_create,#btn_disksnap_create").addClass('disabled');
    }
}

var diskTable;
/**
 * 加载数据
 */
function diskloadData(regionId) {
    $("#btn_disk_delete,#btn_disk_expansion,#btn_disk_detail,#btn_disk_up,#btn_disk_down,#btn_disksnap_create").addClass('disabled');
    sel_disk_row_id = "";
    $("#disk_list_table").empty().append("<table id='disk_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='disk_thead' class='talign_c'></thead><tbody id='disk_tbody'></tbody></table>");
    $("#disk_thead").empty().append(
            "<tr><th></th>"+
            "<th class='talign_c'>"+rpL("disk_name")+"</th>"+
            "<th class='talign_c'>"+rpL("disk_display_name")+"</th>"+
            "<th class='talign_c'>"+rpL("users_belong")+"</th>"+
            "<th class='talign_c'>"+"类型"+"</th>"+
            "<th class='talign_c'>"+rpL("status")+"</th>"+
            "<th class='talign_c'>"+rpL("disk_size")+"（G）"+"</th>"+
            "<th class='talign_c'>"+rpL("instance_name")+"</th>"+
            "<th class='talign_c'>"+rpL("create_time")+"</th>"+
            "<th class='talign_c'>"+rpL("end_time")+"</th>"+
            "<th class='talign_c'>"+rpL("operation")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='11' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#disk_tbody").empty().append(loadStr);
    runDiskDataTablesPage(regionId);
}
function runDiskDataTablesPage(regionId){

    diskTable =  $("#disk_table").dataTable({
        "bDestroy":true,
        "bRetrieve":true,
        "bAutoWidth": true,
        "bServerSide": true,
        "sAjaxDataProp":"data",
        "sPaginationType" : "bootstrap_full",
        'bSort':false,
        "sRowSelect": "single",
        "sAjaxSource": "/action/volume/findVolumePage",
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
            $("#btn_disk_delete,#btn_disk_expansion,#btn_disk_detail,#btn_disk_up,#btn_disk_down,#btn_disksnap_create").addClass('disabled');
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str = "",endTime = '--';
            var hostname=(aData.instance_name==""||null)?"无":aData.instance_name;
            var isExpiredStatus= (aData.status=="ExpireClose")?"'biology-red'":"";
            var strStatus = "未挂载",
                status = "<img src='/static/images/statusIcon/unmounted.png'>"+strStatus;
            if (hostname != "无") {
                strStatus = "已挂载";
                status = "<img src='/static/images/statusIcon/mounted.png'>"+strStatus;
            }
            if(aData.endTime){
                endTime = new Date(aData.endTime).Format("yyyy-MM-dd hh:mm:ss");
            }
            str +=
                "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_volume_list' " +
                "onclick=\"setDiskSel(this,'" + aData.volume_id +"','"+aData.status+ "','"+aData.name+ "','"+aData.size+ "')\"><i></i></label></td>" +
                "<td class='text-center'>" + aData.name + "</td>" +
                "<td class='text-center'>" + convertStr(aData.display_name) + "</td>" +
                "<td class='text-center'>" + convertStr(aData.user) + "</td>" +
                "<td class='text-center'>" + rpL(aData.type) + "</td>" +
                "<td class="+isExpiredStatus+"' text-center'>" +  status + "</td>"+
                "<td class='text-center'>" + aData.size + "</td>" +
                "<td class='text-center'>" + hostname + "</td>" +
                "<td class='text-center'>" + aData.created_at + "</td>" +
                "<td class='text-center'>" + endTime + "</td>"+
                    "<td class='text-center'><a onclick='expandDiskSize(\""+aData.volume_id+"\")'>扩容</a></td>";

            $(nRow).empty().append(str);
            $(nRow).attr("title","双击可查看详情");
            $(nRow).on("dblclick",{"volumeId":aData.volume_id,"regionId":regionId,callback:setDiskDetail},getDiskDetail);
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
function runDiskDataTables(callback,regionId) {

    doPost("/action/volume/findVolumeList", {"regionId":regionId}, function (objs){
        var data = objs.data.volumeAllList;
        if(objs.httpCode == "200" && objs.code=="Success" && data != null){
            var str = "";
            for (var i = 0; i < data.length; i++) {
                var endTime = "--";
                var hostname=(data[i].instance_name==""||null)?"无":data[i].instance_name;
                var isExpiredStatus= (data[i].status=="ExpireClose")?"'biology-red'":"";
                if(data[i].endTime){
                    endTime = new Date(data[i].endTime).Format("yyyy-MM-dd hh:mm:ss");
                }
                var strStatus = "未挂载",
                    status = "<img src='/static/images/statusIcon/unmounted.png'>"+strStatus;
                if (hostname != "无") {
                    strStatus = "已挂载";
                    status = "<img src='/static/images/statusIcon/mounted.png'>"+strStatus;
                }
                str +=
                    "<tr ondblclick=\"getDiskDetail('" + data[i].volume_id +"','"+regionId+ "','setDiskDetail')\" title='双击可查看详情'>" +
                    "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_volume_list' " +
                    "onclick=\"setDiskSel(this,'" + data[i].volume_id +"','"+data[i].status+ "')\"><i></i></label></td>" +
                    "<td class='text-center'>" + data[i].name + "</td>" +
                    "<td class='text-center'>" + convertStr(data[i].display_name) + "</td>" +
                    "<td class='text-center'>" + rpL(data[i].type) + "</td>" +
                    "<td class='"+isExpiredStatus+" text-center'>" +  status + "</td>"+
                    "<td class='text-center'>" + data[i].size + "</td>" +
                    "<td class='text-center'>" + hostname + "</td>" +
                    "<td class='text-center'>" + data[i].created_at + "</td>" +
                    "<td class='text-center'>" + endTime + "</td>" +
                    "</tr>";
            }
            $("#disk_tbody").empty().append(str);
        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
            $("#disk_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            return function () {
            };
        }
        $("#disk_thead").show();
        callback();
    });
}


/**
 * 获取磁盘详情
 */
function getDiskDetail(data){
    var volumeId = data.data.volumeId,
        callback = data.data.callback,
        regionId = data.data.regionId;

    if(volumeId==""||volumeId==null){
        showErrorMsg("","磁盘ID不能为空");
        return;
    }

    $("#disk_d_status").removeClass("biology-red");

    doPost("/action/volume/findVolumeDetail", {"volumeId":volumeId,"regionId":regionId}, function (objs) {
        if (objs.httpCode == "200"&&objs.code=="Success" && objs.data.volume_model !== null) {

            if(callback){
                callback(objs.data);
            }
        } else {
            console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
            showErrorMsg(rpL(objs.data.code), "获取磁盘信息失败！");
        }
    });
}

function setDiskDetail(data){
    var $diskStatus = $("#disk_d_status");
    $diskStatus.removeClass("biology-red");
    $("#disk_d_name").html(data.volume_model.name);
    $("#disk_d_size").html(data.volume_model.size+"G");
    $("#disk_d_user").html(convertStr(data.volume_model.user));

    if(data.volume_model.status=="ExpireClose"){
        $diskStatus.addClass("biology-red");
    }
    $diskStatus.html(rpL(data.volume_model.status));
    //$("#disk_d_ins_id").html(data.volume_model.instance_id);
    var hostname=(data.volume_model.instance_name==""||data.volume_model.instance_name==null)?"无":data.volume_model.instance_name;
    $("#disk_d_ins_name").html(hostname);
    //var ip=(data.volume_model.instance_ip==""||null)?"无":data.volume_model.instance_ip;
    $("#disk_d_type").html(data.volume_model.type);
    $("#disk_d_createT").html(data.volume_model.created_at);
    if(data.volume_model.endTime){
        $("#disk_d_expiredT").html(new Date(data.volume_model.endTime).Format("yyyy-MM-dd hh:mm:ss"));
    } else {
        $("#disk_d_expiredT").html("--");
    }

    disableRightKey();
    $("#disk_d_modal").modal("show");
}

/**
 *磁盘扩容
 */
function expandDiskSize(volumeId){

    var regionId = $("#regionList_disk a.btn-primary").attr("id");
    var data = {
        data:{
            volumeId:volumeId,
            regionId:regionId,
            callback:setVolumeSizeChangeModal
        }
    };

    getDiskDetail(data);
}

var oDiskManager;
function  setVolumeSizeChangeModal(data){
    var regionId = $("#regionList_disk a.btn-primary").attr("id2");


    doPost("/action/product/findProduct", {"billCycle": 1, regionId: regionId}, function (datas) {
        if (datas.httpCode == "200") {
            if (datas.data.disk == undefined || datas.data.disk == null) {
                showErrorMsg("该地域下无可用带宽产品", "请联系系统管理员");
            } else {
                $("#diskSize_change_modal").modal("show");
                $("#diskSize_change_volumn").text(data.volume_model.name);
                $("#diskresourceId").val(data.volume_model.volume_id);
                $("#diskSize_change_region").text($("#regionList_disk").find("a.btn-primary").text());

                for(var i = 0; i < datas.data["disk"].length; i++){
                    if(datas.data.disk[i].diskOffering.diskOfferingUuid == data.volume_model.diskOfferingId){
                        var unitArrayDisk = [datas.data.disk[i].unitCountMin,datas.data.disk[i].unitCountMax];
                        $("#diskIdInput").val(datas.data.disk[i].id);
                        break;
                    }
                }
                $("#diskSize_change_modal").on("shown.bs.modal",function(){
                    //初始化带宽slider
                    oDiskManager = initHardDiskSlider();

                    oDiskManager.init(datas.data.disk,unitArrayDisk,data.volume_model.size,function(){
                        //_this.setCost();
                        $("#hard-disk-value").attr("minValue",data.volu_model.size);
                        $("#hard-disk-value").val(data.volu_model.size);
                    });
                });

            }
        } else {
            showErrorMsg("获取带宽产品信息失败", rpLRespond(datas.message));
        }

    });
}
function confirmExpandSize(){
    var resourceId =  $("#diskresourceId").val(),
        regionId = $("#regionList_disk a.btn-primary").attr("id2"),
        diskSize = $("#hard-disk-value").val();

    doPost("/action/volume/resizeVolume",
        {
            "volumeId":resourceId,
            "regionId":regionId,
            "volumeSize":diskSize
        },
        function (objs) {
            if(objs.httpCode == "200"){
                showMsg("操作成功","配置变更成功");
                $("#diskSize_change_modal").modal("hide");
            }else if(objs.httpCode == "400"){
                showErrorMsg("变更失败",rpLRespond(objs.message));
            }else{
                showErrorMsg("变更失败",rpLRespond(objs.message));
            }
        }

    );
}
/**
 *磁盘挂载
 */
function showUpDisk(){
    if(all_disk_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    openInstancListForDisk();
    //$("#btn_disk_up").addClass('disabled');
    disableRightKey();
    $("#disk_up_modal").modal("show");
}


function up_disk_ins_list_onchange(){
    var currentUser = $("#up_disk_ins_list").val();
    var params={
        "url":"/action/instance/findInstanceListByUser",
        "data":{"user":currentUser,
            "offset":"0",
            "limit":"10000000"}
    };
    openInstancListForDisk(params);
}

function openInstancListForDisk(){
    var disk_ins = document.getElementById("disk_insList").options;
    clearOptions(disk_ins);
    var $instanceListSpan = $("#s2id_disk_insList a span");
    $instanceListSpan.text("---正在加载中---");
    doPost("/action/instance/findInstanceList",{"regionId":sel_disk_region_id},function(objs){
        if (objs.httpCode == "200"&&objs.code=="Success") {
            var data = objs.data.instanceAllList;
                if (data!=null&&data.length > 0) {
                    clearOptions(disk_ins);
                    $instanceListSpan.text("---请选择---");
                    addOption(disk_ins, "---请选择---", "");
                    for (var i = 0; i < data.length; i++) {

                        addOption(disk_ins, data[i].hostname+"("+convertStr(data[i].public_ip)+")", data[i].instance_id);
                    }
                } else {
                    $instanceListSpan.text("---当前无云主机---");
                    addOption(disk_ins, "---当前无云主机---", "");
                }
                // callback();
        } else {
            showErrorMsg(rpL(objs.code), "获取云主机列表失败！");
            console.log("code :" + objs.code + "  msg:" + objs.message);
        }
    });
}
/**
 * 确认挂载磁盘
 */
function upDisk(){
        if(all_disk_data==null){
            showErrorMsg("","请选中一行。");
            return;
        }
        var ins = $("#disk_insList").val();
        if (ins == "" || ins == null) {
            showErrorMsg("", "云主机ID不能为空");
            return;
        }
        if (sel_disk_row_id == "" || sel_disk_row_id == null) {
            showErrorMsg("", "磁盘ID不能为空");
            return;
        }
        $("#btn_diskUp_confirm").addClass('disabled');
        doPost("/action/volume/attachVolume",{"volumeId":sel_disk_row_id,"instanceId":ins,"regionId":sel_disk_region_id}, function (objs) {
        $("#disk_up_modal").modal('hide');
        if (objs.httpCode == "200"&&objs.code=="Success") {
            if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                showMsg("操作成功", "成功挂载磁盘！");
                refreshDisk();
            }else{
                showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
            }
        } else {
            $("#btn_diskUp_confirm").removeClass('disabled');
            $("#btn_disk_up.accessible").removeClass('disabled');
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg(rpL(objs.code), rpLRespond(objs.message));
        }
    });
}

/**
 * 云主机列表验证
 */

function changeInstanceList(){
    var instanceId = $("#disk_insList").val();
    var $diskUpConfirm = $("#btn_diskUp_confirm");
    $diskUpConfirm.removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    if(instanceId==null||instanceId==""){
        $("#disk_insList_block").html("请选择云主机");
        $("#disk-up-ins").removeClass('has-success').addClass('has-error');
        $diskUpConfirm.removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }else{
        doPost("/action/instance/findInstanceDetail", {"instanceId":instanceId,"regionId":sel_disk_region_id}, function (objs) {
            if (objs.httpCode == "200"&&objs.code=="Success") {
                if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                    if(convertStr(objs.data.instance_model.status)=="ACTIVE"){
                        $("#disk_insList_block").html("");
                        $diskUpConfirm.addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
                    }
                    else{
                        showMsg("不可操作","云主机处于"+rpL(objs.data.instance_model.status)+"状态，请稍后重试!");
                    }
                }
                else{
                    showErrorMsg(rpL(objs.data.code), rpL(objs.data.message));
                    console.log("code :" + objs.data.code + "  msg:" + objs.data.message);
                }
            }
            else {
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg(rpL(objs.code), "获取云主机状态失败。");
            }
        })
    }
}


/**
 *磁盘卸载
 */
function downDisk(){
    if(all_disk_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_disk_row_id==""||sel_disk_row_id==null){
        showErrorMsg("","磁盘ID不能为空");
        return;
    }
        $("#btn_disk_down").addClass('disabled');
    showConfirm("fa-sign-out", "卸载磁盘", "是否要卸载磁盘?", function () {
        doPost("/action/volume/detachVolume",{"volumeId":sel_disk_row_id,"regionId":sel_disk_region_id},function (objs) {
            if (objs.httpCode == "200"&&objs.code=="Success") {
                if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                    showMsg("操作成功", "成功卸载磁盘!");
                    $("#btn_diskUp_confirm").removeClass('disabled');
                    refreshDisk();
                }else{
                    showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                }
            } else {
                $("#btn_disk_down").removeClass('disabled');
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg(rpL(objs.code), "卸载磁盘失败！");
            }
        });
    });
}

//删除磁盘
function deleteDisk(){
    if(all_disk_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_disk_row_id==""||sel_disk_row_id==null){
        showErrorMsg("","磁盘ID不能为空");
        return;
    }
        showConfirm("fa-trash-o", "删除磁盘", "是否要删除磁盘?", function () {
            $("#btn_disk_delete").addClass('disabled');
            doPost("/action/volume/deleteVolume",{"volumeId":sel_disk_row_id,"regionId":sel_disk_region_id},function (objs) {
                if (objs.httpCode == "200"&&objs.code=="Success") {
                    if(objs.data.httpCode == "200"&&objs.data.code=="Success") {
                        showMsg("操作成功", "成功删除磁盘！");
                        refreshDisk();
                    }else{
                        showErrorMsg(rpL(objs.data.code), rpLRespond(objs.data.message));
                    }
                } else {
                    console.log("code :" + objs.code + "  msg:" + objs.message);
                    showErrorMsg(rpL(objs.code), "删除磁盘失败！");
                }
            });
        });
}

//重建磁盘
function reconstructdisk(){

    if(all_disk_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_disk_row_id==null || sel_disk_row_id==""){
        showErrorMsg("","磁盘ID不能为空。");
        return;
    }
    showConfirm("fa-play", "重建磁盘", "重建之后用户数据将丢失，是否重新创建磁盘?", function () {
        $("#btn_disk_create").addClass('disabled');
        showMsgs("操作成功", "正在重建云主机...", function (obj) {
            doPost("/action/volume/reconstructVolume", {"volumeId":sel_disk_row_id,"regionId":sel_disk_region_id}, function (objs){
                if (objs.httpCode == "200") {
                    if((objs.data.toString()=="true")) {
                        showMsg("操作成功", "重新创建磁盘成功，请稍后查看列表。");
                        refreshDisk();
                    }
                    else{
                        $("#btn_disk_create").removeClass('disabled');
                        showErrorMsg("创建失败", "系统异常");
                    }
                } else {
                    $("#btn_disk_create").removeClass('disabled');
                    console.log("code :" + objs.code + "  msg:" + objs.message);
                    showErrorMsg(rpL(objs.code), "重新创建磁盘失败。");
                }
            });
        });
    });
}

/**
 * 创建磁盘快照
 */


function createOrderDiskSnap(){
    setDisabled($("#btn_disksnap_create"));
    var total=$("#disk_createSnap_totalPrice").val();
    var name=$("#disk_createSnap_name").val();
    if(convertStr(total)==""){
        total=0;
    }
//    showConfirm("fa-sign-out", "创建磁盘快照", "是否要创建磁盘快照?", function () {
    doPost("/action/orderInfo/createVolumeSnapshot", {"resourceId": sel_disk_row_id, "regionId": sel_disk_region_id, totalPrice: total, snapshotName: name, resourceType: 4, billCycle: 12, productId: 6, count: 1}, function (objs) {
        if (objs.httpCode == "200") {
            if (objs.httpCode == "200" && objs.code == "Success") {
                $("#disk_createSnap_modal").modal("hide");
                showMsg("操作成功", "正在创建磁盘快照。");
                refreshDisk();
            } else {
                if (objs.code == "Resource.NotFound" && objs.message.indexOf("VolumeDetail") >= 0) {
                    showErrorMsg(rpL(objs.code), rpL("磁盘不存在"));
                } else {
                    showErrorMsg(rpL(objs.code), rpLRespond(objs.message));
                    console.log("code :" + objs.code + "  msg:" + objs.message);
                }
            }
        } else {
            showErrorMsg(rpL(objs.code), rpLRespond(objs.message));
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg(rpL(objs.code), "创建快照失败。");
        }
    });
//    });

}



function getSyncOfferingListByRegion(){
    $("#update_Offering_list_table").empty().append(" <table id='update_Offering_table' class='table table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'>"+
        "<thead id='update_Offering_thead'>"+
        "    <tr class='talign_c' role='row'>"+
        "        <th></th>"+
        "        <th class='talign_c'>磁盘类型名称</th>"+
        "        <th class='talign_c'>操作</th>"+
        "    </tr>"+
        "    </thead>"+
        "<tbody id='update_Offering_tbody'>"+
        "    <tr class='odd'><td class='dataTables_empty' valign='top' colspan='3' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"+
        "</tbody>"+
        "</table>");
    var regionId  = $("#regionList_disk .btn-primary").attr('id');
    doPost("/action/systemDiskOffering/findSyncCustomDiskOfferings",{regionId:regionId},function(objs){
        if(objs.httpCode == "200" && objs.data){
            var str = "";
            if((objs.data.Deleted == undefined || objs.data.Deleted.length == 0) && (objs.data.Created == undefined  || objs.data.Created.length == 0)){
                showMsg("操作成功","没有需要同步的数据");
                return true;
            }else{
                if( objs.data.Deleted){
                    for(var i = 0 ; i < objs.data.Deleted.length ; i++){
                        str += "<tr><td class='text-center' style='width: 18px;'><label class='checkbox'><input type='checkbox' onclick=\"setUpdateOfferingSel(this,'" + objs.data.Deleted[i].diskOfferingUuid + "','0')\"><i></i></label></td>" +
                            "<td class='text-center' dataID='"+ objs.data.Deleted[i].diskOfferingUuid +"'>" + objs.data.Deleted[i].name + "</td>" +
                            "<td class='text-center'>待删除</td>" +
                            "</tr>";
                    }
                }
                if(objs.data.Created){
                    for(var i = 0 ; i < objs.data.Created.length ; i++){
                        str += "<tr><td class='text-center'  style='width: 18px;'><label class='checkbox'><input type='checkbox' onclick=\"setUpdateOfferingSel(this,'" + objs.data.Created[i].diskOfferingUuid + "','1')\"><i></i></label></td>" +
                            "<td class='text-center' dataID='"+ objs.data.Created[i].diskOfferingUuid +"'>" + objs.data.Created[i].name + "</td>" +
                            "<td class='text-center'>待新增</td>" +
                            "</tr>";
                    }
                }

                $("#update_Offering_tbody").empty().append(str);
                $("#update_Offering_table_modal").modal("show");
                runUpdateOfferingDataTables();
            }
        }else{
            console.log("code:"+objs.code+", message:"+objs.message);
            showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
        }
    });

}

var updateOfferingTable;
function runUpdateOfferingDataTables(){
    updateOfferingTable = $("#update_Offering_table").dataTable({
        "bDestroy":true,
        "bRetrieve":true,
        "sPaginationType" : "bootstrap_full",
        "aaSorting": [[ 1, "desc" ]],
        "sRowSelect": "multiple",
        "bFilter": false,
        "bLengthChange": false,
        "aoColumnDefs": [
            { "sWidth": "20px", "aTargets": [ 0 ] }
        ],
        "oLanguage": {
            "sFilter":"搜索",
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
    updateOfferingIdDeleteList = [];
    updateOfferingIdCreateList = [];
}
var updateOfferingIdDeleteList = [],updateOfferingIdCreateList = [];
function setUpdateOfferingSel(obj,id,type){
    if(type == "0"){
        if(updateOfferingIdDeleteList.indexOf(id) >= 0){
            arrayDelete(updateOfferingIdDeleteList,id);
        }else{
            updateOfferingIdDeleteList.push(id);
        }
    }else{
        if(updateOfferingIdCreateList.indexOf(id) >= 0){
            arrayDelete(updateOfferingIdCreateList,id);
        }else{
            updateOfferingIdCreateList.push(id);
        }
    }
}

function confirmOperationOfferingModal(){
    $("#update_Offering_table_modal").modal("hide");
    $("#confirm_update_Offering_table_modal").modal("show");
    var deleteStr = "", createStr = "";
    for(var i = 0 ; i < updateOfferingIdDeleteList.length ; i++){
        deleteStr += '<div>'+ $('td[dataId="'+updateOfferingIdDeleteList[i] +'"]').text()+'</div>';
    }
    deleteStr = deleteStr == ""?"无":deleteStr;

    $("#deleteOfferingList").empty().append(deleteStr);
    for(var i = 0 ; i < updateOfferingIdCreateList.length ; i++){
        createStr += '<div>'+ $('td[dataId="'+updateOfferingIdCreateList[i] +'"]').text()+'</div>';
    }
    createStr = createStr == ""?"无":createStr;
    $("#createOfferingList").empty().append(createStr);

}

function returnUpdateOfferingTableList(){
    $("#confirm_update_Offering_table_modal").modal("hide");
    $("#update_Offering_table_modal").modal("show");
}

function doSyncOfferingListByRegion(){
    var regionId  = $("#regionList_disk .btn-primary").attr('id');
    doPost("/action/systemDiskOffering/syncDiskOfferingWithBs",
        {
            regionId:regionId,
            deletedOfferingIds:updateOfferingIdDeleteList.join(","),
            createdOfferingIds:updateOfferingIdCreateList.join(",")
        },
        function(objs){
            if(objs.httpCode == "200"){
                if(objs.data){
                    showMsg("操作成功","数据同步完成");
                    $("#confirm_update_Offering_table_modal").modal("hide");

                }else{
                    console.log("code:"+objs.code+", message:"+objs.message);
                    showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
                }
            }else{
                console.log("code:"+objs.code+", message:"+objs.message);
                showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
            }
        });
}

