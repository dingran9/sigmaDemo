/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:产品类别
 */
var productCatTable;


function loadproductCatTable(){
  //  loadURL("../../static/cniaas/productCat.html",$("#content_test"));

    $("#productCat_list_table").empty().append("<table id='product_cat-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='product_cat-thead' class=''></thead><tbody id='product_cat-tbody' class='table-tbody'></tbody></table>");
    $("#product_cat-thead").empty().append(
            "<tr>" +
            "<th width='5%'></th>"+
//            "<th class='table-thead' width='5%'>" + rpL("number") + "</th>" +
            "<th class='table-thead' width='22%'>"+rpL("name")+"</th>"+
            "<th class='table-thead' width='23%'>"+rpL("bill_type")+"</th>"+
            "<th class='table-thead' width='25%'>"+rpL("billUnitName")+"</th>"+
            "<th class='table-thead' width='25%'>"+rpL("description")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='6' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>";
    $("#product_cat-tbody").empty().append(loadStr);
    runproduct_catDataTables(function(){
        productCatTable=$("#product_cat-table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 1, "asc" ]],
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
    });
}

function runproduct_catDataTables(callback){
    all_productCat_data = null;
    $("#btn_productCat_edit").addClass("disabled");

    doPost("/action/productCat/list",{},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = '';
            if(data.length<=0){
                var  s="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
                $("#product_cat-tbody").empty().append(s);
            }else{
                var index = 1;
                for( var i=0;i<data.length;i++){
                    str += "<tr id='tr_productCat_" + data[i].id + "'>"+
                        "<td class='check-tr'><label class='checkbox'>"+
                        "<input id='productCat_" + data[i].id + "' type='checkbox' name='cbx_productCat_list' onclick=\"set_productCat_Sel(this,'"+data[i].id+"')\">"+
                        "<i></i></label></td>"+
//                        "<td>"+(index)+"</td>"+
                        "<td>"+data[i].name+"</td>"+
                        "<td>"+rpL(data[i].billType) +"</td>"+
                        "<td>"+data[i].billUnitName +"</td>"+
                        "<td>"+ data[i].description +"</td>"+
                        "</tr>";
                    index++;
                }
                $("#product_cat-tbody").empty().append(str);
                callback();
            }

        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
            $("#product_cat-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_productCat_id="";
var all_productCat_data="";
function set_productCat_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#productCat_list_table input[name='cbx_productCat_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_productCat_data = null;
       // all_productCat_data = productCatTable.fnGetData(obj.parent);
        if(null != id)
            sel_productCat_id=id;

        $("#btn_productCat_edit").removeClass("disabled");

    }else{
        all_productCat_data = null;
        $("#btn_productCat_edit").addClass("disabled");
    }
    //console.log("id="+id);
}

function showProductCatDetail(id){
    doPost("/action/productCat/detail",{productCatId:id},function(objs){

    });
}

