/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:订单
 */
var couponListTable;
var couponListValue;
var all_coupon_list_data = null;

function loadCouponListTable() {
    //  loadURL("../../static/cniaas/coupon.html",$("#content_test"));

    $("#couponList_table").empty().append("<table id='couponList-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='coupon_list_thead' class=''></thead><tbody id='coupon_list_tbody' class='coupon_list_tbody'></tbody></table>");
    $("#coupon_list_thead").empty().append(
            "<tr><th width='5%'><label class='checkbox'>"+
            "<input id='coupon_list_all' type='checkbox' name='coupon_list_all' onclick=\"checkALL(this)\">"+
            "<i></i></label></th>"+
            "<th class='table-thead'  width='5%'>" + rpL("number") + "</th>" +
            "<th class='table-thead'  width='14%'>" + rpL("couponNumber") + "</th>" +
            "<th class='table-thead'  width='12%'>" + rpL("amount") + "</th>" +
            "<th class='table-thead'  width='13%'>" + rpL("consumeAmountLimited") + "</th>" +
            "<th class='table-thead'  width='10%'>" + rpL("status") + "</th>" +
            "<th class='table-thead'  width='10%'>" + rpL("activeExpireTime") + "</th>" +
            "<th class='table-thead'  width='10%'>" + rpL("beginTime") + "</th>" +
            "<th class='table-thead'  width='10%'>" + rpL("endTime") + "</th>" +
            "<th class='table-thead'  width='10%'>" + rpL("createTime") + "</th>" +
            "</tr>");

    var loadStr = "<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#coupon_list_tbody").empty().append(loadStr);
    couponListTableInit();
}
var CouponColIndex = [
    "couponNumber",
    "couponNumber",
    "couponNumber",
    "amount",
    "consumeAmountLimited",
    "status",
    "status",
    "beginTime",
    "endTime",
    "createTime"
];

function couponListTableInit(){
    couponListTable=$("#couponList-table").dataTable({
        "bDestroy":true,
        "bLengthChange":[10,20,50,100,200],
        "iDisplayLength" : 10,
        "aaSorting": [[ 9, "desc" ]],
        "bAutoWidth": true,
        "bServerSide": true,
        "sPaginationType" : "bootstrap_full",
        "sAjaxDataProp":"datas",
        "sRowSelect": "single",
        "sAjaxSource": "/action/couponList/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "couponNumber",sort = "asc";
            for(var i=0;i<aoData.length;i++){
                 if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = CouponColIndex[aoData[i].value];
                 }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                 }
             }
            var pageNo = '', pageSize = '';

            pageSize = oSettings._iDisplayLength;
            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#coupon_list_filter_type").html();
            var keyword = $("#couponListValue").val()?$("#couponListValue").val():"";
            var data = {keyword:keyword,type:type,pageNo:pageNo,pageSize:pageSize,param:params,sort:sort};
            oSettings.qXHRj = $.ajax( {
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": data,
                "success": function(json) {
                    if(json=='<script type="text/javascript">window.location.href = "/login.jsp";</script>'){
                        window.location.replace("/login.jsp");
                    }else
                    if(json.httpCode == 403 && json.code == "Forbidden.NoPermission"){
                        showErrorMsg(rpL(json.code),rpLRespond(json.message));
                    }else if(json.httpCode=="403" && json.code =="Forbidden"){
                        console.log("code:403 , message:服务器拒绝请求，请检查帐号、口令等参数  ,  code:Frobidden");
                        window.location.href = "../../../login.jsp";
                    }else if(json.httpCode=="400" && json.code =="Operation.UnKnown"){
                        console.log("code:400 , message:未知的操作请求  ,  code:Operation.UnKnown");
                        showErrorMsg(rpL(json.code),rpLRespond(json.message));
                    }else if(json.httpCode=="400" && json.code =="Parameter.Invalid"){
                        console.log("code:400 , message:请求参数无效  ,  code:Parameter.Invalid");
                        showErrorMsg(rpL(json.code),rpLRespond(json.message));
                    }else{
                        fnCallback(json);
                    }
                }
            } );
        },
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var activeTime=convertStr(aData.activeTime)==""?"-":new Date(aData.activeTime).Format("yyyy-MM-dd");
            var activeExpireTime=convertStr(aData.activeExpireTime)==""?"-":new Date(aData.activeExpireTime).Format("yyyy-MM-dd");
            var beginTime=convertStr(aData.beginTime)==""?"-":new Date(aData.beginTime).Format("yyyy-MM-dd");
            var endTime=convertStr(aData.endTime)==""?"-":new Date(aData.endTime).Format("yyyy-MM-dd");
            var createTime=convertStr(aData.createTime)==""?"-":new Date(aData.createTime).Format("yyyy-MM-dd");

            var statusColor = "red";
            if("NotActivated" == aData.status){
                statusColor = "";
            }
            var activeTimeShow = (aData.status=="HasActivated")?activeTime:activeExpireTime;
            var str = "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='coupon_list" + aData.id + "' type='checkbox' name='cbx_coupon_list' value='"+aData.id+"' expireTime="+ aData.activeExpireTime +" status="+ aData.status+" onclick=\"set_coupon_list_Sel(this,'"+aData.id+"')\">"+
                    "<i></i></label></td>"+
                    "<td>"+(++iDisplayIndex)+"</td>"+
                    "<td><a href='javascript:showCouponListDetail("+aData.id+");'>"+aData.couponNumber+"</a></td>"+
                    "<td class='pay-balance'>"+aData.amount+"</td>"+
                    "<td class='pay-balance'>"+aData.consumeAmountLimited +"</td>"+
                    "<td class='"+statusColor+"'>"+rpL(aData.status)+"</td>"+
                    "<td>"+ activeTimeShow  +"</td>"+
                    "<td>"+ beginTime +"</td>"+
                    "<td>"+ endTime +"</td>"+
                    "<td>"+ createTime +"</td>";
            $(nRow).empty().append(str);
//            $(nRow).prop("title","双击可看详情");
            $(nRow).attr("ondblclick","showCouponListDetail('"+aData.id+"');");
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
                aTargets: [ 0,1 ]
            },
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ]
    });
    //$("#couponList_table .dataTables_length").remove();
    $("#couponList_table .dataTables_filter").empty().css("left","5px").css("margin-top","1px").append( '<div class="input-group">'+
        '    <div class="input-group-btn">'+
        '    <button id="coupon_list_filter_name" type="button" class="btn btn-default" tabindex="-1" style="height: 32px;">全部</button>'+
        '    <button style="height: 32px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="coupon_list_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
        '    <li><a onclick="coupon_list_filter_column_onchange(this)" value="status"  href="javascript:void(0);">状态</a></li>'+
        '    <li><a onclick="coupon_list_filter_column_onchange(this)" value="couponNumber"  href="javascript:void(0);">代金卷编号</a></li>'+
        '    <li><a onclick="coupon_list_filter_column_onchange(this)" value="amount" href="javascript:void(0);">金额</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="coupon_list_filter_value_select">' +
//        '<input style="height: 32px;width: 160px;" id="couponListValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div>');

    getKeydownAndKeyupInterval("couponListValue",500,execCouponListSearch);

    $('#couponList-table').delegate('tr', 'click', function (event) {
        all_coupon_list_data = null;
        all_coupon_list_data = couponListTable.fnGetData(this);
    });
}

function execCouponListSearch() {
    var data = couponListTable.fnSettings();
    couponListValue = $("#couponListValue").val();
    //$("#couponList_table .dt-bottom-row").remove();
    couponListTable.fnDraw();
}
function couponListExecFilter(){
    var data = couponListTable.fnSettings();
    //$("#couponList_table .dt-bottom-row").remove();
    couponListTable.fnDraw();
}

function coupon_list_filter_column_onchange(_this){
    var value = String($(_this).attr("value"));
    $("#coupon_list_filter_name").html($(_this).html());
    coupon_list_filter_value_select(value);
    $("#coupon_list_filter_type").html(value);
}

function coupon_list_filter_value_select(value){
    value = String(value);
    getKeydownAndKeyupInterval("couponListValue",500,execCouponListSearch);
    switch (value){
        case "":
            $("#coupon_list_filter_value_select").empty();
            $("#coupon_list_filter_type").html("");
            couponListExecFilter();
            break;
        case "amount":
            $("#coupon_list_filter_value_select").empty().append('<input id="couponListValue" class="form-control col-sm-1" style="width: 160px;" type="text"  placeholder="金额">');
            break;
        case "couponNumber":{
            $("#coupon_list_filter_value_select").empty().append('<input id="couponListValue" class="form-control col-sm-1" style="width: 160px;" type="text"  placeholder="代金卷编号">');
            break;
        }
        case "status":
            $("#coupon_list_filter_value_select").empty().append('<select class="form-control col-sm-1" style="width: 160px;" id="couponListValue"  value="" onchange="couponListExecFilter()">'+
                '<option value="">全部</option>'+
                '<option value="NotActivated">未激活</option>'+
                '<option value="HasActivated">已激活</option>'+
                '<option value="OverdueActivation">过期未激活</option>'+
                '</select>');
            break;
    }

    getKeydownAndKeyupInterval("couponListValue",500,execCouponListSearch);
}
/**
 * 设置全选
 * @param obj
 */
function checkALL(obj){
    if(obj.checked){
        $("#btn_export_excel,#btn_coupon_delete").removeClass("disabled");
        selectAll("cbx_coupon_list");
    }else{
        uncheckAll("cbx_coupon_list");
        $("#btn_export_excel,#btn_coupon_delete").addClass("disabled");
    }
}
/**
 * 设置选中
 * @param obj
 * @param id
 */
function set_coupon_list_Sel(obj,id){
    if(obj.checked){
        $(obj).attr("checked",true);

        $("#btn_export_excel,#btn_coupon_delete").removeClass("disabled");
    }else{
        var len = 0;
        $("[name='cbx_coupon_list'][checked]").each(function(){
            len ++;
        })
        if(len <= 1) {
            $("#btn_export_excel,#btn_coupon_delete").addClass("disabled");
        }
        $(obj).removeAttr("checked");
    }
}

/**
 * 显示详情
 */
function showCouponListDetail(id){
    if(convertStr(id) == ""){
        console.log("请选中一行");
        showErrorMsg("提示","请选中一行");
        return;
    }
    doPost("/action/couponList/findById", {id:id}, function (objs) {
        if (objs.httpCode == "200") {

            var activeTime = convertStr(objs.data.couponList.activeTime)==""?"-":new Date(objs.data.couponList.activeTime).Format("yyyy-MM-dd");
            var activeExpireTime = convertStr(objs.data.couponList.activeExpireTime)==""?"-":new Date(objs.data.couponList.activeExpireTime).Format("yyyy-MM-dd");
            var beginTime = convertStr(objs.data.couponList.beginTime)==""?"-":new Date(objs.data.couponList.beginTime).Format("yyyy-MM-dd");
            var endTime = convertStr(objs.data.couponList.endTime)==""?"-":new Date(objs.data.couponList.endTime).Format("yyyy-MM-dd");
            var createTime = convertStr(objs.data.couponList.createTime)==""?"-":new Date(objs.data.couponList.createTime).Format("yyyy-MM-dd");
            var updateTime = convertStr(objs.data.couponList.updateTime)==""?"-":new Date(objs.data.couponList.updateTime).Format("yyyy-MM-dd");

            var statusColor = "red";
            if("NotActivated" == objs.data.couponList.status){
                statusColor = "";
            }

            $("#coupon_number").html(objs.data.couponList.couponNumber);
            $("#coupon_password").html(objs.data.couponList.couponPassword);
            $("#amount").html(objs.data.couponList.amount);
            $("#consume_amount_limited").html(objs.data.couponList.consumeAmountLimited);
            $("#status").html(rpL(objs.data.couponList.status)).addClass(statusColor);
            var account = objs.data.couponList.account;
            var email = (account == null)?"":account.email;

            $("#active_account").html(email);
            $("#product_package").html(objs.data.productPackage);
            $("#product_cat").html(objs.data.productCat);
            $("#active_time").html(activeTime);
            $("#active_expire_time_detail").html(activeExpireTime);
            $("#begin_time").html(beginTime);
            $("#end_time").html(endTime);
            $("#create_time").html(createTime);
            $("#update_time").html(updateTime);

            $("#coupon_list_detail_modal").show().siblings().hide();
            $("#coupon_list_btns").hide();
        } else {
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("", "code :" + objs.code + "  msg:" + objs.message);
        }
    });
}

/**
 * 批量生成系统代金卷
 */
function generateCouponList(){

    var amount = $("#coupon_list_toprice").val();
    if(amount == ""){
        showErrorMsg("","面值不能为空。");
        return;
    }
    var amount_limited = $("#coupon_list_consume_amount_limited").val();
    if(amount_limited == ""){
        showErrorMsg("","最低消费不能为空。");
        return;
    }
    var startDate = $("#coupon_list_startDate_search_input").val();
    if(startDate == ""){
        showErrorMsg("","起始时间不能为空。");
        return;
    }
    var endDate = $("#coupon_list_endDate_search_input").val();
    if(endDate == ""){
        showErrorMsg("","截止时间时间不能为空。");
        return;
    }
    var active_expire_time = $("#active_expire_time").val();
    if(active_expire_time == ""){
        showErrorMsg("","激活超期时间不能为空。");
        return;
    }

    var product_package_id = "_";
    var product_cat_id = "";
    $('#uc-productPackage-list .couponList_productP').each(function () {
        if ($(this).prop('checked') == true) {
            product_package_id += $(this).attr("id") + "_";
        }
    });
    if ($("#uc-product-instances").prop('checked') == true) {
        product_cat_id = "instances"
    } else if ($("#uc-product-disk").prop('checked') == true) {
        product_cat_id = "disks"
    }

    var isExport = $("#coupon_list_is_export").prop('checked');

    var data = {
        productPackageId: product_package_id,
        productCat: product_cat_id,
        amount: amount,
        consumeAmountLimited: amount_limited,
        beginTime: startDate,
        endTime: endDate,
        activeExpireTime:active_expire_time,
        count:$("#coupon_count").val(),
        isExport:isExport
    };
    $("#coupon_list_add_btn").addClass("disabled");
    doPost("/action/couponList/generateCouponList", data, function (objs) {
        if (objs.httpCode == "200") {
            if(isExport && convertStr(objs.data) != ""){
                var ids = objs.data;
                //console.log(ids);
                window.location.href = "/action/couponList/exportExcel?ids="+ids;
            }
            loadCouponListTable();
            $("#coupon_list_widget-grid").show().siblings().hide();
            $("#coupon_list_btns").show();
        } else {
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("", "code :" + objs.code + "  msg:" + objs.message);
        }
    });
}
/**
 * 初始套餐
 */
function exportExcel() {
    var ids = "";
    $("[name='cbx_coupon_list'][checked]").each(function(){
        ids+=$(this).val()+",";
    });

    window.location.href = "/action/couponList/exportExcel?ids="+ids;
//    $("#export_excel_ids").val(ids);
//    window.exportExcelFrom.submit();
}
/**
 * 初始套餐
 */
function initCProductPackage(regionId,regionName) {
    doPost("/action/productPackage/list", {status: "enable",regionId:regionId}, function (objs) {
        if (objs.httpCode == "200") {
            var str = "";
            str+='<!--<li  class="dd-item  col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding" data-id="li_11">-->'+
                '<div  class="dd-handle  col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding" style="f1ont-size: 13px;">'+
                '<div class="col-lg-2 col-md-3" style="margin: 0;">'+
                '<label>'+
                '<input style="position:absolute;top:3px;" class="checkbox style-0 couponList_productP1" type="checkbox" id="couponList-pck-all-ckb-'+regionId+'" onchange="select_couponList_all(this,\''+regionId+'\');">'+
                ' <span class=" font-xs ">'+regionName+'</span>'+
                '</label>'+
                '</div>'+
                '<div  class="col-md-9 col-lg-10" style="border-left: 2px solid #CCCCCC; ">';
            if (objs.datas.length > 0) {
                for (var i = 0; i < objs.datas.length; i++) {
                    str +=  '<div class="no-padding col-lg-3" style=" ">'+
                        '<label>'+
                        '<input  class="checkbox style-0 child_box couponList_productP" type="checkbox"  id="' + objs.datas[i].id + '" onchange="isAllCouponListFalse(this,\''+regionId+'\');" name="coupon-pck-ckb-'+regionId+'"  >'+
                        '<span class="font-xs">   ' + objs.datas[i].packageName +'</span>'+
                        '</label>'+
                        '</div>';
                }
                str+="</div></div><!--</li>-->";
            }
            $("#uc-productPackage-list").append(str);
        } else {
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("", "code :" + objs.code + "  msg:" + objs.message);
        }
    });
}
function initProduct() {
    doPost("/action/productCat/list", {}, function (objs) {
        if (objs.httpCode == "200") {
            var str = "";
            if (objs.datas.length > 0) {
                for (var i = 0; i < objs.datas.length; i++) {
                    str += '<label class="col-lg-3">' +
                        '<input id="' + objs.datas[i].id + '"" type="checkbox" class="coupon_list_product">' +
                        ' ' + objs.datas[i].name +
                        ' </label>';
                }
            }
            $("#uc-product").empty().append(str);
        } else {
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("", "code :" + objs.code + "  msg:" + objs.message);
        }
    });
}

/**
 * 设置是否导出
 * @param obj
 */
function setIsExport(obj){
    if(obj.checked){
        $(obj).attr("checked",true);
    }else{
        $(obj).removeAttr("checked");
    }
}

function addCouponListValidate(){
    $("#coupon-wizard-1").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            coupon_list_toprice:{
                required:true,
                digits:true
            },
            coupon_list_consume_amount_limited:{
                required:true,
                digits:true
            }
        },
        messages:{
            coupon_list_toprice:{
                required:"面值不能为空",
                digits:"面值只能是整数"
            },
            coupon_list_consume_amount_limited:{
                required:"最低消费金额限制不能为空",
                digits:"最低消费金额限制只能是整数"
            }
        },
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}


function deleteCouponList(){
    var ids = "";
    var flag = true;
    $("[name='cbx_coupon_list'][checked]").each(function(){
        var expireTime = $(this).attr("expireTime");
        var currentTime = new Date();
        var status = $(this).attr("status");
        if(!(expireTime <= currentTime && status == "NotActivated") &&
            status != "OverdueNoActivation"){
                flag = false;
        }else{
            ids+=$(this).val()+",";
        }
    });
    if(flag){
        doPost("/action/couponList/delete",{ids:ids},function(objs){
            if(objs.httpCode == "200"){
                showMsg("操作成功","代金券已删除",5000);
                loadCouponListTable();
            }else if(objs.httpCode == "400" && objs.code == "State.Incorrect"){
                showErrorMsg("操作失败","只有过期未激活的代金券才可被删除");
            }else{
                    showErrorMsg("操作失败","程序内部错误")
            }
        });
    }else{
        showErrorMsg("操作失败","只有过期未激活的代金券才可被删除");
    }
}

function select_couponList_all(obj,id){
    if($(obj).prop('checked')){
        $(obj).prop('indeterminate',false);
        $(obj).css('visibility','hidden');
        $('input[name^=coupon-pck-ckb-' + id +']').each(function (){
            $(this).checked = true;
            $(this).prop('checked',true);
        });
    }else {
        $('input[name^=coupon-pck-ckb-' + id +']').each(function (){
            $(this).removeAttr('checked');
        });
    }
    isAllCouponList();
}

function isAllCouponListFalse(obj,id){
    $("#couponList-pck-all-ckb-"+ id).prop('checked',false);
    $("#couponList-pck-all-ckb-"+ id).prop('indeterminate',false);
    $("#couponList-pck-all-ckb-"+ id).css('visibility','hidden');
    var flag = true;
    $('input[name^=coupon-pck-ckb-' + id +']').each(function (){
        if($(this).prop('checked') == true ){
            $("#couponList-pck-all-ckb-"+ id).prop('checked',false);
            $("#couponList-pck-all-ckb-"+ id).prop('indeterminate',true);
            $("#couponList-pck-all-ckb-"+ id).css('visibility','visible');
            $("#couponList-pck-all-ckb-"+ id).css('checked',true);
        }else{
            flag = false;
        }
    });
    //flag==true说明具有全部子权限，父节点要改为全选状态
    if(flag){
        $("#couponList-pck-all-ckb-"+ id).prop('checked',true);
        $("#couponList-pck-all-ckb-"+ id).prop('indeterminate',false);
        $("#couponList-pck-all-ckb-"+ id).css('visibility','hidden');
    }
    isAllCouponList();
}
function isAllCouponList(){
    $("#uc_productPackage-list-all").prop('indeterminate',false);
    $("#uc_productPackage-list-all").css('visibility','hidden');
    var flag = true;
    $("#uc-productPackage-list .couponList_productP,#uc-productPackage-list .couponList_productP1").each(function (){
        if(!$(this).prop('checked') == true ){
            flag = false;
        }
    });
    //flag==true说明具有全部子权限，父节点要改为全选状态
    if(flag){
        $("#uc_productPackage-list-all").prop('checked',true);
    }else{
        $("#uc_productPackage-list-all").prop('checked',false);
    }
}