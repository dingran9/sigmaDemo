/**
 * Created by Administrator on 2015/4/1.
 */

var sel_region_row_id = "",
    sel_region_row_ip="",
    sel_region_id_region="",
    sel_region_id_name="",
    all_region_data,
    regionTable;
function setRegionSel(obj,id,regionname){
    sel_region_id_region = $("#regionList_region .btn-primary").attr('id');

    var obj_checked = obj.checked;
    $("#region_table input[name='cbx_region_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id)
            sel_region_row_id = id;
            sel_region_id_name = regionname;
//            sel_region_row_ip = ip;
            all_region_data = regionTable.fnGetData(obj.parent);
            $("#btn_region_monitor,#btn_region_edit").removeClass('disabled');
    }else{
        sel_region_row_id = "";
        sel_region_row_ip = "";
        sel_region_id_name = "";
        all_region_data = null;
        $("#btn_region_monitor").addClass('disabled');
    }
}
/**
 * 加载数据
 */
function regionloadData() {
    $("#btn_region_delete,#btn_region_open,#btn_region_close,#btn_region_monitor").addClass('disabled');
    all_region_data = null;
    sel_region_row_id = "";
    $("#region_list_table").empty().append("<table id='region_table' class='table table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='region_thead'></thead><tbody id='region_tbody'></tbody></table>");
    $("#region_thead").empty().append(
            "<tr class='talign_c'><th></th>"+
            "<th class='talign_c'>"+rpL("regionName")+"</th>"+
            "<th class='talign_c'>"+rpL("state")+"</th>"+
            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='2' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#region_tbody").empty().append(loadStr);
    runregionDataTables(function(){
        regionTable = $("#region_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 8, "desc" ]],
            "sRowSelect": "single",
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
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
    });
}
function runregionDataTables(callback) {
    doPost("/action/region/findRegionList",{},function(objs){
        if (objs.httpCode == "200"&&objs.code=="Success") {
            var str = "";
            for (var i = 0; i < objs.data.length; i++) {
                var state = "可用";
                if(objs.data[i].available !== "Available"){
                    state = "不可用";
                }
                str +="<tr>" +
                    "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_region_list' onclick=\"setRegionSel(this,'" + objs.data[i].regionUuid + "','" + objs.data[i].name + "')\"><i></i></label></td>" +
                    "<td class='text-center'>" + objs.data[i].name + "</td>" +
                    "<td class='text-center'>" + state + "</td>" +
                    "</tr>";
            }
            $("#region_tbody").empty().append(str);
        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='2' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
            $("#region_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
            return function () {
            };
        }
        $("#region_thead").show();
        callback();
    });
}

function getSyncRegionList(){
    var regionId  = $("#regionList_region .btn-primary").attr('id');
    doPost("/action/region/findSyncRegionList",{regionId:regionId},function(objs){
        if(objs.httpCode == "200" && objs.data){
            var str = "";
            if((objs.data.Deleted == undefined || objs.data.Deleted.length == 0) && (objs.data.Created == undefined  || objs.data.Created.length == 0)){
                showMsg("操作成功","没有需要同步的数据");
                return true;
            }else{
                if( objs.data.Deleted){
                    for(var i = 0 ; i < objs.data.Deleted.length ; i++){
                        str += "<tr><td class='text-center' style='width: 18px;'><label class='checkbox'><input type='checkbox' onclick=\"setUpdateRegionSel(this,'" + objs.data.Deleted[i].regionUuid + "','0')\"><i></i></label></td>" +
                            "<td class='text-center' dataID='"+ objs.data.Deleted[i].regionUuid +"'>" + objs.data.Deleted[i].name + "</td>" +
                            "<td class='text-center'>待删除</td>" +
                            "</tr>";
                    }
                }
                if(objs.data.Created){
                    for(var i = 0 ; i < objs.data.Created.length ; i++){
                        str += "<tr><td class='text-center'  style='width: 18px;'><label class='checkbox'><input type='checkbox' onclick=\"setUpdateRegionSel(this,'" + objs.data.Created[i].regionUuid + "','1')\"><i></i></label></td>" +
                            "<td class='text-center' dataID='"+ objs.data.Created[i].regionUuid +"'>" + objs.data.Created[i].name + "</td>" +
                            "<td class='text-center'>待新增</td>" +
                            "</tr>";
                    }
                }

                $("#update_region_tbody").empty().append(str);
                runUpdateRegionDataTables();
                $("#update_region_table_modal").modal("show");
            }

        }else{
            console.log("code:"+objs.code+", message:"+objs.message);
            showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
        }
    });

}

function runUpdateRegionDataTables(){
    var updateRegionTable = null;
    updateRegionTable = $("#update_region_table").dataTable({
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
    updateRegionIdDeleteList = [];
    updateRegionIdCreateList = [];
}
var updateRegionIdDeleteList = [],updateRegionIdCreateList = [];
function setUpdateRegionSel(obj,id,type){
    if(type == 0){
        if(updateRegionIdDeleteList.indexOf(id) >= 0){
            arrayDelete(updateRegionIdDeleteList,id);
        }else{
            updateRegionIdDeleteList.push(id);
        }
    }else{
        if(updateRegionIdCreateList.indexOf(id) >= 0){
            arrayDelete(updateRegionIdCreateList,id);
        }else{
            updateRegionIdCreateList.push(id);
        }
    }
}



function confirmRegionOperationModal(){
    $("#update_region_table_modal").modal("hide");
    $("#confirm_update_region_table_modal").modal("show");
    var deleteStr = "", createStr = "";
    for(var i = 0 ; i < updateRegionIdDeleteList.length ; i++){
        deleteStr += '<div>'+ $('td[dataId="'+updateRegionIdDeleteList[i] +'"]').text() +'</div>';
    }
    deleteStr = deleteStr == ""?"无":deleteStr;
    $("#deleteRegionList").empty().append(deleteStr);
    for(var i = 0 ; i < updateRegionIdCreateList.length ; i++){
        createStr += '<div>'+ $('td[dataId="'+updateRegionIdCreateList[i] +'"]').text() +'</div>';
    }
    createStr = createStr == ""?"无":createStr;
    $("#createRegionList").empty().append(createStr);

}

function returnUpdateRegionTableList(){
    $("#confirm_update_region_table_modal").modal("hide");
    $("#update_region_table_modal").modal("show");
}

function doSyncRegionList(){
    doPost("/action/region/syncRegionWithBs",{deletedRegionIds:updateRegionIdDeleteList.join(","),createdRegionIds:updateRegionIdCreateList.join(",")},function(objs){
        if(objs.httpCode == "200"){
            if(objs.data){
                showMsg("操作成功","数据同步完成");
                $("#confirm_update_region_table_modal").modal("hide");
                regionloadData();
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
