/**
 * Copyright: biology
 * Author：Zhangly
 * Date: 2014/9/10.
 * Description:
 */
/**
 * Copyright: biology
 * Author：Zhangly
 * Date: 2014/9/10.
 * Description:
 */
/**
 * Copyright: biology
 * Author：Zhangly
 * Date: 2014/9/10.
 * Description:
 */
loadChargeRecordTable();
function loadChargeRecordTable(){
    $("#charge-record-manager").empty().append("<table id='charge-record-table' class='table table-responsive table-striped table-bordered table-hover table-text-center'><thead id='charge-record-thead' class=''></thead><tbody id='charge-record-tbody' class='table-tbody'></tbody></table>");

    $("#charge-record-thead").empty().append(
            "<th style='width: 240px;' class='table-thead'>"+rpL("charge-record-sum")+"</th>"+
            "<th class='table-thead'>"+rpL("charge-record-type")+"</th>"+
            "<th class='table-thead'>"+rpL("charge-record-date")+"</th>"+
            "<th class='table-thead'>"+rpL("charge-record-payer")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='4' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#charge-record-tbody").empty().append(loadStr);
    runChargeRecordDataTables(function(){
        $("#image_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 1, "asc" ]],
            "sRowSelect": "single",
            "oLanguage": {
                "sZeroRecords": "抱歉， 没有找到",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {"sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                "sProcessing": "<img src=’./loading.gif’ />"
            }
        });
    });
}

function runChargeRecordDataTables(){
    var  data = [
        {code:1,date:'2014-08-09',sum:'240',type:'120',payer:'130'},
        {code:1,date:'2014-08-09',sum:'240',type:'120',payer:'130'},
        {code:1,date:'2014-08-09',sum:'240',type:'120',payer:'130'}
    ];

    var str = '';
    for( var i=0;i<data.length;i++){
        str += "<tr ondblclick=\"showimageDetail('" + data[i].code + "')\" title='双击可查看详情'>" +
            "<td class='text-left'>" + data[i].sum + "</td>" +
            "<td class='text-left'>" + data[i].type + "</td>" +
            "<td class='text-left'>" + data[i].date + "</td>" +
            "<td class='text-left'>" + data[i].payer + "</td>" +
            "</tr>";
    }
    $("#charge-record-tbody").empty().append(str);
}