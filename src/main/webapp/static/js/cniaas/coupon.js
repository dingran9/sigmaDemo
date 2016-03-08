/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:订单
 */
var couponTable;
var couponValue;

var userCouponColIndex = [
    "amount",
    "amount",
    "consumeAmountLimited",
    "type",
    "account",
    "type",
    "usedTime",
    "beginTime",
    "endTime",
    "createTime"
];
function loadcouponTable() {
    //  loadURL("../../static/cniaas/coupon.html",$("#content_test"));

    $("#coupon_list_table").empty().append("<table id='coupon-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='coupon-thead' class=''></thead><tbody id='coupon-tbody' class='table-tbody'></tbody></table>");
    $("#coupon-thead").empty().append(
            "<tr>" +
            "<th class='table-thead' width='5%'>" + rpL("number") + "</th>" +
//            "<th class='table-thead' style='display: none;'>"+rpL("id")+"</th>"+
            "<th class='table-thead' width='10%'>" + rpL("amount") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("consumeAmountLimited") + "</th>" +
            "<th class='table-thead' width='7%'>" + rpL("type") + "</th>" +
            "<th class='table-thead' width='20%'>" + rpL("account") + "</th>" +
            "<th class='table-thead' width='8%'>" + rpL("status") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("usedTime") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("beginTime") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("endTime") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("createTime") + "</th>" +
            "</tr>");

    var loadStr = "<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#coupon-tbody").empty().append(loadStr);
    couponTableInit();
}
    function couponTableInit(){
        couponTable=$("#coupon-table").dataTable({
            "bDestroy":true,
            "iDisplayLength" : 10,
            "bAutoWidth": true,
            "bServerSide": true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 9, "desc" ]],
            "sAjaxDataProp":"datas",
            /*'bSort':false,*/
            "sRowSelect": "single",
            "sAjaxSource": "/action/billcoupon/pageList",
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
                var params = "amount",sort = "asc";
                for(var i=0;i<aoData.length;i++){
                    if(aoData[i].name.indexOf("iSortCol") == 0){
                        params = userCouponColIndex[aoData[i].value];
                    }else if(aoData[i].name.indexOf("sSortDir") == 0){
                        sort = aoData[i].value;
                    }
                }

                var pageNo = '', pageSize = '';
                pageSize = oSettings._iDisplayLength;
                pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
                var type = $("#coupon_filter_type").html();
                var keyword = $("#couponValue").val()?$("#couponValue").val():"";
                if(type == "createTime"){
                    var endT=convertStr($("#coupon_endDate").val())==""?"":$("#coupon_endDate").val()+" 23:59:59";
                    keyword = $("#coupon_startDate").val() + "|" + endT;
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
                var usedTime='-';
                var beginTime='-';
                var endTime='-';
                var createTime='-';
                var accountEmail='-';
                    beginTime=convertStr(aData.beginTime)==""?"-":new Date(aData.beginTime).Format("yyyy-MM-dd");
                    endTime=convertStr(aData.endTime)==""?"-":new Date(aData.endTime).Format("yyyy-MM-dd");
                    createTime=convertStr(aData.createTime)==""?"-":new Date(aData.createTime).Format("yyyy-MM-dd hh:mm:ss");
                    accountEmail=convertStr(aData.account)==""?"-":aData.account.email;
                    if(convertStr(aData.usedTime)==""){
                        if(Number(aData.endTime)<Number(data1)){
                            status="<span class='red'>已过期</span>";
                        }else{
                            status="<span class=''>未使用</span>";
                        }
                    }else{
                        status="<span class='success-type'>已使用</span>";
                        usedTime=new Date(aData.usedTime).Format("yyyy-MM-dd hh:mm:ss")
                    }
                str += "<td>"+(++iDisplayIndex)+"</td>"+
//                    "<td style='display: none'>"+aData.id+"</td>"+
                        "<td class='pay-balance' style='text-align:center;'>"+aData.amount+"</td>"+
                        "<td class='pay-balance'>"+aData.consumeAmountLimited +"</td>"+
                        "<td>"+rpL(aData.type)+"</td>"+
                        "<td style='text-align:center;'>"+accountEmail+"</td>"+
                        "<td>"+status+"</td>"+
                        "<td>"+ usedTime  +"</td>"+
                        "<td>"+ beginTime +"</td>"+
                        "<td>"+ endTime +"</td>"+
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
            },
            "aoColumnDefs": [
                {
                    bSortable: false,
                    aTargets: [ 0,5 ]
                },
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ]
        });
        $("#coupon_list_table .dataTables_length").remove();
//        $("#coupon_list_table .dataTables_filter").remove();
        $("#coupon_list_table .dataTables_filter").empty().css("left","5px").css("margin-top","1px").append( '<div class="input-group">'+
//            '     <a style="float: left;" id="btn_coupon_refresh" class="btn btn-default" href="javascript:void(0);" onclick="couponloadDataTableScripts()"><i class="fa fa-refresh"></i> 刷新</a>'+
            '    <div class="input-group-btn">'+
            '    <button id="coupon_filter_name" type="button" class="btn btn-default" tabindex="-1" style="height: 32px;">全部</button>'+
            '    <button style="height: 32px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
            '    <span class="caret"></span>'+
            '    </button>'+
            '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
            '    <li><a onclick="coupon_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
            '    <li><a onclick="coupon_filter_column_onchange(this)" value="status"  href="javascript:void(0);">状态</a></li>'+
            '    <li><a onclick="coupon_filter_column_onchange(this)" value="account"  href="javascript:void(0);">用户邮箱</a></li>'+
            '    <li><a onclick="coupon_filter_column_onchange(this)" value="createTime" href="javascript:void(0);">创建时间</a></li>'+
            '</ul>'+
            '</div>'+
            '<span id="coupon_filter_value_select">' +
//            '<input style="height: 32px;width: 160px;" id="couponValue" type="text" class="form-control" placeholder="查询">'+
            '</span>'+
            '</div>');


        getKeydownAndKeyupInterval("couponValue",500,execCouponSearch);
    }
function execCouponSearch() {
    var data = couponTable.fnSettings();
    couponValue = $("#couponValue").val();
    //$("#coupon_list_table .dt-bottom-row").remove();
    couponTable.fnDraw();
}

function couponExecFilter(){
    var data = couponTable.fnSettings();
    //$("#coupon_list_table .dt-bottom-row").remove();
    couponTable.fnDraw();
}

function coupon_filter_column_onchange(_this){
    var value = String($(_this).attr("value"));
    $("#coupon_filter_name").html($(_this).html());
    coupon_filter_value_select(value);
    $("#coupon_filter_type").html(value);
}

function coupon_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#coupon_filter_value_select").empty();
            $("#coupon_filter_type").html("");
            couponExecFilter();
            break;
        case "account":
            $("#coupon_filter_value_select").empty().append('<input id="couponValue" class="form-control col-sm-1" style="width: 160px;" type="text"  placeholder="邮箱">');
            break;
        case "createTime":{

            $("#coupon_filter_value_select").empty().append(
                    '<input  id="coupon_startDate" type="text" class="form-control" placeholder="起始时间" style="width: 120px;height: 32px;">' +
                    '<span class="col-sm-1" style="width:20px;margin-left: 1px;margin-top:10px;">--</span>'+
                    '<input  id="coupon_endDate" type="text" class="form-control" placeholder="截止时间" style="width: 120px;margin-left: 158px;margin-top:-32px;height: 32px;">');

//            $(".dataTables_filter .input-group").css("width","100%");

            // START AND FINISH DATE
            $('#coupon_startDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#coupon_endDate').datepicker('option', 'minDate', selectedDate);
                    couponExecFilter();
                }
            });

            $('#coupon_endDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#coupon_startDate').datepicker('option', 'maxDate', selectedDate);
                    couponExecFilter();
                }
            });

            break;
        }
        case "status":
            $("#coupon_filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="couponValue"  value="" onchange="couponExecFilter()">'+
                '<option value="">全部</option>'+
                '<option value="used">已使用</option>'+
                '<option value="notUsed">未使用</option>'+
                '<option value="expired">已过期</option>'+
                '</select>');
            break;
    }
    getKeydownAndKeyupInterval("couponValue",500,execCouponSearch);
}

function runcouponDataTables(callback){
    $("#btn_coupon_edit").addClass("disabled");
    var data1=new Date();
    data1.getMilliseconds();
    doPost("/action/billcoupon/list",{},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = '';
            var status='';
            var usedTime='-';
            var beginTime='-';
            var endTime='-';
            var createTime='-';
            var accountEmail='-';
            for( var i=0;i<data.length;i++){
                beginTime=convertStr(data[i].beginTime)==""?"-":new Date(data[i].beginTime).Format("yyyy-MM-dd");
                endTime=convertStr(data[i].endTime)==""?"-":new Date(data[i].endTime).Format("yyyy-MM-dd");
                createTime=convertStr(data[i].createTime)==""?"-":new Date(data[i].createTime).Format("yyyy-MM-dd");
                accountEmail=convertStr(data[i].accountEmail)==""?"-":data[i].accountEmail;
                if(convertStr(data[i].usedTime)==""){
                    if(Number(data[i].endTime)<Number(data1)){
                        status="<span class='pay-balance'>已过期</span>";
                    }else{
                        status="<span class=''>未使用</span>";
                    }
                }else{
                    status="<span class='success-type'>已使用</span>";
                    usedTime=new Date(data[i].usedTime).Format("yyyy-MM-dd")
                }
                str += "<tr id='tr_coupon_" + data[i].id + "'>"+
                    "<td>"+(data.length - i)+"</td>"+
//                    "<td style='display: none'>"+data[i].id+"</td>"+
                    "<td class='pay-balance'>"+data[i].amount+"</td>"+
                    "<td class='pay-balance'>"+data[i].consumeAmountLimited +"</td>"+
                    "<td>"+rpL(data[i].type)+"</td>"+
                    "<td>"+accountEmail+"</td>"+
                    "<td>"+status+"</td>"+
                    "<td>"+ usedTime  +"</td>"+
                    "<td>"+ beginTime +"</td>"+
                    "<td>"+ endTime +"</td>"+
                    "<td>"+ createTime +"</td>"+
                    "</tr>";
            }
            $("#coupon-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='bcoupon-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#coupon-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

function addCouponValidate(){
    $("#coupon-wizard-1").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            coupon_toprice:{
                required:true,
                digits:true
            },
            coupon_consume_amount_limited:{
                required:true,
                digits:true
            }/*,
            startdate:{
                required:true
            },
            finishdate:{
                required:true
            }*/
        },
        messages:{
            coupon_toprice:{
                required:"面值不能为空",
                digits:"面值只能是整数"
            },
            coupon_consume_amount_limited:{
                required:"最低消费金额限制不能为空",
                digits:"最低消费金额限制只能是整数"
            }/*,
            startdate:{
                required:"起始时间不能为空"
            },
            finishdate:{
                required:"截止时间不能为空"
            }*/
        },
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}
