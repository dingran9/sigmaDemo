/**
 * Created by Zhangly on 2014/9/26.
 */
var remitTable;
var remitValue;

var remitColIndex = [
    "remitNumber",
    "remitNumber",
    "accountId",
    "amount",
    "remitType",
    "contactor",
    "contactorPhone",
    "remitTime",
    "status",
    "status"
];
function loadremitTable() {

    $("#remit_list_table").empty().append("<table id='remit-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='remit-thead' class='' style='border-top: 1px solid #CCC;'></thead><tbody id='remit-tbody' class='table-tbody'></tbody></table>");
    $("#remit-thead").empty().append(
            "<tr>" +
            "<th class='table-thead' width='5%'>" + rpL("number") + "</th>" +
            "<th class='table-thead' width='18%'>" + rpL("remit_number") + "</th>" +
            "<th class='table-thead' width='13%'>" + rpL("remit_bankaccount") + "</th>" +
            "<th class='table-thead' width='8%'>" + rpL("remit_amount") + "</th>" +
            "<th class='table-thead' width='8%'>" + rpL("remit_type") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("remit_people") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("remit_peoplePhone") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("remit_time") + "</th>" +
            "<th class='table-thead' width='8%'>" + rpL("status") + "</th>"+
            "<th class='table-thead' width='10%'>" + rpL("remit_operation") + "</th>" +
            "</tr>");
    var loadStr = "<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"

    $("#remit-tbody").empty().append(loadStr);
    remitTableInit();
}
function remitTableInit(){
    remitTable=$("#remit-table").dataTable({
        "bDestroy":true,
        "iDisplayLength" : 10,
        "bAutoWidth": true,
        "bServerSide": true,
        "aaSorting": [[7, "desc" ]],
        'bPaginate': true,
        /*'bSort':false,*/
        "sPaginationType" : "bootstrap_full",
        "sAjaxDataProp":"datas",
        "sRowSelect": "single",
        "sAjaxSource": "/action/remit/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "remitNumber",sort = "asc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = remitColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }
            var pageNo = '', pageSize = '';
            pageSize =  oSettings._iDisplayLength;
            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#remit_filter_type").html();
            var keyword = $("#remitValue").val()?$("#remitValue").val():"";

            var data = {keyword:keyword,type:type,pageNo:pageNo,pageSize:pageSize,param:params,sort:sort};
            oSettings.qXHRj = doPost(sSource,data,fnCallback);
        },
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str = "";
            var statusStr = ""; //状态
            var remitTypeStr = ""; //汇款方式
            var createTimeStr =""; //创建时间
            var remitTimeStr = ""; //汇款时间
            var operationStr = ""; //操作
            var bankName = "";

           if(aData.status == "PendingAudit"){//待审核
                operationStr ="<a onclick='examine("+aData.id+")'>审核</a>&nbsp;|&nbsp;<a onclick='showremitDetail("+ aData.id +")'>详情</a>";
                statusStr='<span class="pay-balance">待审核<span>';
            }else if(aData.status == "Through"){//审核通过
                operationStr ="<a onclick='showremitDetail("+ aData.id +")'>详情</a>";
                statusStr='<span class="success-type">已通过<span>';
            } else if(aData.status == "NotPass") { //未通过
                operationStr ="<a onclick='showremitDetail("+ aData.id +")'>详情</a>";
                statusStr='<span class="pay-balance">未通过<span>';
            }
            if(aData.remitType == "CyberBank") {
                remitTypeStr = "网银转账";
            } else if(aData.remitType == "TelegraphicTransfer") {
                remitTypeStr = "电汇";
            } else if (aData.remitType == "Cheque") {
                remitTypeStr = "支票";
            }
            /*createTimeStr = convertStr(aData.createTime)==""?"-":new Date(aData.createTime).Format("yyyy-MM-dd");*/
            remitTimeStr = convertStr(aData.remitTime)==""?"-":new Date(aData.remitTime).Format("yyyy-MM-dd hh:mm");
            if(null == aData.payeeInfoPo) {
                bankName = "";
            } else {
                bankName = aData.payeeInfoPo.account;
            }
            str = "<td>"+(++iDisplayIndex)+"</td>"+
                "<td class='pay-balance'>"+aData.remitNumber +"</td>"+
                "<td>"+ bankName +"</td>"+
                "<td>"+ aData.amount +"</td>"+
                "<td>"+ remitTypeStr +"</td>"+
                "<td>"+  aData.contactor +"</td>"+
                "<td>"+  aData.contactorPhone +"</td>"+
                "<td>"+ remitTimeStr +"</td>"+
                "<td>"+ statusStr +"</td>"+
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
                aTargets: [ 0,9 ]
            },
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    $("#remit_list_table .dataTables_length").remove();
//       $("#remit_list_table .dataTables_filter").remove();
    $("#remit_list_table .dataTables_filter").empty().css("left","5px").css("margin-top","1px").append( '<div class="input-group">'+
        '    <div class="input-group-btn">'+
        '    <button id="remit_filter_name" type="button" class="btn btn-default" tabindex="-1" style="height: 32px;">全部</button>'+
        '    <button style="height: 32px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="remit_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        '    <li><a onclick="remit_filter_column_onchange(this)" value="status"  href="javascript:void(0);">状态</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="remit_filter_value_select">' +
//        '<input  style="height: 32px;width: 160px;" id="remitValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div>');

    getKeydownAndKeyupInterval("remitValue",500,execRemitSearch);

}
function execRemitSearch() {
    var data = remitTable.fnSettings();
    remitValue = $("#remitValue").val();
    //$("#remit_list_table .dt-bottom-row").remove();
    remitTable.fnDraw();
}

function remitExecFilter(){
    var data = remitTable.fnSettings();
    //$("#remit_list_table .dt-bottom-row").remove();
    remitTable.fnDraw();
}

function remit_filter_column_onchange(_this){
    var value = String($(_this).attr("value"));
    $("#remit_filter_name").html($(_this).html());
    remit_filter_value_select(value);
    $("#remit_filter_type").html(value);
}

function remit_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#remit_filter_value_select").empty();
            $("#remit_filter_type").html("");
            remitExecFilter();
            break;
        case "account":
            $("#remit_filter_value_select").empty().append('<input id="remitValue" class="form-control col-sm-1" style="width: 160px;" type="text" placeholder="邮箱">');
            break;
        case "createTime":{

            $("#remit_filter_value_select").empty().append(
                    '<input  id="remit_startDate" type="text" class="form-control" placeholder="起始时间" style="width: 120px;height: 32px;">' +
                    '<span class="col-sm-1" style="width:20px;margin-left: 1px;margin-top:10px;">--</span>'+
                    '<input  id="remit_endDate" type="text" class="form-control" placeholder="截止时间" style="width: 120px;margin-left: 158px;margin-top:-32px;height: 32px;">');

//            $(".dataTables_filter .input-group").css("width","100%");

            // START AND FINISH DATE
            $('#remit_startDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#remit_endDate').datepicker('option', 'minDate', selectedDate);
                    remitExecFilter();
                }
            });

            $('#remit_endDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#remit_startDate').datepicker('option', 'maxDate', selectedDate);
                    remitExecFilter();
                }
            });

            break;
        }
        case "status":
            $("#remit_filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="remitValue"  value="" onchange="remitExecFilter()">'+
                '<option value="">全部</option>'+
                '<option value="PendingAudit">待审核</option>'+
                '<option value="Through">已通过</option>'+
                '<option value="NotPass">未通过</option>'+
                '</select>');
            break;
    }

    getKeydownAndKeyupInterval("remitValue",500,execRemitSearch);
    getKeydownAndKeyupInterval("remit_startDate",500,execRemitSearch);
    getKeydownAndKeyupInterval("remit_endDate",500,execRemitSearch);

}

var sel_remit_id="";
var all_remit_data="";
function set_remit_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#role_table input[name='cbx_role_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_remit_data = null;
        // all_remit_data = remitTable.fnGetData(obj.parent);
        if(null != id)
            sel_remit_id=id;

        $("#btn_remit_edit").removeClass("disabled");

    }else{
        all_remit_data = null;
        $("#btn_remit_edit").addClass("disabled");
    }

}

function showremitDetail(id){

    doPost("/action/remit/detail",{id:id},function(objs) {
        var status=""; //状态
        var remitTypeStr = ""; //汇款方式
        var bankStr = ""; //收款银行
        var createTimeStr = "";
        var remitTimeStr = "";
        var checkTimeStr = "";
        if(objs.httpCode == "200"){
            if(objs.data.billReceiptPo.status == "PendingAudit"){//待审核
                status='<span class="pay-balance">待审核<span>';
            }else if(objs.data.billReceiptPo.status == "Through"){//已通过
                status='<span class="success-type">已通过<span>';
            }else if(objs.data.billReceiptPo.status == "NotPass"){//未通过
                status='<span class="blue-balance">未通过<span>';
            }
            if(objs.data.billReceiptPo.remitType == "CyberBank"){//网银转帐
                remitTypeStr='网银转帐';
            }else if(objs.data.billReceiptPo.remitType == "TelegraphicTransfer"){//电汇
                remitTypeStr='电汇';
            }else if(objs.data.billReceiptPo.remitType == "Cheque"){//支票
                remitTypeStr='支票';
            }
            if (objs.data.billReceiptPo.payeeInfoPo == null) {
                bankStr = "";
            } else {
                bankStr = objs.data.billReceiptPo.payeeInfoPo.account;
            }

            createTimeStr = convertStr(objs.data.billReceiptPo.createTime)==""?"-":new Date(objs.data.billReceiptPo.createTime).Format("yyyy-MM-dd hh:mm:ss");
            remitTimeStr = convertStr(objs.data.billReceiptPo.remitTime)==""?"-":new Date(objs.data.billReceiptPo.remitTime).Format("yyyy-MM-dd hh:mm:ss");
            checkTimeStr = convertStr(objs.data.billReceiptPo.checkTime)==""?"-":new Date(objs.data.billReceiptPo.checkTime).Format("yyyy-MM-dd hh:mm:ss");

            $("#remit_detail_status").html(status);
            $("#remit_detail_examinTime").html(checkTimeStr);
            $("#remit_detail_amount").html(objs.data.billReceiptPo.amount);
            $("#remit_detail_payee").html(bankStr);
            $("#remit_detail_remit_type").html(remitTypeStr);
            $("#remit_detail_remitTime").html(rpL(remitTimeStr));
            $("#remit_detail_remitContactor").html(rpL(objs.data.billReceiptPo.contactor));
            $("#remit_detail_remitContactor_phone").html(objs.data.billReceiptPo.contactorPhone);
            $("#remit_detail_account").html(objs.data.userAccountPo.email);
            $("#remit_detail_createTime").html(createTimeStr);
            $("#show-remit-attach").attr("src", objs.data.billReceiptPo.attach);
            $("#remit-bigImage").attr("src", objs.data.billReceiptPo.attach);
            $("#remit_detail_checknode").html(objs.data.billReceiptPo.checkNode);
            //$("#remit_detail_modal").show();
            $("#remit_detail_modal").show().siblings().hide();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });
}

var current_remitId = "";
var current_remitAmount = "";
function examine(remitId){
    var status=""; //状态
    var remitTypeStr = ""; //汇款方式
    var bankStr = ""; //收款银行
    var createTimeStr = "";
    var remitTimeStr = "";
    var checkTimeStr = "";
    doPost("/action/remit/detail",{id:remitId},function(objs) {
        if(objs.httpCode == "200"){

            $("#express-desc").val("");

            current_remitId = remitId;
            if(objs.data.billReceiptPo.status == "PendingAudit"){//待审核
                status='<span class="pay-balance">待审核<span>';
            }else if(objs.data.billReceiptPo.status == "Through"){//已通过
                status='<span class="success-type">已通过<span>';
            }else if(objs.data.billReceiptPo.status == "NotPass"){//未通过
                status='<span class="blue-balance">未通过<span>';
            }
            if(objs.data.billReceiptPo.remitType == "CyberBank"){//网银转帐
                remitTypeStr='网银转帐';
            }else if(objs.data.billReceiptPo.remitType == "TelegraphicTransfer"){//电汇
                remitTypeStr='电汇';
            }else if(objs.data.billReceiptPo.remitType == "Cheque"){//支票
                remitTypeStr='支票';
            }
            if (objs.data.billReceiptPo.payeeInfoPo == null) {
                bankStr = "";
            } else {
                bankStr = objs.data.billReceiptPo.payeeInfoPo.account;
            }

            createTimeStr = convertStr(objs.data.billReceiptPo.createTime)==""?"-":new Date(objs.data.billReceiptPo.createTime).Format("yyyy-MM-dd hh:mm:ss");
            remitTimeStr = convertStr(objs.data.billReceiptPo.remitTime)==""?"-":new Date(objs.data.billReceiptPo.remitTime).Format("yyyy-MM-dd hh:mm:ss");
            checkTimeStr = convertStr(objs.data.billReceiptPo.checkTime)==""?"-":new Date(objs.data.billReceiptPo.checkTime).Format("yyyy-MM-dd hh:mm:ss");

            $("#examin_remit_status").html('<span class="blue-balance">'+status+'<span>');
            $("#examin_remit_examinTime").html(remitTimeStr);
            $("#examin_remit_amount").html(objs.data.billReceiptPo.amount);
            $("#examin_remit_payee").html(bankStr);
            $("#examin_remit_type").html(objs.data.billReceiptPo.expressType);
            $("#examin_remit_remitTime").html(remitTypeStr);
            $("#examin_remit_contactor").html(rpL(objs.data.billReceiptPo.contactor));
            $("#examin_remit_contactor_phone").html(objs.data.billReceiptPo.contactorPhone);
            $("#examin_remit_account").html(objs.data.userAccountPo.email);
            $("#examin_remit_createTime").html(createTimeStr);
            $("#examin-remit-attach").attr("src", objs.data.billReceiptPo.attach);
            $("#remit-bigImage").attr("src", objs.data.billReceiptPo.attach);

            $("#remit-examin").show().siblings().hide();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });

}


function confirmExamin(){

    var desc = $("#express-desc").val();
    var inCash = $("#examin-remit-incash").prop("checked");
    if(inCash){
        inCash = 1;
    }else{
        inCash = 0;
    }
    $("#remit-examin").modal("hide");//trackAmount:current_remitAmount,
    doPost("/action/remit/check",{id:current_remitId,status:"Through",inCash:inCash,checkNode:desc},function(objs){
        if(objs.httpCode == "200"){
            showMsg("温馨提示","审核成功。");
            loadremitTable();
            $("#remit_widget-grid").show().siblings().hide();
            $("#remit_btns").show();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });
}
function notNonfirmExamin(){

    var desc = $("#express-desc").val();
    if(convertStr(desc)==""){
        showErrorMsg("温馨提示","请填写描述");
        return;
    }
    $("#remit-examin").modal("hide");
    doPost("/action/remit/check",{id:current_remitId,status:"NotPass",checkNode:desc},function(objs){
        if(objs.httpCode == "200"){
            showMsg("温馨提示","审核成功。");
            loadremitTable();
            $("#remit_widget-grid").show().siblings().hide();
            $("#remit_btns").show();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });
}

