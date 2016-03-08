
/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:订单
 */
var userLogTable;
var userLogValue;

var userLogOperateLogColIndex = [
    "idcManager",
    "idcManager",
    "module",
    "action",
    "description",
    "createTime"
];

function loaduserLogTable() {
    //  loadURL("../../static/cniaas/userLog.html",$("#content_test"));

    $("#userLog_list_table").empty().append("<table id='userLog-table'  style='border-top: 1px solid #CCC;'  class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='userLog-thead' class='' style='border-top: 1px solid #CCC;'></thead><tbody id='userLog-tbody' class='table-tbody'></tbody></table>");
    $("#userLog-thead").empty().append(
            "<tr>" +
            "<th class='table-thead text-center' width='5%'>" + rpL("number") + "</th>" +
            "<th class='table-thead text-center' width='20%'>" + rpL("userEmail") + "</th>" +
            "<th class='table-thead text-center' width='15%'>" + rpL("model") + "</th>" +
            "<th class='table-thead text-center' width='15%'>" + rpL("action") + "</th>" +
            "<th class='table-thead text-center' width='15%'>" + rpL("action_resource") + "</th>" +
            "<th class='table-thead text-center' width='15%'>" + rpL("log-description") + "</th>" +
            "<th class='table-thead text-center' width='15%'>" + rpL("createTime") + "</th>" +
            "</tr>");

    var loadStr = "<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#userLog-tbody").empty().append(loadStr);
    userLogTableInit();
}
function userLogTableInit(){
    userLogTable=$("#userLog-table").dataTable({
        "bDestroy":true,
        "iDisplayLength" : 10,
        "bAutoWidth": true,
        "bServerSide": true,
        "sPaginationType" : "bootstrap_full",
        "aaSorting": [[ 6, "desc" ]],
//            "aaSorting": [[ 7, "desc" ]],
        "sAjaxDataProp":"datas",
     /*   'bSort':false,*/
        "sRowSelect": "single",
        "sAjaxSource": "/action/userOperateLog/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "createTime",sort = "desc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = userLogOperateLogColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }
            var pageNo = '', pageSize = '';
            for(var i=0;i<aoData.length;i++) {
                if(aoData[i].name === "iDisplayLength"){
                    pageSize = aoData[i].value;
                }
            }

            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#userLog_filter_type").html();
            var keyword = $("#userLogValue").val()?$("#userLogValue").val():"";
            if(type == "createTime"){
                keyword = getStartEndTime($("#userLog_startDate").val(),$("#userLog_endDate").val());
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
            var email="-";
            if(convertStr(aData.account)!=""){
                email=aData.account.email;
            }
            var resourceName="-";
            if(convertStr(aData.resourceName)!=""){
                resourceName=aData.resourceName
            }
            str += "<td class='text-center'>"+(++iDisplayIndex)+"</td>"+
                "<td class='text-center'>"+email+"</td>"+
                "<td class='text-center'>"+rpL(aData.module)+"</td>"+
                "<td class='text-center'>"+rpL(aData.action) +"</td>"+
                "<td class='text-center'>"+resourceName +"</td>"+
                "<td class='text-center' style='text-align:left;'>"+rpL(aData.description) +"</td>"+
                "<td class='text-center'>"+ createTime +"</td>";
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
    $("#userLog_list_table .dataTables_length").remove();
//        $("#userLog_list_table .dataTables_filter").remove();
    $("#userLog_list_table .dataTables_filter").empty().css("left","5px").css("margin-top","1px").append( '<div class="input-group">'+
//            '     <a style="float: left;" id="btn_userLog_refresh" class="btn btn-default" href="javascript:void(0);" onclick="userLogloadDataTableScripts()"><i class="fa fa-refresh"></i> 刷新</a>'+
        '    <div class="input-group-btn">'+
        '    <button id="userLog_filter-column-name" type="button" class="btn btn-default" tabindex="-1" style="height: 32px;">全部</button>'+
        '    <button style="height: 32px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="userLog_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        '    <li><a onclick="userLog_filter_column_onchange(this)" value="account"  href="javascript:void(0);">客户邮箱</a></li>'+
        '    <li><a onclick="userLog_filter_column_onchange(this)" value="createTime" href="javascript:void(0);">创建时间</a></li>'+
        '    <li><a onclick="userLog_filter_column_onchange(this)" value="instance" href="javascript:void(0);">实例名称</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="userLog_filter_value_select">' +
//        '<input style="height: 32px;width: 160px;" id="userLogValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div>');

    getKeydownAndKeyupInterval("userLogValue",500,execuserLogSearch);

}

function execuserLogSearch() {
    var data = userLogTable.fnSettings();
    userLogValue = $("#userLogValue").val();
    //$("#userLog_list_table .dt-bottom-row").remove();
    userLogTable.fnDraw();
}
function userLogExecFilter(){
    var data = userLogTable.fnSettings();
    //$("#userLog_list_table .dt-bottom-row").remove();
    userLogTable.fnDraw();
}

function userLog_filter_column_onchange(_this){
    var value = String($(_this).attr("value"));
    $("#userLog_filter-column-name").html($(_this).html());
    userLog_filter_value_select(value);
    $("#userLog_filter_type").html(value);
}

function userLog_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#userLog_filter_value_select").empty();
            $("#userLog_filter_type").html("");
            userLogExecFilter();
            break;
        case "account":
            $("#userLog_filter_value_select").empty().append('<input id="userLogValue" class="form-control col-sm-1" style="width: 160px;" type="text"  placeholder="邮箱">');
            break;
        case "createTime":{

            $("#userLog_filter_value_select").empty().append(
                    '<input  id="userLog_startDate" type="text" class="form-control" placeholder="起始时间" style="width: 120px;height: 32px;">' +
                    '<span class="col-sm-1" style="width:20px;margin-left: 1px;margin-top:10px;">--</span>'+
                    '<input  id="userLog_endDate" type="text" class="form-control" placeholder="截止时间" style="width: 120px;margin-left: 158px;margin-top:-32px;height: 32px;">');

//            $(".dataTables_filter .input-group").css("width","100%");

            // START AND FINISH DATE
            $('#userLog_startDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#userLog_endDate').datepicker('option', 'minDate', selectedDate);
                    userLogExecFilter();
                }
            });

            $('#userLog_endDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#userLog_startDate').datepicker('option', 'maxDate', selectedDate);
                    userLogExecFilter();
                }
            });

            break;
        }
        case "status":
            $("#userLog_filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="userLogValue"  value="" onchange="userLogExecFilter()">'+
                '<option value="">全部</option>'+
                '<option value="used">使用</option>'+
                '<option value="notUsed">未使用</option>'+
                '<option value="expired">已过期</option>'+
                '</select>');
            break;
        case "instance":
            $("#userLog_filter_value_select").empty().append('<input id="userLogValue" class="form-control col-sm-1" style="width: 160px;" type="text"  placeholder="实例名称">');
            break;
    }

    getKeydownAndKeyupInterval("userLogValue",500,execuserLogSearch);
    getKeydownAndKeyupInterval("userLog_startDate",500,execuserLogSearch);
    getKeydownAndKeyupInterval("userLog_endDate",500,execuserLogSearch);

}

