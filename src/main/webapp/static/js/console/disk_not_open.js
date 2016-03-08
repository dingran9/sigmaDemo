/**
 * Created by songxiaoguang on 2015/1/9.
 */
/**
 * Created by songxiaoguang on 2015/1/8.
 */

var diskNotOPenTable;
function loadDiskNotOpenData(params) {
    $("#disk_not_open_list_table").empty().append("<table id='disk_not_open_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='disk_not_open_thead' class='talign_c'></thead><tbody id='disk_not_open_tbody'></tbody></table>");
    $("#disk_not_open_thead").empty().append(
            "<tr>" +
            //"<th  width='20%' ></th>"+
            "<th class='talign_c' style='width:20%;'>"+rpL("account")+"</th>"+
            "<th class='talign_c' style='width:20%;'>"+rpL("disk_name")+"</th>"+
            "<th class='talign_c' style='width:20%;'>"+rpL("disk_size")+"（G）"+"</th>"+
            "<th class='talign_c' style='width:20%;'>"+rpL("serviceBeginTime")+"</th>"+
            "<th class='talign_c' style='width:20%;'>"+rpL("create_time")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='5' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#disk_not_open_tbody").empty().append(loadStr);
    runDiskNotOpenDataTables(function(){
        diskNotOPenTable = $("#disk_not_open_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 4, "asc" ]],
            "sRowSelect": "single",
            "aoColumnDefs": [
                {
                    bSortable: false,
                    aTargets: [  ]
                },
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ],
            "oLanguage": {
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "",
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "oPaginate": {"sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                },
                "sFilterPlace":"请输入关键词",
                "sZeroRecords": "没有检索到数据",
                "sProcessing": "<img src='./loading.gif'/>"
            },
            //"sDom" : "R<'dt-top-row'Clf>r<'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
            "fnInitComplete" : function(oSettings, json) {
                //$('.ColVis_Button').addClass('btn btn-default btn-sm').html('显示列<i class="icon-arrow-down"></i>');
            }
        });
        afterTableLoad("disk_tab");
    },params);
}

function runDiskNotOpenDataTables(callback,params) {
    doPost(params.url,params.data,function (objs){
        var data = objs.data;
        if (objs.httpCode == "200"&&data!=null) {
            var str = "",serviceBeginTime = '--',createTime = '--';

            for (var i = 0; i < data.length; i++) {
                serviceBeginTime = '--';
                createTime = '--';
                if(data[i].serviceBeginTime){
                    serviceBeginTime = new Date(data[i].serviceBeginTime).Format("yyyy-MM-dd hh:mm:ss");
                }
                if(data[i].createTime){
                    createTime = new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss");
                }
                str +="<tr>" +
                    //"<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_volume_list' " +
                    //"onclick=\"setDiskNotOPenSel(this,'" + data[i].resource_id + "')\"><i></i></label></td>" +
                    "<td class='text-center'>" +data[i].user  + "</td>" +
                    "<td class='text-center'>" + data[i].name + "</td>" +
                    "<td class='text-center'>" + data[i].size + "</td>" +
                    "<td class='text-center'>" + serviceBeginTime + "</td>" +
                    "<td class='text-center'>" + createTime + "</td>" +
                    "</tr>";
            }
            $("#disk_not_open_tbody").empty().append(str);
            //获取待开通个数
            $("#disk_not_open_count").html(data.length);

        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='5' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
            $("#disk_not_open_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            return function () {
            };
        }
        $("#disk_not_open_thead").show();
        callback();
    });

}