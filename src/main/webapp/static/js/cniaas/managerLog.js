
/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:订单
 */
var managerLogTable;
var managerLogValue;

var idcManagerOperateLogColIndex = [
    "idcManager",
    "idcManager",
    "module",
    "action",
    "description",
    "createTime"
];
function loadmanagerLogTable() {
    //  loadURL("../../static/cniaas/managerLog.html",$("#content_test"));

    $("#managerLog_list_table").empty().append("<table id='managerLog-table' style='border-top: 1px solid #CCC;' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='managerLog-thead' class='' style='border-top: 1px solid #CCC;'></thead><tbody id='managerLog-tbody' class='table-tbody'></tbody></table>");
    $("#managerLog-thead").empty().append(
            "<tr>" +
            "<th class='table-thead' width='5%'>" + rpL("number") + "</th>" +
            "<th class='table-thead' width='20%'>" + rpL("managerEmail") + "</th>" +
            "<th class='table-thead' width='15%'>" + rpL("model") + "</th>" +
            "<th class='table-thead' width='15%'>" + rpL("action") + "</th>" +
            "<th class='table-thead' width='30%'>" + rpL("description") + "</th>" +
            "<th class='table-thead' width='15%'>" + rpL("createTime") + "</th>" +
            "</tr>");

    var loadStr = "<tr class='odd'><td valign='top' colspan='6' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#managerLog-tbody").empty().append(loadStr);
    managerLogTableInit();
}
function managerLogTableInit(){
    managerLogTable=$("#managerLog-table").dataTable({
        "bDestroy":true,
        "iDisplayLength" : 10,
        "bAutoWidth": true,
        "bServerSide": true,
        "sPaginationType" : "bootstrap_full",
        "aaSorting": [[ 5, "desc" ]],
//            "aaSorting": [[ 7, "desc" ]],
        "sAjaxDataProp":"datas",
        /*'bSort':false,*/
        "sRowSelect": "single",
        "sAjaxSource": "/action/idcManagerOperateLog/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "idcManager",sort = "asc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = idcManagerOperateLogColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }
            var pageNo = '', pageSize = '';
            pageSize =  oSettings._iDisplayLength;

            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#managerLog_filter_type").html();
            var keyword = $("#managerLogValue").val()?$("#managerLogValue").val():"";
            if(type == "createTime"){
                keyword = getStartEndTime($("#managerLog_startDate").val(),$("#managerLog_endDate").val());
            }
            var data = {keyword:keyword,type:type,pageNo:pageNo,pageSize:pageSize,param:params,sort:sort};
            oSettings.qXHRj = doPost(sSource,data,fnCallback);
        },
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var data1=new Date();
            data1.getMilliseconds();
            var str = '';
            var createTime='-';
            createTime=convertStr(aData.createTime)==""?"-":new Date(aData.createTime).Format("yyyy-MM-dd hh:mm:ss");

            str += "<td>"+(++iDisplayIndex)+"</td>"+
                "<td >"+aData.idcManager.email +"</td>"+
                "<td>"+rpL(aData.module)+"</td>"+
                "<td>"+rpL(aData.action) +"</td>"+
                "<td>"+rpL(aData.description) +"</td>"+
                "<td>"+ createTime +"</td>";
            $(nRow).empty().append(str);
        },
        "oLanguage": {
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {"sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            },
            "sZeroRecords": "没有检索到数据",
            "sFilterPlace": "请输入关键词",
            "sProcessing": "<img src='/static/smartadmin/img/loading-image.gif' />"
        }
        ,
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
    $("#managerLog_list_table .dataTables_length").remove();
//        $("#managerLog_list_table .dataTables_filter").remove();
    var menu="";
    //console.log($("#manager-is-staff").html()=="IS_STAFF");
//    if($("#manager-is-staff").html()=="IS_STAFF"){
        menu= '<li><a onclick="managerLog_filter_column_onchange(this)" value="account"  href="javascript:void(0);">用户邮箱</a></li>';
//    }else{
//        menu="";
//    }
    $("#managerLog_list_table .dataTables_filter").empty().css("left","5px").css("margin-top","1px").append( '<div class="input-group">'+
        '    <div class="input-group-btn">'+
        '    <button id="managerLog_filter_name" type="button" class="btn btn-default" tabindex="-1" style="height: 32px;">全部</button>'+
        '    <button style="height: 32px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="managerLog_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        ''+menu+
        '    <li><a onclick="managerLog_filter_column_onchange(this)" value="createTime" href="javascript:void(0);">创建时间</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="managerLog_filter_value_select">' +
//        '<input style="height: 32px;width: 160px;" id="managerLogValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div>');
    getKeydownAndKeyupInterval("managerLogValue",500,execManagerLogSearch);
}
function execManagerLogSearch() {
    var data = managerLogTable.fnSettings();
    managerLogValue = $("#managerLogValue").val();
    //$("#managerLog_list_table .dt-bottom-row").remove();
    managerLogTable.fnDraw();
}

function managerLogExecFilter(){
    var data = managerLogTable.fnSettings();
    //$("#managerLog_list_table .dt-bottom-row").remove();
    managerLogTable.fnDraw();
}

function managerLog_filter_column_onchange(_this){
    var value = String($(_this).attr("value"));
    $("#managerLog_filter_name").html($(_this).html());
    managerLog_filter_value_select(value);
    $("#managerLog_filter_type").html(value);
}

function managerLog_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#managerLog_filter_value_select").empty();
            $("#managerLog_filter_type").html("");
            managerLogExecFilter();
            break;
        case "account":
            $("#managerLog_filter_value_select").empty().append('<input id="managerLogValue" class="form-control col-sm-1" style="width: 160px;" type="text"  placeholder="邮箱">');
            break;
        case "createTime":{

            $("#managerLog_filter_value_select").empty().append(
                    '<input  id="managerLog_startDate" type="text" class="form-control" placeholder="起始时间" style="width: 120px;height: 32px;">' +
                    '<span class="col-sm-1" style="width:20px;margin-left: 1px;margin-top:10px;">--</span>'+
                    '<input  id="managerLog_endDate" type="text" class="form-control" placeholder="截止时间" style="width: 120px;margin-left: 158px;margin-top:-32px;height: 32px;">');

//            $(".dataTables_filter .input-group").css("width","100%");

            // START AND FINISH DATE
            $('#managerLog_startDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#managerLog_endDate').datepicker('option', 'minDate', selectedDate);
                    managerLogExecFilter();
                }
            });

            $('#managerLog_endDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#managerLog_startDate').datepicker('option', 'maxDate', selectedDate);
                    managerLogExecFilter();
                }
            });

            break;
        }
        case "status":
            $("#managerLog_filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="managerLogValue"  value="" onchange="managerLogExecFilter()">'+
                '<option value="">全部</option>'+
                '<option value="used">使用</option>'+
                '<option value="notUsed">未使用</option>'+
                '<option value="expired">已过期</option>'+
                '</select>');
            break;
    }

    getKeydownAndKeyupInterval("managerLogValue",500,execManagerLogSearch);
    getKeydownAndKeyupInterval("managerLog_startDate",500,execManagerLogSearch);
    getKeydownAndKeyupInterval("managerLog_endDate",500,execManagerLogSearch);


}

