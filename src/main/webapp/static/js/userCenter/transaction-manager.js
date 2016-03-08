/**
 * Copyright: biology
 * Author：Zhangly
 * Date: 2014/9/10.
 * Description:
 */
loadTransactionTable();
function loadTransactionTable(){
$("#transaction-management").empty().append("<table id='transaction-table' class='table table-responsive table-striped table-bordered table-hover table-text-center'><thead id='transaction-thead' class=''></thead><tbody id='transaction-tbody' class='table-tbody'></tbody></table>");

$("#transaction-thead").empty().append(
        "<th class='table-thead'>"+rpL("transaction-code")+"</th>"+
        "<th class='table-thead'>"+rpL("transaction-type")+"</th>"+
        "<th class='table-thead'>"+rpL("transaction-date")+"</th>"+
        "<th class='table-thead'>"+rpL("transaction-sum-of-money")+"</th>"+
        "<th class='table-thead'>"+rpL("transaction-cash")+"</th>"+
        "<th class='table-thead'>"+rpL("transaction-voucher")+"</th>"+
        "</tr>");

var  loadStr="<tr class='odd'><td valign='top' colspan='6' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
$("#transaction-tbody").empty().append(loadStr);
runTransactionDataTables(function(){
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

function runTransactionDataTables(){
  var  data = [
      {code:1,type:'w',date:'2014-08-09',sum:'240',cash:'120',voucher:'130'},
      {code:1,type:'w',date:'2014-08-09',sum:'240',cash:'120',voucher:'130'},
      {code:1,type:'w',date:'2014-08-09',sum:'240',cash:'120',voucher:'130'}
  ];

    var str = '';
    for( var i=0;i<data.length;i++){
        str += "<tr ondblclick=\"showimageDetail('" + data[i].code + "')\" title='双击可查看详情'>" +
            "<td class='text-left'>" + data[i].code + "</td>" +
            "<td class='text-left'>" + data[i].type + "</td>" +
            "<td class='text-left'>" + data[i].date + "</td>" +
            "<td class='text-left'>" + data[i].sum + "</td>" +
            "<td class='text-left'>" + data[i].cash + "</td>" +
            "<td class='text-left'>" + data[i].voucher + "</td>" +
            "</tr>";
    }
    $("#transaction-tbody").empty().append(str);
}