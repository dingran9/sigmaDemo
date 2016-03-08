/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:用户
 */
var agreementTable;


function loadAgreementTable(){
    all_agreement_data=null;
    //  loadURL("../../static/cniaas/agreement.html",$("#content_test"));

    $("#agreement_list_table").empty().append("<table id='agreement-table' class='table table-responsive table-striped table-bordered table-hover table-text-center'><thead id='agreement-thead' class=''></thead><tbody id='agreement-tbody' class='table-tbody'></tbody></table>");
    $("#agreement-thead").empty().append(
            "<tr><th width='5%'></th>"+
            "<th class='table-thead' width='60%'>"+rpL("description")+"</th>"+
            "<th class='table-thead' width='35%'>"+rpL("version")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='6' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#agreement-tbody").empty().append(loadStr);
    runagreementDataTables(function(){
        agreementTable=$("#agreement-table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "bSort":false,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 6, "desc" ]],
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

function runagreementDataTables(callback){
//    $("#btn_agreement_update").addClass("disabled");

    doPost("/action/systemAgreement/findAll",{},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = "";

            if(data.length > 0)
                $("#btn_agreement_update").html("编辑");

            for( var i=0;i<data.length;i++){
                str += "<tr id='tr_agreement_" + data[i].id + "' ondblclick=\"showDetail('"+data[i].id+"')\" title=\"双击查看详情\">"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='agreement_" + data[i].id + "' type='checkbox' name='cbx_agreement_list' onclick=\"set_agreement_Sel(this,'"+data[i].id+"')\">"+
                    "<i></i></label></td>"+
                    "<td>"+ data[i].description+"</td>"+
                    "<td>"+data[i].version+"</td>"+
                    "</tr>";
            }
            $("#agreement-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
            $("#agreement-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_agreement_id="";
var all_agreement_data="";
function set_agreement_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#agreement_list_table input[name='cbx_agreement_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_agreement_data = null;
        // all_agreement_data = agreementTable.fnGetData(obj.parent);
        if(null != id)
            sel_agreement_id=id;

        $("#btn_agreement_update,#btn_agreement_delete").removeClass("disabled");

    }else{
        all_agreement_data = null;
        $("#btn_agreement_update,#btn_agreement_delete").addClass("disabled");
    }
    //console.log("id="+id);
}
/**
 * 创建服务协议
 */
function create(){

    var description = $("#description").val();
    if("" == description){
        showErrorMsg("描述不能为空。")
        return;
    }
    var content = editor.document.getBody().getHtml();;
    if("" == content){
        showErrorMsg("服务协议内容不能为空。");
        return;
    }

    $("#agreement_create_btn").attr("disabled",true);
    doPost("/action/systemAgreement/create",{content:content,description:description},function(objs){
        if(objs.httpCode == "200"){
            $("#agreement_create_btn").attr("disabled",false);
            $("#agreement_grid").show().siblings().hide();
            $("#agreement_btns").show();
            loadAgreementTable();
        }else{
            console.log(objs.message)
        }
    });
}
/**
 * 修改服务协议
 */
function update(){
    if("" == sel_agreement_id){
        showErrorMsg("请选择一行。");
        return;
    }
    var description = $("#description").val();
    if("" == description){
        showErrorMsg("描述不能为空。")
        return;
    }
    var content = editor.document.getBody().getHtml();;
    if("" == content){
        showErrorMsg("服务协议内容不能为空。");
        return;
    }
    $("#agreement_create_btn").attr("disabled",true);
    doPost("/action/systemAgreement/update",{id:sel_agreement_id,content:content,description:description},function(objs){
        if(objs.httpCode == "200"){
            $("#agreement_create_btn").attr("disabled",false);
            $("#agreement_grid").show().siblings().hide();
            $("#agreement_btns").show();
            loadAgreementTable();
        }else{
            console.log(objs.message)
        }
    });
}
/**
 * 删除服务协议
 * @param id
 */
function deleteAgreement(){
    if("" == sel_agreement_id){
        showErrorMsg("请选择一行。");
        return;
    }
    $("#btn_agreement_delete").attr("disabled",true);
    doPost("/action/systemAgreement/delete",{id:sel_agreement_id},function(objs){
        if(objs.httpCode == "200"){
            $("#btn_agreement_delete").attr("disabled",false);
            $("#agreement_grid").show().siblings().hide();
            $("#agreement_btns").show();
            loadAgreementTable();
        }else{
            console.log(objs.message)
        }
    });
}
/**
 * 获取详情
 */
function showDetail(id){

    doPost("/action/systemAgreement/findById",{id:id},function(objs){
        if(objs.httpCode == "200"){
            $("#agreement_detail_modal").show().siblings().hide();

            $("#description_detail").html(objs.data.description);
            $("#content_detail").html(objs.data.content);
        }else{
            console.log(objs.message)
        }
    });
}
