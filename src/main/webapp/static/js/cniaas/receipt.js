/**
 * Created by Zhangly on 2014/9/26.
 */
var receiptTable;
var receiptValue;

var receiptColIndex = [
    "updateTime",
    "amount",
    "receiptType",
    "receiptTitle",
    "status",
    "receiptAmountY",
    "receiptAmountN",
    "account",
    "createTime",
    "updateTime"
];

function loadreceiptTable() {

    $("#receipt_list_table").empty().append("<table id='receipt-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='receipt-thead' class='' style='border-top: 1px solid #CCC;'></thead><tbody id='receipt-tbody' class='table-tbody'></tbody></table>");
    $("#receipt-thead").empty().append(
            "<tr>" +
            "<th class='table-thead' width='5%'>" + rpL("number") + "</th>" +
            "<th class='table-thead' width='7%'>" + rpL("receipt_amount") + "</th>" +
            "<th class='table-thead' width='7%'>" + rpL("receipt_type") + "</th>" +
            "<th class='table-thead' width='14%'>" + rpL("receipt_title") + "</th>" +
            "<th class='table-thead' width='8%'>" + rpL("receipt_status") + "</th>" +
            "<th class='table-thead' width='11%'>" + rpL("receipt_amount_y") + "</th>" +
            "<th class='table-thead' width='11%'>" + rpL("receipt_amount_n") + "</th>" +
//            "<th class='table-thead' width='16%'>" + rpL("receipt_contactor") + "</th>" +
            "<th class='table-thead' width='17%'>" + rpL("accountDetail") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("createTime") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("receipt_operation") + "</th>" +
            "</tr>");
    var loadStr = "<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"

    $("#receipt-tbody").empty().append(loadStr);
    receiptTableInit();
}
function receiptTableInit(){
    receiptTable=$("#receipt-table").dataTable({
        "bDestroy":true,
        "iDisplayLength" : 10,
        "aaSorting": [[ 8, "desc" ]],
        "bAutoWidth": true,
        "bServerSide": true,
        'bPaginate': true,
        /*'bSort':false,*/
        "sPaginationType" : "bootstrap_full",
//            "aaSorting": [[ 0, "asc" ]],
        "sAjaxDataProp":"datas",
        "sRowSelect": "single",
        "sAjaxSource": "/action/receipt/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "updateTime",sort = "asc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = receiptColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }

            var pageNo = '', pageSize = '';
            pageSize =  oSettings._iDisplayLength;
            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#receipt_filter_type").html();
            var keyword = $("#receiptValue").val()?$("#receiptValue").val():"";
            if(type == "createTime"){
                var endT=convertStr($("#receipt_endDate").val())==""?"":$("#receipt_endDate").val()+" 23:59:59";
                keyword = $("#receipt_startDate").val() + "|" +endT;
            }
            var data = {keyword:keyword,type:type,pageNo:pageNo,pageSize:pageSize,param:params,sort:sort};
            oSettings.qXHRj = doPost(sSource,data,fnCallback);
        },
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str = "";
            var operationStr = "";
            var status="";
            var createTime="";
            var accountDetail="";
            if(aData.status == "HaveInvoiced"){//审核通过
                status='<span class="success-type">已开具<span>';
                operationStr ="<a onclick='showreceiptDetail("+ aData.id +")'>详情</a>";
            }else if(aData.status == "NotThroughAudit"){//审核未通过
                operationStr ="<a onclick='showreceiptDetail("+ aData.id +")'>详情</a>";
                status='<span class="pay-balance">未通过<span>';
            }else if(aData.status == "ThroughAudit"){//已开具
                operationStr ="<a onclick='showreceiptDetail("+ aData.id +")'>详情</a>";
                status='<span class="success-type">已审核<span>';
            }else{//待审核  if(aData.status == "PendingAudit")
                operationStr ="<a onclick='examine("+ aData.id +","+ aData.amount+")'>审核 </a>|<a onclick='showreceiptDetail("+ aData.id +")'> 详情</a>";
                status='<span class="blue-balance">待审核<span>';
            }
            accountDetail="<span class='account-span col-lg-4' style='text-align: right;padding-right: 0;'>邮箱：</span><span class='col-lg-8' style='text-align: left;padding-left: 0;'>"+aData.account.email+"</span>";
            if(aData.account.email.length > 7){
                accountDetail += "</br>";
            }
            accountDetail += "<span class='account-span col-lg-4' style='text-align: right;padding-right: 0;'>手机：</span><span class='col-lg-8' style='text-align: left;padding-left: 0;'>"+aData.account.mobilePhone+"</span>";

            createTime=convertStr(aData.createTime)==""?"-":new Date(aData.createTime).Format("yyyy-MM-dd hh:mm:ss");
            str = "<td>"+(++iDisplayIndex)+"</td>"+
                "<td class='pay-balance'>"+aData.amount +"</td>"+
                "<td>"+ rpL(aData.receiptType) +"</td>"+
                "<td>"+ aData.receiptTitle +"</td>"+
                "<td>"+ status +"</td>"+
                "<td  class='success-type'>"+  aData.billReceiptInfo.receiptAmountY +"</td>"+
                "<td  class='pay-balance'>"+  aData.billReceiptInfo.receiptAmountN +"</td>"+
//                    "<td>"+ aData.contactor +"</td>"+
                "<td>"+ accountDetail +"</td>"+
                "<td>"+ createTime +"</td>"+
                "<td>"+ operationStr +"</td>";
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
                aTargets: [ 0,5,6,9 ]
            },
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    $("#receipt_list_table .dataTables_length").remove();
//       $("#receipt_list_table .dataTables_filter").remove();
    $("#receipt_list_table .dataTables_filter").empty().css("left","5px").css("margin-top","1px").append( '<div class="input-group">'+
        '    <div class="input-group-btn">'+
        '    <button id="receipt_filter_name" type="button" class="btn btn-default" tabindex="-1" style="height: 32px;">全部</button>'+
        '    <button style="height: 32px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="receipt_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        '    <li><a onclick="receipt_filter_column_onchange(this)" value="status"  href="javascript:void(0);">状态</a></li>'+
        '    <li><a onclick="receipt_filter_column_onchange(this)" value="account"  href="javascript:void(0);">用户邮箱</a></li>'+
        '    <li><a onclick="receipt_filter_column_onchange(this)" value="createTime" href="javascript:void(0);">创建时间</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="receipt_filter_value_select">' +
//        '<input  style="height: 32px;width: 160px;" id="receiptValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div>');

    getKeydownAndKeyupInterval("receiptValue",500,execReceiptSearch);
}
function execReceiptSearch() {
    var data = receiptTable.fnSettings();
    receiptValue = $("#receiptValue").val();
    //$("#receipt_list_table .dt-bottom-row").remove();
    receiptTable.fnDraw();
}

function receiptExecFilter(){
    var data = receiptTable.fnSettings();
    //$("#receipt_list_table .dt-bottom-row").remove();
    receiptTable.fnDraw();
}

function receipt_filter_column_onchange(_this){
    var value = String($(_this).attr("value"));
    $("#receipt_filter_name").html($(_this).html());
    receipt_filter_value_select(value);
    $("#receipt_filter_type").html(value);
}

function receipt_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#receipt_filter_value_select").empty();
            $("#receipt_filter_type").html("");
            receiptExecFilter();
            break;
        case "account":
            $("#receipt_filter_value_select").empty().append('<input id="receiptValue" class="form-control col-sm-1" style="width: 160px;" type="text" placeholder="邮箱">');
            break;
        case "createTime":{

            $("#receipt_filter_value_select").empty().append(
                    '<input  id="receipt_startDate" type="text" class="form-control" placeholder="起始时间" style="width: 120px;height: 32px;">' +
                    '<span class="col-sm-1" style="width:20px;margin-left: 1px;margin-top:10px;">--</span>'+
                    '<input  id="receipt_endDate" type="text" class="form-control" placeholder="截止时间" style="width: 120px;margin-left: 158px;margin-top:-32px;height: 32px;">');

//            $(".dataTables_filter .input-group").css("width","100%");

            // START AND FINISH DATE
            $('#receipt_startDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#receipt_endDate').datepicker('option', 'minDate', selectedDate);
                    receiptExecFilter();
                }
            });

            $('#receipt_endDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#receipt_startDate').datepicker('option', 'maxDate', selectedDate);
                    receiptExecFilter();
                }
            });

            break;
        }
        case "status":
            $("#receipt_filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="receiptValue"  value="" onchange="receiptExecFilter()">'+
                '<option value="">全部</option>'+
                '<option value="PendingAudit">待审核</option>'+
                '<option value="ThroughAudit">已审核</option>'+
                '<option value="NotThroughAudit">未通过</option>'+
                '<option value="HaveInvoiced">已开具</option>'+
                '</select>');
            break;
    }
    getKeydownAndKeyupInterval("receiptValue",500,execReceiptSearch);
    getKeydownAndKeyupInterval("receipt_startDate",500,execReceiptSearch);
    getKeydownAndKeyupInterval("receipt_endDate",500,execReceiptSearch);

}

var sel_receipt_id="";
var all_receipt_data="";
function set_receipt_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#role_table input[name='cbx_role_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_receipt_data = null;
        // all_receipt_data = receiptTable.fnGetData(obj.parent);
        if(null != id)
            sel_receipt_id=id;

        $("#btn_receipt_edit").removeClass("disabled");

    }else{
        all_receipt_data = null;
        $("#btn_receipt_edit").addClass("disabled");
    }
    //console.log("id="+id);
}

function showreceiptDetail(id){

    doPost("/action/receipt/detail",{receiptId:id},function(objs) {
        var status="";
        if(objs.httpCode == "200"){
            if(objs.data.status == "HaveInvoiced"){//审核通过
                status='<span class="success-type">已开具<span>';
            }else if(objs.data.status == "NotThroughAudit"){//审核未通过
                status='<span class="pay-balance">未通过<span>';
            }else if(objs.data.status == "ThroughAudit"){//已开具
                status='<span class="success-type">已审核<span>';
            }else{//待审核  if(data[i].status == "PendingAudit")
                status='<span class="blue-balance">待审核<span>';
            }
            $("#receipt_detail_number").html(objs.data.trackNumber);
            $("#receipt_detail_track_amount").html(objs.data.trackAmount);
            $("#receipt_detail_rtype").html(objs.data.receiptType);
            $("#receipt_detail_check_node").html(objs.data.checkNode);
            $("#receipt_detail_company").html(objs.data.expressType);
            $("#receipt_detail_send_type").html(rpL(objs.data.sendType));
            $("#receipt_detail_receipt_type").html(rpL(objs.data.receiptType));
            $("#receipt_detail_zip_code").html(objs.data.zipCode);
            $("#receipt_detail_address").html(objs.data.address);
            $("#receipt_detail_receipt_title").html(objs.data.receiptTitle);
            $("#receipt_detail_amount").html(objs.data.amount);
            $("#receipt_detail_user").html(objs.data.contactor);
            $("#receipt_detail_user_phone").html(objs.data.contactorPhone);
            $("#receipt_detail_status").html(status);
            $("#receipt_detail_couponUses").html(rpL(objs.data.billReceiptInfo.receiptAmountY));
            $("#receipt_detail_couponNotUses").html(rpL(objs.data.billReceiptInfo.receiptAmountN));
            $("#receipt_detail_receiptYear1").html(objs.data.billReceiptInfo.receiptYear);
            $("#receipt_detail_receiptYear").html(objs.data.receiptYear);
            $("#receipt_detail_desc").html(objs.data.description);

            /*         if(objs.data.sendType=="Self"){
             $("#express-number_div").hide();
             }else{
             $("#express-number_div").show()
             }*/
            $("#receipt_detail_modal").show().siblings().hide();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });
}

var current_receiptId = "";
var current_receiptAmount = "";
function examine(receiptId,amount){
    doPost("/action/receipt/detail",{receiptId:receiptId},function(objs) {
        if(objs.httpCode == "200"){
            current_receiptId = receiptId;
            current_receiptAmount = amount;
            var status="";
            if(objs.data.status == "HaveInvoiced"){//审核通过
                status='<span class="success-type">已开具<span>';
            }else if(objs.data.status == "NotThroughAudit"){//审核未通过
                status='<span class="pay-balance">未通过<span>';
            }else if(objs.data.status == "ThroughAudit"){//已开具
                status='<span class="success-type">已审核<span>';
            }else{//待审核  if(data[i].status == "PendingAudit")
                status='<span class="blue-balance">待审核<span>';
            }
            $("#express-status").html(status);
            $("#express-company").html(objs.data.expressType);
            $("#express-send_type").html(rpL(objs.data.sendType));
            $("#express-receipt_type").html(rpL(objs.data.receiptType));
            $("#express-zip_code").html(objs.data.zipCode);
            $("#express-address").html(objs.data.address);
            $("#express-receipt_title").html(objs.data.receiptTitle);
            $("#express-amount").html(objs.data.amount);
            $("#express-amount-y").html(objs.data.billReceiptInfo.receiptAmountN);
            $("#express-user").html(objs.data.contactor);
            $("#express-user_phone").html(objs.data.contactorPhone);
            $("#express-receiptYear").html(objs.data.receiptYear);
            $("#express-desc").html(objs.data.description);

            if(objs.data.sendType=="Self"){
                $("#express-number_div").hide();
            }else{
                $("#express-number_div").show();
            }
            clearForm("receipt_examin");
            $("#receipt_examin_modal").show().siblings().hide();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });

}


function confirmExamin(){

    var expressId = $("#express-number").val();
    var trackAmount = $("#express-tra_amount").val();
    if(convertStr(expressId)==""){
        showErrorMsg("温馨提示","请填写快递单号");
        return;
    }
    if(trackAmount=="" || trackAmount==undefined){
        showErrorMsg("温馨提示","请填写快递费用");
        return;
    }
    var check_node = $("#express-check_node").val();
    $("#receipt_examin_modal").modal("hide");//trackAmount:current_receiptAmount,
    doPost("/action/receipt/examine",{id:current_receiptId,trackNumber:expressId,trackAmount:trackAmount,checkNode:check_node},function(objs){
        if(objs.httpCode == "200"){
            showMsg("温馨提示","审核成功。");
            loadreceiptTable();
            $("#receipt_widget-grid").show().siblings().hide();
            $("#receipt_btns").show();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });
}
function notNonfirmExamin(){

    var check_node = $("#express-check_node").val();
    if(convertStr(check_node)==""){
        showErrorMsg("温馨提示","请填写描述");
        return;
    }
    $("#receipt_examin_modal").modal("hide");
    doPost("/action/receipt/notThrough",{id:current_receiptId,trackAmount:current_receiptAmount,checkNode:check_node},function(objs){
        if(objs.httpCode == "200"){
            showMsg("温馨提示","审核成功。");
            loadreceiptTable();
            $("#receipt_widget-grid").show().siblings().hide();
            $("#receipt_btns").show();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });
}
