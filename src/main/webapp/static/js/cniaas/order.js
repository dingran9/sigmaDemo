/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:订单
 */
var orderTable;
var orderValue;

var orderInfoColIndex = [
    "orderNumber",
    "orderNumber",
    "orderNumber",
    "status",
    "totalPrice",
    "relPayAmount",
    "type",
    "createType",
    "resourceType",
    "account",
    "createTime"
];
function loadorderTable() {
    //  loadURL("../../static/cniaas/order.html",$("#content_test"));

    $("#order_list_table").empty().append("<table id='order-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table' style='border-top: 1px solid #CCC;'><thead id='order-thead' class='' style='border-top: 1px solid #CCC;'></thead><tbody id='order-tbody' class='table-tbody'></tbody></table>");
    $("#order-thead").empty().append(
            "<tr>" +
            "<th style='display: none;' class='table-thead'>" + rpL("id") + "</th>" +
            "<th class='table-thead' width='5%'>" + rpL("number") + "</th>" +
            "<th class='table-thead' width='15%'>" + rpL("order_number") + "</th>" +
            "<th class='table-thead' width='7%'>" + rpL("status") + "</th>" +
            "<th class='table-thead' width='9%'>" + rpL("totalPrice") + "</th>" +
            "<th class='table-thead' width='12%'>" + rpL("rel_pay_amount") + "</th>" +
            "<th class='table-thead' width='9%'>" + rpL("billType") + "</th>" +
            "<th class='table-thead' width='6%'>" + rpL("OrderSources") + "</th>" +
            "<th class='table-thead' width='9%'>" + rpL("resource_type") + "</th>" +
            "<th class='table-thead' width='18%'>" + rpL("accountDetail") + "</th>" +
            "<th class='table-thead' width='10%'>" + rpL("createTime") + "</th>" +
            "</tr>");

    var loadStr = "<tr class='odd'><td valign='top' colspan='11' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#order-tbody").empty().append(loadStr);
    orderTableInit();
}
function orderTableInit(){
    orderTable=$("#order-table").dataTable({
        "bDestroy":true,
        "iDisplayLength" : 10,
        "aaSorting": [[ 10, "desc" ]],
        "bAutoWidth": true,
        "bServerSide": true,
        "sPaginationType" : "bootstrap_full",
        "sAjaxDataProp":"datas",
        "sRowSelect": "single",
        "sAjaxSource": "/action/orderInfo/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "createTime",sort = "asc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = orderInfoColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }

            var pageNo = '', pageSize = '';
            pageSize =  oSettings._iDisplayLength;

            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#order_filter_type").html();
            var keyword = $("#orderValue").val()?$("#orderValue").val():"";
            if(type == "createTime"){
                var endT=convertStr($("#order_endDate").val())==""?"":$("#order_endDate").val()+" 23:59:59";
                keyword = $("#order_startDate").val() + "|" + endT;
            }
            var data = {keyword:keyword,type:type,pageNo:pageNo,pageSize:pageSize,param:params,sort:sort};
            oSettings.qXHRj = doPost(sSource,data,fnCallback);
        },
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str = '';
            var totalPrice="";
            var status="";
            var accountDetail="-";
            var createTime='-';
            if(aData.status=="NotPay"){
                totalPrice='<span id="order_status_'+aData.id+'">' +
                    '<span style="margin-left: 5px;">'+aData.totalPrice+'</span>' +
                    '<a style="" title="可编辑" class="text-right" onclick="editPay('+aData.id+','+aData.totalPrice+')"><i class="fa fa-pencil"></i></a>' +
                    '</span>' +
                    '<span id="order_status_text_'+aData.id+'" style="display: none;margin-left: 0">' +
                    '<input id="edit_o_tp'+aData.id+'" class="text-input" type="text" value="'+aData.totalPrice+'"/>' +
                    '<a style="text-align: center;"><i class="fa fa-check-square-o text-fa" onclick="editTotalPay('+aData.id+')" ></i></a>' +
                    '</span>';
                status='<span class="pay-balance">未支付<span>';
            }else if(aData.status=="HavePay"){
                totalPrice='<span style="margin-left: 5px;">'+aData.totalPrice+'<span>';
                status='<span class="success-type">已支付<span>';
            }else{
                totalPrice='<span style="margin-left: 5px;">'+aData.totalPrice+'<span>';
                status='已关闭';
            }
            createTime=convertStr(aData.createTime)==""?"-":new Date(aData.createTime).Format("yyyy-MM-dd hh:mm:ss");
            if(convertStr(aData.account)!=""){
                accountDetail="<span class='account-span col-lg-4' style='text-align: right;padding-right: 0;'>邮箱：</span><span class='col-lg-8' style='text-align: left;padding-left: 0;'>"+aData.account.email+"</span>";
                if(aData.account.email.length > 7){
                    accountDetail += "</br>";
                }
                accountDetail += "<span class='account-span col-lg-4' style='text-align: right;padding-right: 0;'>手机：</span><span class='col-lg-8' style='text-align: left;padding-left: 0;'>"+aData.account.mobilePhone+"</span>";
            }

            //   relPayAmount= convertStr(aData.relPayAmount)==""?"-":aData.relPayAmount;
            str += "<td style='display: none;'>"+ aData.id +"</td>"+
                "<td>"+(++iDisplayIndex)+"</td>"+
                "<td><a onclick='showorderDetail("+ aData.id +")'>"+aData.orderNumber+"</a></td>"+
                "<td>"+status +"</td>"+
                "<td class='pay-balance' onblur='editout("+ aData.id +")'>"+ totalPrice+"</td>"+
                "<td class='pay-balance'>"+aData.relPayAmount +"</td>"+
                "<td>"+ rpL(aData.type) +"</td>"+
                "<td>"+ rpL(aData.createType) +"</td>"+
                "<td>"+ rpL(aData.resourceType) +"</td>"+
                "<td>"+accountDetail+"</td>"+
                "<td>"+createTime+"</td>";
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
                aTargets: [ 1 ]
            },
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    $("#order_list_table .dataTables_length").remove();
//     $("#order_list_table .dataTables_filter").remove();
    $("#order_list_table .dataTables_filter").empty().css("left","5px").css("margin-top","1px").append( '<div class="input-group">'+

        '    <div class="input-group-btn">'+
        '    <button id="order_filter-column-name" type="button" class="btn btn-default" tabindex="-1" style="height: 32px;">全部</button>'+
        '    <button style="height: 32px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="order_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        '    <li><a onclick="order_filter_column_onchange(this)" value="status"  href="javascript:void(0);">状态</a></li>'+
        '    <li><a onclick="order_filter_column_onchange(this)" value="account"  href="javascript:void(0);">用户邮箱</a></li>'+
        '    <li><a onclick="order_filter_column_onchange(this)" value="createTime" href="javascript:void(0);">创建时间</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="order_filter_value_select">' +
//        '<input style="height: 32px;width: 160px;" id="orderValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div>');
    getKeydownAndKeyupInterval("orderValue",500,execOrderSearch);
}

function orderExecFilter(){
    var data = orderTable.fnSettings();
    //$("#order_list_table .dt-bottom-row").remove();
    orderTable.fnDraw();
}

function order_filter_column_onchange(_this){
    var value = $(_this).attr("value");
    $("#order_filter-column-name").html($(_this).html());
    order_filter_value_select(value);
    $("#order_filter_type").html(value);
}

function order_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#order_filter_value_select").empty();
            $("#order_filter_type").html("");
            orderExecFilter();
            break;
        case "account":
            $("#order_filter_value_select").empty().append('<input id="orderValue" class="form-control col-sm-1" style="width: 160px;" type="text" placeholder="邮箱">');
            break;
        case "createTime":{

            $("#order_filter_value_select").empty().append(
                    '<input  id="order_startDate" type="text" class="form-control" placeholder="起始时间" style="width: 120px;height: 32px;">' +
                    '<span class="col-sm-1" style="width:20px;margin-left: 1px;margin-top:10px;">--</span>'+
                    '<input  id="order_endDate" type="text" class="form-control" placeholder="截止时间" style="width: 120px;margin-left: 158px;margin-top:-32px;height: 32px;">');

//            $(".dataTables_filter .input-group").css("width","100%");

            // START AND FINISH DATE
            $('#order_startDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#order_endDate').datepicker('option', 'minDate', selectedDate);
                    orderExecFilter();
                }
            });

            $('#order_endDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#order_startDate').datepicker('option', 'maxDate', selectedDate);
                    orderExecFilter();
                }
            });

            break;
        }
        case "status":
            $("#order_filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="orderValue"  value="" onchange="orderExecFilter()">'+
                '<option value="">全部</option>'+
                '<option value="NotPay">未支付</option>'+
                '<option value="HavePay">已支付</option>'+
                '<option value="Cancel">已关闭</option>'+
                '</select>');
            break;
    }
    getKeydownAndKeyupInterval("orderValue",500,execOrderSearch);
    getKeydownAndKeyupInterval("order_startDate",500,execOrderSearch);
    getKeydownAndKeyupInterval("order_endDate",500,execOrderSearch);

}
function execOrderSearch() {
    var data = orderTable.fnSettings();
    orderValue = $("#orderValue").val();
    //$("#order_list_table .dt-bottom-row").remove();
    orderTable.fnDraw();
}
function runorderDataTables(callback){

    doPost("/action/orderInfo/list",{},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = '';
            //   var relPayAmount="";
            var totalPrice="";
            var status="";
            var accountDetail="";
            for( var i=0;i<data.length;i++){
                if(data[i].status=="NotPay"){
                    totalPrice='<span id="order_status_'+data[i].id+'">' +
                        '<span style="margin-left: 5px;">'+data[i].totalPrice+'</span>' +
                        '<a title="可编辑" class="text-right" onclick="editPay('+data[i].id+','+data[i].totalPrice+')"><i class="fa fa-pencil"></i></a>' +
                        '</span>' +
                        '<span id="order_status_text_'+data[i].id+'" style="display: none;margin-left: 0">' +
                        '<input id="edit_o_tp'+data[i].id+'" class="text-input" type="text" value="'+data[i].totalPrice+'"/>' +
                        '<a><i class="fa fa-check-square-o text-fa" onclick="editTotalPay('+data[i].id+')" ></i></a>' +
                        '</span>';
                    status='<span class="pay-balance">未支付<span>';
                }else if(data[i].status=="HavePay"){
                    totalPrice='<span style="margin-left: 5px;">'+data[i].totalPrice+'<span>';
                    status='<span class="success-type">已支付<span>';
                }else{
                    totalPrice='<span style="margin-left: 5px;">'+data[i].totalPrice+'<span>';
                    status='已关闭';
                }
                accountDetail="<span class='account-span'>"+"邮箱:"+data[i].account.email+"</br>"+"手机:"+data[i].account.mobilePhone+"</span";
                //   relPayAmount= convertStr(data[i].relPayAmount)==""?"-":data[i].relPayAmount;
                str += "<tr id='tr_order_" + data[i].id + "'>"+
                    "<td style='display: none;'>"+ data[i].id +"</td>"+
                    "<td><a  onclick='showorderDetail("+ data[i].id +")'>"+data[i].orderNumber+"</a></td>"+
                    "<td>"+status +"</td>"+
                    "<td class='pay-balance' onblur='editout("+ data[i].id +")'>"+ totalPrice+"</td>"+
                    "<td class='pay-balance'>"+data[i].relPayAmount +"</td>"+
                    "<td>"+ rpL(data[i].type) +"</td>"+
                    "<td>"+ rpL(data[i].createType) +"</td>"+
                    "<td>"+ rpL(data[i].resourceType) +"</td>"+
                    "<td>"+accountDetail+"</td>"+
                    "</tr>";
            }
            $("#order-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='9' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
            $("#order-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_order_id="";
var all_order_data="";
function set_order_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#role_table input[name='cbx_role_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_order_data = null;
        // all_order_data = orderTable.fnGetData(obj.parent);
        if(null != id)
            sel_order_id=id;

        $("#btn_order_edit").removeClass("disabled");

    }else{
        all_order_data = null;
        $("#btn_order_edit").addClass("disabled");
    }
    //console.log("id="+id);
}

function showorderDetail(id){
    doPost("/action/orderInfo/detail",{orderId:id},function(objs){
        if(objs.httpCode == "200"){
            var status;
            $("#order_detail_modal").show().siblings().hide();
            var createTime = new Date(objs.data['createTime']).Format("yyyy-MM-dd hh:mm:ss");
            if(objs.data.status=="NotPay"){
                status='<span class="pay-balance">未支付<span>';
            }else if(objs.data.status=="HavePay"){
                status='<span class="success-type">已支付<span>';
            }else{
                status='已关闭';
            }

            $("#order_detail_totalCost").html(objs.data['totalPrice']);
            $("#order_detail_region").html(objs.data['region']['name']);

            $("#order_detail_orderNumber").html(objs.data.orderNumber);
            $("#order_detail_userId").html(objs.data.accountId);
            $("#order_detail_totalPrice").html(objs.data.totalPrice);
            $("#order_detail_relPayAmount").html(objs.data.relPayAmount);
            $("#order_detail_status").html(status);
            $("#order_detail_type").html(rpL(objs.data.type));
            $("#order_detail_createManagerId").html(objs.data.createManagerId);
            $("#order_detail_billcycle").html(objs.data.billCycle +" 月");
//            $("#order_detail_regionId").html(objs.data.regionId);
            $("#order_detail_productPackageName").html(objs.data.productPackageName);
            $("#order_detail_payTime").html(convertStr(objs.data.payTime)==""?"-":new Date(objs.data.payTime).Format("yyyy-MM-dd hh:mm:ss"));
            $("#order_detail_billBeginTime").html(convertStr(objs.data.billBeginTime)==""?"-":new Date(objs.data.billBeginTime).Format("yyyy-MM-dd hh:mm:ss"));
            $("#order_detail_billEndTime").html(convertStr(objs.data.billEndTime)==""?"-":new Date(objs.data.billEndTime).Format("yyyy-MM-dd hh:mm:ss"));
            $("#order_detail_serviceBeginTime").html(convertStr(objs.data.serviceBeginTime)==""?"-":new Date(objs.data.serviceBeginTime).Format("yyyy-MM-dd hh:mm:ss"));
            $("#order_detail_createTime").html(convertStr(objs.data.createTime)==""?"-":new Date(objs.data.createTime).Format("yyyy-MM-dd hh:mm:ss"));
            $("#order_detail_updateTime").html(convertStr(objs.data.updateTime)==""?"-":new Date(objs.data.updateTime).Format("yyyy-MM-dd hh:mm:ss"));
            $("#order_detail_userEmail").html(objs.data.account.email);
            $("#order_detail_userPhone").html(objs.data.account.mobilePhone);
            var disk="-";
            var cpu="-";
            var mem="-";
            var bandwidth="-";
            var image="-";

            for(var i=0;i<objs.datas.length;i++){
                if(objs.datas[i].productName=="cpu"){
                    cpu=objs.datas[i].billUnitCount + objs.datas[i].billUnitName;
                }
                if(objs.datas[i].productName=="mem"){
                    mem=objs.datas[i].billUnitCount + objs.datas[i].billUnitName;
                }
                if(objs.datas[i].productName=="disk"){
                    disk=objs.datas[i].billUnitCount + objs.datas[i].billUnitName;
                }
                if(objs.datas[i].productName=="bandwidth"){
                    bandwidth=objs.datas[i].billUnitCount + objs.datas[i].billUnitName;
                }
                if(objs.datas[i].productName=="image"){
                    image=objs.datas[i].name;
                }
                $("#order_detail_count").html(objs.datas[i].count);
            }
            $("#order_detail_cpu").html(cpu);
            $("#order_detail_mem").html(mem);
            $("#order_detail_disk").html(disk);
            $("#order_detail_image").html(image);
            $("#order_detail_bandwidth").html(bandwidth);
            //callback(objs.data.productPackageId);
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
        /*        if(objs.httpCode=="200"){
         $("#order_detail_modal").show().siblings().hide();
         $("#order_detail_orderNumber").html(objs.data.orderNumber);
         $("#order_detail_userId").html(objs.data.accountId);
         $("#order_detail_totalPrice").html(objs.data.totalPrice);
         $("#order_detail_relPayAmount").html(objs.data.relPayAmount);
         $("#order_detail_status").html(rpL(objs.data.status));
         $("#order_detail_type").html(rpL(objs.data.type));
         $("#order_detail_createManagerId").html(objs.data.createManagerId);
         $("#order_detail_billCycle").html(objs.data.billCycle);
         $("#order_detail_regionId").html(objs.data.regionId);
         $("#order_detail_productPackageName").html(objs.data.productPackageName);
         $("#order_detail_payTime").html(convertStr(objs.data.payTime)==""?"":new Date(objs.data.payTime).Format("yyyy-MM-dd hh:mm:ss"));
         $("#order_detail_billBeginTime").html(convertStr(objs.data.billBeginTime)==""?"":new Date(objs.data.billBeginTime).Format("yyyy-MM-dd hh:mm:ss"));
         $("#order_detail_billEndTime").html(convertStr(objs.data.billEndTime)==""?"":new Date(objs.data.billEndTime).Format("yyyy-MM-dd hh:mm:ss"));
         $("#order_detail_serviceBeginTime").html(convertStr(objs.data.serviceBeginTime)==""?"":new Date(objs.data.serviceBeginTime).Format("yyyy-MM-dd hh:mm:ss"));
         $("#order_detail_createTime").html(convertStr(objs.data.createTime)==""?"":new Date(objs.data.createTime).Format("yyyy-MM-dd hh:mm:ss"));
         $("#order_detail_updateTime").html(convertStr(objs.data.updateTime)==""?"":new Date(objs.data.updateTime).Format("yyyy-MM-dd hh:mm:ss"));
         $("#order_detail_bills").html("待完善");
         }else{
         console.log("code :" + objs.code + "  msg:" + objs.message);
         showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
         }*/
    });


}

//编辑
function editPay(id,totalprice){
//    console.log("dd");
    sel_order_id=id;
//    $("#order_status_"+id).hide();
//    $("#order_status_text_"+id).show();
    //获取详情
//    doPost("/action/orderInfo/detail",{orderId:id},function(objs){
//        if(objs.httpCode=="200"){
    sel_order_id=id;
    $("#edit_order_modal").modal("show");
    $("#order_edit_totalPrice").val(totalprice);
//        }else{
//            console.log("code :" + objs.code + "  msg:" + objs.message);
//            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
//        }
//
//    });
}

function editTotalPay(id){
    var totalPrice=$("#edit_o_tp"+id).val();
    doPost("/action/orderInfo/edit",{orderId:id,totalPrice:totalPrice},function(objs){
        if(objs.httpCode=="200"){
            loadorderTable();
            showMsg("温馨提示","成功修改订单总价格。");
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }

    });
}
function editout(id){
//    $("#order_status_"+id).show();
//    $("#order_status_text_"+id).hide();
}


function validateAddOrderByCustom() {

    $("#add_custom_host").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            
            counts: {
                required: true,
                rangelength:[1,3]
            }
        },
        messages: {
            
            counts: {
                required: "请输入新密码",
                rangelength:"购买数量最大为999"
            }
        },

        highlight: function(element){
            $(element).closest('div').removeClass('has-success').addClass('has-error');
            $("#confirmBtn").removeClass("btn-primary").addClass("txt-color-darken").addClass("disabled");
        },

        unhighlight: function(element){
            $(element).closest('div').removeClass('has-error').addClass('has-success');
            $("#confirmBtn").removeClass("disabled").removeClass("txt-color-darken").addClass("btn-primary");
        },

        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css('line-height','20px').css('font-size',"0.75em");
            error.appendTo(element.parent());
        }

    });
}
function validateAddOrderByPackage() {
    $("#addOrderByPackage").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            "order_host_user_package": {
                required: true,
                rangelength:[4,64],
                validateHostUser:true,
                notRoot:true
            },
            counts: {
                required: true,
                rangelength:[1,3]
            }
        },
        messages: {
            "order_host_user_package": {
                required: "请输入用户名",
                rangelength:"用户名应该在4到64位之间",
                validateHostUser:"用户名只能有英文和数字组成",
                notRoot:"用户名不能是root、administrator等管理员用户名"
            },
            counts: {
                required: "请输入新密码",
                rangelength:"购买数量最大为999"
            }
        },

        highlight: function(element){
            $(element).closest('td').removeClass('has-success').addClass('has-error');
            $("#confirmBtn").removeClass("btn-primary").addClass("txt-color-darken").addClass("disabled");
        },

        unhighlight: function(element){
            $(element).closest('td').removeClass('has-error').addClass('has-success');
            $("#confirmBtn").removeClass("disabled").removeClass("txt-color-darken").addClass("btn-primary");
        },

        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css('line-height','20px').css('font-size',"1em");
            error.appendTo(element.parent());
        }

    });
}
jQuery.validator.addMethod("notRoot", function(value, element,param) {
    value = value.toLowerCase();
    if(value === "root" || value === "administrator" ){
        return false;
    }else{
        return true;
    }
},"");

jQuery.validator.addMethod("validateHostUser", function(value, element,param) {
    var reg = /^[A-Za-z0-9]+$/;
    return reg.test(value);
},"");

