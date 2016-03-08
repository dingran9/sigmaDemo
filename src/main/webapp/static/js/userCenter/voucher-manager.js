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
loadVoucherTable();
function loadVoucherTable(){
    $("#voucher-manager").empty().append("<table id='voucher-table' class='table table-responsive table-striped table-bordered table-hover table-text-center'><thead id='voucher-thead' class=''></thead><tbody id='voucher-tbody' class='table-tbody'></tbody></table>");

    $("#voucher-thead").empty().append(
            "<th class='table-thead'>"+rpL("voucher-code")+"</th>"+
            "<th class='table-thead'>"+rpL("voucher-sum")+"</th>"+
            "<th class='table-thead'>"+rpL("voucher-endDate")+"</th>"+
            "<th class='table-thead'>"+rpL("voucher-descript")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='6' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#voucher-tbody").empty().append(loadStr);
    runVoucherDataTables(function(){
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

function runVoucherDataTables(){
    var  data = [
        {code:1,consume_amount_limited:'324',date:'2014-08-09',sum:'240',cash:'120',voucher:'130'},
        {code:1,consume_amount_limited:'34',date:'2014-08-09',sum:'240',cash:'120',voucher:'130'},
        {code:1,consume_amount_limited:'3445',date:'2014-08-09',sum:'240',cash:'120',voucher:'130'}
    ];

    var str = '';
    for( var i=0;i<data.length;i++){
        str += "<tr ondblclick=\"showimageDetail('" + data[i].code + "')\" title='双击可查看详情'>" +
            "<td class='text-left'>" + data[i].code + "</td>" +
            "<td class='text-left'>" + data[i].sum + "</td>" +
            "<td class='text-left'>" + data[i].date + "</td>" +
            "<td class='text-left'>" + "最低消费"+data[i].consume_amount_limited + "元可用" + "</td>" +
            "</tr>";
    }
    $("#voucher-tbody").empty().append(str);
}