/**
 * Created by songxiaoguang on 2014/11/10.
 */


/**
 * 地域列表
 */
function listRegionsFromHost(){
    doPost("/action/region/findRegionList",{},function(objs){
        if(objs.httpCode == "200") {
            var data = objs.data,str = "";
            if(data==null||data.length<=0){
                showErrorMsg("","获取地域列表失败！");
                return;
            }
            for(var i=0;i<data.length;i++){
                str +=" <a onclick=\"loadHost('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
            }
            $("#regionList_host").empty().append(str).show();
            $("#toolbar_host").show();
            $("#widget-grid-host").show();
            loadHost(data[0].regionUuid);//加载第一个
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
            showErrorMsg("","获取地域列表失败");
        }

    });
}

//切换地域
function loadHost(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    hostloadData(id)
}

var sel_host_row_id = "",
    sel_host_row_ip="",
    sel_region_id_host="",
    all_host_data,
    hostTable;
function sethostSel(obj,hostname,ip){

    sel_region_id_host = $("#regionList_host .btn-primary").attr('id');

    var obj_checked = obj.checked;
    $("#host_table input[name='cbx_host_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != hostname)
        sel_host_row_id = hostname;
        sel_host_row_ip = ip;
        all_host_data = hostTable.fnGetData(obj.parent);
        $("#btn_host_monitor").removeClass('disabled');
    }else{
        sel_host_row_id = "";
        sel_host_row_ip = "";
        all_host_data = null;
        $("#btn_host_monitor").addClass('disabled');
    }
}

//刷新
function refreshHosts(){
    var regionId  = $("#regionList_host .btn-primary").attr('id');
    hostloadData(regionId);
}

/**
 * 加载数据
 */
function hostloadData(regionId) {
    $("#btn_host_delete,#btn_host_open,#btn_host_close,#btn_host_monitor").addClass('disabled');
    all_host_data = null;
    sel_host_row_id = "";
    $("#host_list_table").empty().append("<table id='host_table' class='table table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='host_thead'></thead><tbody id='host_tbody'></tbody></table>");
    $("#host_thead").empty().append(
            "<tr class='talign_c'><th></th>"+
            "<th class='talign_c'>"+"物理主机名"+"</th>"+
            "<th class='talign_c'>"+"IP"+"</th>"+
            "<th class='talign_c'>"+"状态"+"</th>"+
            "<th class='talign_c'>"+"CPU(核)"+"</th>"+
            "<th class='talign_c'>"+"内存(GB)"+"</th>"+
           // "<th class='talign_c'>"+"磁盘空间(GB)"+"</th>"+
            "<th class='talign_c'>"+"云主机个数"+"</th>"+
            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='7' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#host_tbody").empty().append(loadStr);
    runhostDataTables(function(){
        hostTable = $("#host_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 8, "desc" ]],
            "sRowSelect": "single",
            "fnDrawCallback": function( ) {
                $("#host_table input").prop("checked",false);
                $("#tr_host_"+sel_host_row_id).prop("checked",true);
            },
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
    },regionId);
}
function runhostDataTables(callback,regionId) {
        doPost("/action/host/findHostList",{"regionId":regionId}, function (objs) {
            if (objs.httpCode == "200"&&objs.code=="Success"&&objs.data.node_list!=null) {
                    var str = "";
                    for (var i = 0; i < objs.data.node_list.length; i++) {
                        str +="<tr>" +
                            "<td class='text-center'><label class='checkbox'><input id='tr_host_"+ objs.data.node_list[i].hostname +"' type='checkbox' name='cbx_host_list' onclick=\"sethostSel(this,'" + objs.data.node_list[i].hostname + "','" + objs.data.node_list[i].ip + "')\"><i></i></label></td>" +
                            "<td class='text-center'>" + objs.data.node_list[i].hostname + "</td>" +
                            "<td class='text-center'>" + objs.data.node_list[i].ip + "</td>" +
                            "<td class='text-center'>" + rpL(objs.data.node_list[i].status) + "</td>" +
                            "<td class='text-center'>" + objs.data.node_list[i].vcpusUsed+ "/" +objs.data.node_list[i].vcpusTotal + "</td>" +
                            "<td class='text-center'>" + objs.data.node_list[i].ramMbUsed + "/" + objs.data.node_list[i].ramMbTotal+ "</td>" +
                            //"<td class='text-center'>" + objs.data.node_list[i].vcpusUsed + "/" + objs.data.node_list[i].disk_gb_total + "</td>" +
                            "<td class='text-center'>" + objs.data.node_list[i].instanceCount + "</td>" +
                            "</tr>";
                    }
                    $("#host_tbody").empty().append(str);
            } else {
                var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
                $("#host_tbody").empty().append(loadStr);
                console.log("code :" + objs.code + "  msg:" + objs.data.message);
                showErrorMsg(rpL(objs.data.code),rpLRespond(objs.data.message));
                return function () {
                };
            }
            $("#host_thead").show();
            callback();
        });
}




