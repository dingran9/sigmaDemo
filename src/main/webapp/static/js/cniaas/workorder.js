/**
 * Created by 20140616 on 2014/10/29.
 */
/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:订单
 */
var workorderTable;
var workorderValue;

var workOrderColIndex = [
    "createTime",
    "createTime",
    "title",
    "account",
    "account",
    "createTime",
    "status",
    "updateTime",
    "createTime"
];

function loadworkorderTable() {
    //  loadURL("../../static/cniaas/workorder.html",$("#content_test"));

    $("#workorder_list_table").empty().append("<table id='workorder-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='workorder-thead' class='' style='border-top: 1px solid #CCC;'></thead><tbody id='workorder-tbody' class='table-tbody'></tbody></table>");
    $("#workorder-thead").empty().append(
            "<tr>" +
            "<th class='table-thead'  style='width: 50px;'>" + rpL("number") + "</th>" +
//            "<th class='table-thead' style='display: none;'>"+rpL("id")+"</th>"+
            "<th class='table-thead'>" + rpL("workorder-code") + "</th>" +
            "<th class='table-thead' style='width: 22%;'>" + rpL("workorder-title") + "</th>" +
            "<th class='table-thead'>" + rpL("workorder-creator") + "</th>" +
            "<th class='table-thead'>" + rpL("workorder-replyer") + "</th>" +
            "<th class='table-thead'>" + rpL("createTime") + "</th>" +
            "<th class='table-thead'>" + rpL("workorder-status") + "</th>" +
            "<th class='table-thead'>" + rpL("workorder-closeTime") + "</th>" +
            "<th class='table-thead'>" + rpL("operation") + "</th>" +
            "</tr>");

    var loadStr = "<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#workorder-tbody").empty().append(loadStr);
    workorderTableInit();
}
function workorderTableInit(){
    workorderTable=$("#workorder-table").dataTable({
        "bDestroy":true,
        "bAutoWidth": true,
        "bServerSide": true,
        "sPaginationType" : "bootstrap_full",
        "aaSorting": [[ 5, "desc" ]],
//            "aaSorting": [[ 7, "desc" ]],
        "sAjaxDataProp":"datas",
        /*'bSort':false,*/
        "sRowSelect": "single",
        "sAjaxSource": "/action/workOrder/workOrderPageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "createTime",sort = "desc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = workOrderColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }

            var pageNo = '', pageSize = '';
            pageSize =  oSettings._iDisplayLength;

            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#workorder_filter_type").html();
            var keyword = $("#workorderValue").val()?$("#workorderValue").val():"";
            if(type == "createTime"){
                keyword = $("#workorder_startDate").val() + "|" + $("#workorder_endDate").val();
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
            var status='';
            var operation = "<a href='javascript:showWorkorderDetail(\""+ aData.workNumber +"\","+aData.id+")'> 详情</a>"
            endTime=convertStr(aData.updateTime)==""?"-":new Date(aData.updateTime).Format("yyyy-MM-dd hh:mm:ss");
            createTime=convertStr(aData.createTime)==""?"--":new Date(aData.createTime).Format("yyyy-MM-dd hh:mm:ss");
            accountEmail=convertStr(aData.account)==""?"--":aData.account.email;
            managerEmail=convertStr(aData.manager)==""?"--":aData.manager.email;

            str += "<td>"+(++iDisplayIndex)+"</td>"+
//                    "<td style='display: none'>"+aData.id+"</td>"+
                "<td class='pay-balance'>"+aData.workNumber+"</td>"+
                "<td class='pay-balance'>"+aData.title +"</td>"+
                "<td>"+accountEmail+"</td>"+
                "<td>"+managerEmail+"</td>"+
                "<td>"+createTime+"</td>"+
                "<td>"+ rpL(aData.status)  +"</td>"+
                "<td>"+ endTime  +"</td>"+
                "<td>"+ operation +"</td>";
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
        },
        "aoColumnDefs": [
            {
                bSortable: false,
                aTargets: [ 0,8 ]
            },
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    $(".dataTables_length").remove();
    $(".dataTables_filter").empty().css("left","0").append( '<div class="input-group">'+
        '    <div class="input-group-btn" style="left:5px;margin-top:1px;">'+
        '    <button id="workorder_filter_col_name" type="button" class="btn btn-default" tabindex="-1" style="height: 33px;">全部</button>'+
        '    <button style="height: 33px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="workorder_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        '    <li><a onclick="workorder_filter_column_onchange(this)" value="account"  href="javascript:void(0);">用户邮箱</a></li>'+
        '    <li><a onclick="workorder_filter_column_onchange(this)" value="work_number" href="javascript:void(0);">工单号</a></li>'+
        '    <li><a onclick="workorder_filter_column_onchange(this)" value="status"  href="javascript:void(0);">状态</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="filter_value_select" style="left: 5px; position: relative;">' +
//        '<input id="workorderValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div> ');
    getKeydownAndKeyupInterval("workorderValue",500,execworkorderSearch);

}

function execworkorderSearch() {
    var data = workorderTable.fnSettings();
    workorderValue = $("#workorderValue").val();
    //$("#workorder_list_table .dt-bottom-row").remove();
    workorderTable.fnDraw();
}

function workorderExecFilter(){
    var data = workorderTable.fnSettings();
    //$("#workorder_list_table .dt-bottom-row").remove();
    workorderTable.fnDraw();
}

function workorder_filter_column_onchange(_this){
    var value = String($(_this).attr("value"));
    $("#workorder_filter_col_name").html($(_this).html());
    workorder_filter_value_select(value);
    $("#workorder_filter_type").html(value);
}

function workorder_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#filter_value_select").empty();
            $("#workorder_filter_type").html("");
            workorderExecFilter();
            break;
        case "account":
            $("#filter_value_select").empty().append('<input id="workorderValue" class="form-control col-sm-1" style="width: 160px;" type="text">');
            $("#workorder_filter_type").html("account");
            break;
        case "title":{
            $("#filter_value_select").empty().append('<input id="workorderValue" class="form-control col-sm-1" style="width: 160px;" type="text">');
            $("#workorder_filter_type").html("title");
            break;
        }
        case "work_number":{
            $("#filter_value_select").empty().append('<input id="workorderValue" class="form-control col-sm-1" style="width: 160px;" type="text">');
            $("#workorder_filter_type").html("work_number");
            break;
        }
        case "status":
            $("#filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="workorderValue"  value="" onchange="workorderExecFilter()">'+
                '<option value="">全部</option>'+
                '<option value="Replied">已回复</option>'+
                '<option value="Replying">待回复</option>'+
                '<option value="Close">已关闭</option>'+
                '</select>');
            $("#workorder_filter_type").html("status");
            break;
    }

    getKeydownAndKeyupInterval("workorderValue",500,execworkorderSearch);
    getKeydownAndKeyupInterval("workorder_startDate_search_input",500,execworkorderSearch);
    getKeydownAndKeyupInterval("workorder_endDate_search_input",500,execworkorderSearch);

}

function showWorkorderDetail(workNumber,id){
    window.location.href = "#../../action/cniaas/workorder/workorderDetail.html?workNumber="+workNumber+"&id="+id;
}

/**
 * 初始化详情
 */
function initDetail(){
    getWorkorderDetail();
    getMessageList();
}
/**
 * 获取工单详情
 */
function getWorkorderDetail(){
    var id = getQueryStringWithHash("id");

    doPost("/action/workOrder/workOrderDetail",{id:id},function(objs){
        if(objs.httpCode == "200"){
            var createTime = new Date(objs.data.createTime).Format("yyyy-MM-dd hh:mm:ss");
            var status = "";
            switch (objs.data.status){
                case "Replying":
                    status = "未受理<small>（系统会尽快内受理）</small>";
                    break;
                case "Replyed":
                    status = "已受理<small>（客服人员正在耐心地与您沟通中...）</small>";
                    break;
                case "Close":
                    status = "已关闭<small>（感谢您的使用！）</small>";
                    break;
            }

            $("#detail-status").html(status);
            $("#detail-title").html(objs.data.title);
            $("#detail-createTime").html(createTime);
            $("#detail-number").html(objs.data.workNumber);
        }else{

        }
    });
}
/**
 * 获取对话记录
 */
function getMessageList(){
    var workNumber = getQueryStringWithHash
    ("workNumber");

    doPost("/action/workOrder/workOrderDetailByWorkNumber",{workNumber:workNumber},function(objs){
        if(objs.httpCode == "200"){
            var messageItem = "";
            var attach = "";
            for(var i=0;i<objs.datas.length;i++){
                var align = " right ";
                var people = "用户：";

                var updateTime = convertStr(objs.datas[i].createTime)==""?"-":new Date(objs.datas[i].createTime).Format("yyyy-MM-dd hh:mm:ss");
                if(objs.datas[i].manager == null || objs.datas[i].title != null ){
                    align = " right ";
                    people = "用户：";

                    if(objs.datas[i].attch != null  && objs.datas[i].attch.indexOf(".txt") > 0 ){
                        attach = "<br><a target='_blank' href=" + objs.datas[i].attch +" ><i class='fa fa-3x fa-file-text-o'></i></a>";
                    }else if(objs.datas[i].attch !== "" && objs.datas[i].attch !== null ){
                        attach = "<br><img class=thumbnail onclick=showAttachDetail(this) src="+ objs.datas[i].attch + "> ";
                    }else{
                        attach = "";
                    }
                }else{
                    attach = "";
                    align = " left "
                    people = "我：";
                }
                messageItem += "<div class='row'><div class='row popover fade in "+align+"'><div class='arrow' style='top: 43.8%;'></div><p>"+ people +objs.datas[i].content + attach +"</p><p class=update-time>" + updateTime + "</p></div></div></div>"

            }
            $("#messageBox").empty().append(messageItem);
            var e=document.getElementById("messageBox");
            e.scrollTop=e.scrollHeight;
            //工单状态
            var statusStr = "";
            switch (objs.datas[0].status){
                case "Replying":
                    statusStr = "待回复";
                    break;
                case "Replied":
                    statusStr = "已回复";
                    break;
                case "Close":
                    statusStr = "已关闭";
                    break;
            }

            if(objs.datas[0].status == "Close"){
                $("#replyDiv").hide();
            } else {
                $("#replyDiv").show();
            }

            $("#detail-status").empty().append(statusStr);
        }
    });
    $("#reply-message").val("");
}
/**
 * 回复工单
 */
function reply(){

    var workorderId = getQueryStringWithHash("id");
    var workNumber = getQueryStringWithHash("workNumber");
    var content = $("#reply-message").val();

    if($("#detail-status").html() == "已关闭"){
        showErrorMsg("不能回复","工单已关闭，不可再回复");
        return;
    }
    doPost("/action/workOrder/workOrderReply",
        {id:workorderId,workNumber:workNumber,content:content},function(objs){
        if(objs.httpCode == "200"){
            getMessageList();
            $("#reply-message").val("")
        }
    });

}
function showAttachDetail(_this){
    var src = $(_this).attr('src');
    var attachDetail = "";
    if(src.indexOf(".txt") > 0){
        /*doGet(src,{},function(objs){
            attachDetail = "<p>" + String(objs) +"</p>";
            $("#modalattachcontent").empty().append(attachDetail);
            $("#bigImage-modal").modal("show");
        });*/
    }else{
        attachDetail = '<img class="img img-responsive" src="'+ src +'">';
        $("#modalattachcontent").empty().append(attachDetail);
        $("#bigImage-modal").modal("show");
    }
}
