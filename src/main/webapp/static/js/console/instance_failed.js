/**
 * Created by songxiaoguang on 2015/1/8.
 */

var sel_failed_ins_id,
    all_failed_ins_data,
    instanceFailedTable;
function setInFailedSel(obj,res_id){

    var obj_checked = obj.checked;
    $("#ins_failed_table input[name='cbx_failed_ins_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        sel_failed_ins_id = res_id;
        all_failed_ins_data = instanceFailedTable.fnGetData(obj.parent);
        $("#btn_failed_delete").removeClass('disabled');
    }else{
        sel_failed_ins_id = "";
        all_failed_ins_data = null;
        $("#btn_failed_delete").addClass('disabled');
    }
}

function initInstanceFailedBtnStatus(){
    $("#btn_failed_delete").addClass('disabled');
    all_failed_ins_data = null;
    sel_failed_ins_id = "";
}
function loadInstanceFailedData(params) {
    initInstanceFailedBtnStatus();
    $("#ins_failed_list_table").empty().append("<table id='ins_failed_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='ins_failed_thead' class='talign_c'></thead><tbody id='ins_failed_tbody'></tbody></table>");
    $("#ins_failed_thead").empty().append(
            "<tr>" +
            "<th class='talign_c' style = 'width:17px;'></th>"+
            "<th class='talign_c' style = 'width:10%'>"+rpL("account")+"</th>"+
            "<th class='talign_c' style = 'width:10%'>"+rpL("configure")+"</th>"+
            "<th class='talign_c' style = 'width:10%'>"+rpL("transaction-code")+"</th>"+
            "<th class='talign_c' style = 'width:15%'>"+rpL("serviceBeginTime")+"</th>"+
            "<th class='talign_c' style = 'width:15%'>"+rpL("create_time")+"</th>"+
            "<th class='talign_c' style = 'width:40%'>"+rpL("remark")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='8' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#ins_failed_tbody").empty().append(loadStr);
    runInstanceFailedDataTables(function(){
        instanceFailedTable = $("#ins_failed_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 5, "asc" ]],
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
            },
            "sDom" : "R<'dt-top-row'Clf>r<'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
            "fnInitComplete" : function(oSettings, json) {
                $('.ColVis_Button').addClass('btn btn-default btn-sm').html('显示列<i class="icon-arrow-down"></i>');
            }
        });
        afterTableLoad("instance_tab");
        /*$(".initPage #s2").removeClass("active").removeClass("in").css("visibility",'visible');
        $(".tab-content").removeClass("initPage");*/
    },params);
}

function runInstanceFailedDataTables(callback,params) {

    doPost(params.url,params.data,function (objs){
        var data = objs.data;
        if (objs.httpCode == "200"&& data!=null) {
            var str = "",serviceBeginTime = "--",createTime = "--";
            for (var i = 0; i < data.length; i++) {
                serviceBeginTime = "--";
                createTime = "--";
                if(data[i].serviceBeginTime){
                    serviceBeginTime = new Date(data[i].serviceBeginTime).Format("yyyy-MM-dd hh:mm:ss");
                }
                if(data[i].createTime){
                    createTime = new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss");
                }
                var bandWidth = (data[i].bandWidth ==""||data[i].bandWidth==null)?0:data[i].bandWidth;
                str +=
                    "<tr>" +
                    "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_failed_ins_list' " +
                    "onclick=\"setInFailedSel(this,'" + data[i].resource_id + "')\"><i></i></label></td>" +
                    "<td class='text-center'>" +data[i].user  + "</td>" +
                    "<td class='text-center'>" +
                        data[i].cpu+"核"+ "&nbsp"+
                        data[i].ram+"GB"+ "<br>"+
                        bandWidth+"Mbps"+
                    "</td>" +
                    "<td class='text-center'>" + data[i].orderNumber + "</td>" +
                    "<td class='text-center'>" + serviceBeginTime + "</td>" +
                    "<td class='text-center'>" + createTime + "</td>" +
                    "<td class='text-center'>" + data[i].instance_remark + "</td>" +
                    "</tr>";
            }
            $("#ins_failed_tbody").empty().append(str);
            //获取创建失败的个数
            $("#ins_failed_count").html(data.length);

        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
            $("#ins_failed_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            return function () {
            };
        }
        $("#ins_failed_thead").show();
        callback();
    });

}

//删除创建失败的云主机
function deleteInsFailed(){

    if(all_failed_ins_data==null){
        showErrorMsg("","请选中一行。");
        return;
    }
    if(sel_failed_ins_id==null || sel_failed_ins_id==""){
        showErrorMsg("","云主机ID不能为空。");
        return;
    }
    showConfirm("fa-play", "删除创建失败的云主机", "是否要删除这台创建失败的云主机?", function () {
        showConsoleMsgs("操作成功", "准备删除...", function (obj) {
            doPost("/action/instance/deleteFailedInstance", {"resourceId":sel_failed_ins_id}, function (objs){
                if (objs.httpCode == "200"&&objs.data==true) {
                    showMsg("操作成功", "成功删除创建失败的云主机。");
                    refreshInstanceFailed();
                } else {
                    showErrorMsg("", "删除创建失败的云主机云主机失败。");
                }
            });
        });
    });
}