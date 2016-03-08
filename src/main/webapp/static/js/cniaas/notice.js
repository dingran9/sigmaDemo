/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:公告
 */
var noticeTable;
var noticeInfoColIndex = [
    "createTime",
    "createTime",
    "createTime",
    "createTime",
    "createTime",
    "createTime",
    "createTime",
    "createTime",
    "createTime",
    "createTime",
    "createTime"
];
function loadNoticePageTable(){
    noticeTable=$("#notice-table").dataTable({
        "bDestroy":true,
        "iDisplayLength" : 10,
        "aaSorting": [[ 3, "asc" ]],
        "bAutoWidth": true,
        "bServerSide": true,
        "sPaginationType" : "bootstrap_full",
        "sAjaxDataProp":"datas",
        "sRowSelect": "single",
        "sAjaxSource": "/action/notice/pageList",
        "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) {
            var params = "account",sort = "asc";
            for(var i=0;i<aoData.length;i++){
                if(aoData[i].name.indexOf("iSortCol") == 0){
                    params = noticeInfoColIndex[aoData[i].value];
                }else if(aoData[i].name.indexOf("sSortDir") == 0){
                    sort = aoData[i].value;
                }
            }

            var pageNo = '', pageSize = '';
            pageSize =  oSettings._iDisplayLength;

            pageNo = oSettings._iDisplayStart / oSettings._iDisplayLength;
            var type = $("#notice_filter_type").html();
            var keyword = $("#noticeValue").val()?$("#noticeValue").val():"";
            if(type == "createTime"){
                var endT=convertStr($("#notice_endDate").val())==""?"":$("#notice_endDate").val()+" 23:59:59";
                keyword = $("#notice_startDate").val() + "|" + endT;
            }
            var data = {keyword:keyword,type:type,pageNo:pageNo,pageSize:pageSize,param:params,sort:sort};
            oSettings.qXHRj = doPost(sSource,data,fnCallback);
        },
        "fnPreDrawCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            //aaData = aData;
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            var str = "";
            str += "<td class='check-tr'><label class='checkbox'>"+
            "<input id='notice_" + aData.id + "' type='checkbox' name='cbx_notice_list' onclick=\"set_notice_Sel(this,'"+aData.id+"')\">"+
                "<i></i></label></td>"+
                "<td ><a onclick='getNoticeDetail("+ aData.id +")'>"+aData.title+"</a></td>"+
            "<td>"+aData.belongManager.email +"</td>"+
            "<td>"+ new Date(aData.createTime).Format("yyyy-MM-dd hh:mm:ss")  +"</td>";
            $(nRow).empty().append(str);
            $(nRow).attr("id",'tr_notice_' + aData.id);
            //$(nRow).attr("onclick","getNoticeDetail("+aData.id+")");
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

    $(".dataTables_length").remove();
    $(".dataTables_filter").empty().css("left","0").append( '<div class="input-group">'+
        '    <div class="input-group-btn" style="left:5px;margin-top:1px;">'+
        '    <button id="notice_filter_col_name" type="button" class="btn btn-default" tabindex="-1" style="height: 33px;">全部</button>'+
        '    <button style="height: 33px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" tabindex="-1">'+
        '    <span class="caret"></span>'+
        '    </button>'+
        '<ul class="dropdown-menu" role="menu" style="background: #FDFCFA;">'+
        '    <li><a onclick="notice_filter_column_onchange(this)" value=""  href="javascript:void(0);">全部</a></li>'+
//        '    <li><a onclick="notice_filter_column_onchange(this)" value="account"  href="javascript:void(0);">用户</a></li>'+
        '    <li><a onclick="notice_filter_column_onchange(this)" value="createTime" href="javascript:void(0);">时间</a></li>'+
        '</ul>'+
        '</div>'+
        '<span id="filter_value_select" style="left: 5px; position: relative;">' +
//        '<input id="noticeValue" type="text" class="form-control" placeholder="查询">'+
        '</span>'+
        '</div> ');
    getKeydownAndKeyupInterval("noticeValue",500,execnoticeSearch);
}
function loadnoticeTable(){
  //  loadURL("../../static/cniaas/notice.html",$("#content_test"));

    $("#notice_list_table").empty().append("<table id='notice-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='notice-thead' class=''></thead><tbody id='notice-tbody' class='table-tbody'></tbody></table>");
    $("#notice-thead").empty().append(
            "<tr>" +
            "<th width='5%'></th>"+
//            "<th class='table-thead' width='5%'>" + rpL("number") + "</th>" +
//            "<th class='table-thead' width='40%'>"+rpL("notice_content")+"</th>"+
            "<th class='table-thead' width='45%'>"+rpL("notice_title")+"</th>"+
            "<th class='table-thead' width='25%'>"+rpL("notice_operator")+"</th>"+
            "<th class='table-thead' width='25%'>"+rpL("notice_createTime")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='5' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>";
    $("#notice-tbody").empty().append(loadStr);
    loadNoticePageTable();
    /*runnoticeDataTables(function(){
        noticeTable=$("#notice-table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 3, "desc" ]],
            "sRowSelect": "single",
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
                "sProcessing": "<img src=’./loading.gif’ />"
            },
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ]
        });
    });*/
}

function runnoticeDataTables(callback){
    all_notice_data = null;
    $("#btn_notice_edit").addClass("disabled");

    doPost("/action/notice/list",{},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = '';
            if(data.length<=0){
                var  s="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
                $("#notice-tbody").empty().append(s);
            }else{
                for( var i=0;i<data.length;i++){
                    str += "<tr id='tr_notice_" + data[i].id + "'>"+
                        "<td class='check-tr'><label class='checkbox'>"+
                        "<input id='notice_" + data[i].id + "' type='checkbox' name='cbx_notice_list' onclick=\"set_notice_Sel(this,'"+data[i].id+"')\">"+
                        "<i></i></label></td>"+
                        "<td onclick='getNoticeDetail("+ data[i].id +")'><a>"+data[i].title+"</a></td>"+
//                        "<td class='text-overflow' style='white-space: nowrap;'>"+data[i].content +"</td>"+
                        "<td>"+data[i].belongManager.email +"</td>"+
                        "<td>"+ new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss")  +"</td>"+
                        "</tr>";
                }
                $("#notice-tbody").empty().append(str);
                callback();
            }

        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
            $("#notice-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_notice_id="";
var all_notice_data="";
function set_notice_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#notice_list_table input[name='cbx_notice_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_notice_data = null;
       // all_notice_data = noticeTable.fnGetData(obj.parent);
        if(null != id)
            sel_notice_id=id;

        $("#btn_notice_edit").removeClass("disabled");
        $("#btn_notice_delete").removeClass("disabled");

    }else{
        all_notice_data = null;
        $("#btn_notice_edit").addClass("disabled");
        $("#btn_notice_delete").addClass("disabled");
    }
    //console.log("id="+id);
}
var notice_data_id=null;
var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
function getNoticeDetail(id){
    doPost("/action/notice/detail",{noticeId:id},function(objs){
        if(objs.httpCode=="200"){
            $("#notice_detail_modal").show().siblings().hide();
            $(".breadcrumb").find("li:last").remove();
            $(".breadcrumb").append('<li>公告详情</li>');
//            $("#notice_detail_modal .summernote").code(objs.data.content);

            $("#btn_notice_delete1").attr("onclick","deleteNotice("+id+")");
            $("#btn_notice_goToEditModal").attr("dataId",id);
            $("#notice_detail_content").html(objs.data.content);
            $("#notice_detail_title").html(objs.data.title);
            $("#notice_detail_name").html("<span style='font-weight:600;'>"+objs.data.belongManager.role.name+" </span>");
//            $("#notice_detail_date").html(new Date(objs.data.createTime).Format("yyyy年MM月dd日 hh:mm:ss"));

            var dateStr = new Date(objs.data.createTime).Format("yyyy-MM-dd hh:mm:ss");
            var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
            var d1=weekDay[myDate.getDay()];
            var d=new Date(objs.data.createTime).Format("yyyy年MM月dd日");
            var d2=new Date(objs.data.createTime).Format("hh:mm:ss");
            $("#notice_detail_date").html(d +" ("+d1+") "+d2);
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }
    });
}
function deleteNotice(id){
    if(!id){
        id = sel_notice_id;
    }
    doPost("/action/notice/delete", {noticeId: id}, function (objs) {
        if (objs.httpCode == "200") {
            loadnoticeTable();
            $('#btn_notice_delete').addClass("disabled");
            showMsg("温馨提示", "删除公告成功。");
            backToTable();
        } else {
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("", "code :" + objs.code + "  msg:" + objs.message);
        }
    });
}
function backToTable(){
    $(".breadcrumb").find("li:last").remove();
    $(".breadcrumb").append('<li>公告管理</li>');
    $("#notice_detail_modal").hide();
    $("#notice_btns").show();
    $("#notice_widget-grid").show();
    $('input[name="cbx_notice_list"]').attr("checked", false);

}


function execnoticeSearch() {
    var data = noticeTable.fnSettings();
    noticeValue = $("#noticeValue").val();
    //$("#notice_list_table .dt-bottom-row").remove();
    noticeTable.fnDraw();
}

function noticeExecFilter(){
    var data = noticeTable.fnSettings();
    //$("#notice_list_table .dt-bottom-row").remove();
    noticeTable.fnDraw();
}

function notice_filter_column_onchange(_this){
    var value = String($(_this).attr("value"));
    $("#notice_filter_col_name").html($(_this).html());
    notice_filter_value_select(value);
    $("#notice_filter_type").html(value);
}

function notice_filter_value_select(value){
    value = String(value);
    switch (value){
        case "":
            $("#filter_value_select").empty();
            $("#notice_filter_type").html("");
            noticeExecFilter();
            break;
        case "account":
            $("#filter_value_select").empty().append('<input id="noticeValue" class="form-control col-sm-1" style="width: 160px;" type="text">');
            $("#notice_filter_type").html("account");
            break;
        case "createTime":{
            $("#filter_value_select").empty().append(
                    '<input  id="notice_startDate" type="text" class="form-control" placeholder="起始时间" style="width: 120px;height: 32px;">' +
                    '<span class="col-sm-1" style="width:20px;margin-left: 1px;margin-top:10px;">--</span>'+
                    '<input  id="notice_endDate" type="text" class="form-control" placeholder="截止时间" style="width: 120px;margin-left: 158px;margin-top:-32px;height: 32px;">');

//            $(".dataTables_filter .input-group").css("width","100%");

            // START AND FINISH DATE
            $('#notice_startDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#notice_endDate').datepicker('option', 'minDate', selectedDate);
                    noticeExecFilter();
                }
            });

            $('#notice_endDate').datepicker({
                dateFormat: 'yy-mm-dd',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                onSelect: function (selectedDate) {
                    $('#notice_startDate').datepicker('option', 'maxDate', selectedDate);
                    noticeExecFilter();
                }
            });

            break;
        }
    }

    getKeydownAndKeyupInterval("noticeValue",500,execnoticeSearch);
    getKeydownAndKeyupInterval("notice_startDate_search_input",500,execnoticeSearch);
    getKeydownAndKeyupInterval("notice_endDate_search_input",500,execnoticeSearch);

}
