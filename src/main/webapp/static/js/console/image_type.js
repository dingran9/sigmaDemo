/**
 * Created by songxiaoguang on 2015/1/8.
 */

var sel_image_type_id,
    sel_image_type_name,
    ImageTypeTable;
function setImageTypeSel(obj,id,name){

    var obj_checked = obj.checked;
    $("#image_type_table input[name='cbx_image_type_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        sel_image_type_id = id;
        sel_image_type_name=name;
        $("#btn_image_type_delete,#btn_image_type_update").removeClass('disabled');
    }else{
        sel_image_type_id = "";
        sel_image_type_name="";
        $("#btn_image_type_delete,#btn_image_type_update").addClass('disabled');
    }
}

function initImageTypeBtnStatus(){
    $("#btn_image_type_delete,#btn_image_type_update").addClass('disabled');
    sel_image_type_id = "";
    sel_image_type_name="";
}
function loadImageTypeData(params) {
    initImageTypeBtnStatus();
    $("#image_type_list_table").empty().append("<table id='image_type_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='image_type_thead' class='talign_c'></thead><tbody id='image_type_tbody'></tbody></table>");
    $("#image_type_thead").empty().append(
            "<tr>" +
            "<th class='talign_c' style='width:18px;'></th>"+
            "<th class='talign_c'>"+rpL("name")+"</th>"+
            "<th class='talign_c'>"+rpL("region")+"</th>"+
            "<th class='talign_c'>"+rpL("create_time")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='8' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#image_type_tbody").empty().append(loadStr);
    runImageTypeDataTables(function(){
        ImageTypeTable = $("#image_type_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 3, "desc" ]],
            "sRowSelect": "single",
            "aoColumnDefs": [
                {
                    bSortable: false,
                    aTargets: [ 0 ]
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
            "sDom" : "R<'dt-top-row'Clf>r<'dt-wrapper't><'dt-row dt-bottom-row'<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>",
            "fnInitComplete" : function(oSettings, json) {
                $('.ColVis_Button').addClass('btn btn-default btn-sm').html('显示列<i class="icon-arrow-down"></i>');
            }
        });
//        afterTableLoad("image_tab");
        /*$(".initPage #s2").removeClass("active").removeClass("in").css("visibility",'visible');
         $(".tab-content").removeClass("initPage");*/
    },params);
}

function runImageTypeDataTables(callback,params) {

    doPost(params.url,params.data,function (objs){
        var data = objs.datas;
        if (objs.httpCode == "200"&& data!=null) {
            var str = "",createTime = "--",regionName = $("#regionList_image .btn-primary").html();;
            for (var i = 0; i < data.length; i++) {
                createTime = "--";
                if(data[i].createTime){
                    createTime = new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss");
                }
                str +=
                    "<tr>" +
                    "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_image_type_list' " +
                    "onclick=\"setImageTypeSel(this,'" + data[i].id + "','" + data[i].name + "')\"><i></i></label></td>" +
                    "<td class='text-center'>" +data[i].name  + "</td>" +
                    "<td class='text-center'>"+regionName+"</td>" +
                    "<td class='text-center'>" + createTime + "</td>" +
                    "</tr>";
            }
            $("#image_type_tbody").empty().append(str);
            //获取待开通个数
            $("#image_type_count").html(data.length);

        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
            $("#image_type_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            return function () {
            };
        }
        $("#image_type_thead").show();
        callback();
    });

}
//新增镜像类型
function addImageType(){
    var regionId = $("#regionList_image .btn-primary").attr("id");
    var name=$("#imageType_add_name").val();
    if(convertStr(name)==""){
        showErrorMsg("温馨提示","名称不能为空");
        return;
    }
    doPost("/action/systemImage/addImageType", {"regionId":regionId,"name":name}, function (objs){
        if (objs.httpCode == "200") {
            $("#imageType_add_oper_modal").modal("hide");
            showMsg("操作成功", "成功新增镜像类型。");
            refreshImagesType();
        } else {
            showErrorMsg("", "新增镜像类型失败。");
        }
    });
}
//删除镜像类型
function deleteImageType(){

    if(sel_image_type_id==null || sel_image_type_id==""){
        showErrorMsg("","镜像类型ID不能为空。");
        return;
    }
    showConfirm("fa-play", "删除镜像类型", "是否要删除该镜像类型?", function () {
        doPost("/action/systemImage/deleteImageType", {"imageTypeId":sel_image_type_id}, function (objs){
            if (objs.httpCode == "200") {
                showMsg("操作成功", "成功删除镜像类型。");
                refreshImagesType();
            } else {
                showErrorMsg("", "删除镜像类型失败。");
            }
        });
    });
}

function updateImageType(){
    if(sel_image_type_id==null || sel_image_type_id==""){
        showErrorMsg("","镜像类型ID不能为空。");
        return;
    }
    var imageTypeName=$("#imageType_update_name").val();
    if(imageTypeName==null || imageTypeName==""){
        showErrorMsg("","镜像类型名称不能为空。");
        return;
    }
    doPost("/action/systemImage/updateImageType", {"imageTypeId":sel_image_type_id,"imageTypeName":imageTypeName}, function (objs){
        if (objs.httpCode == "200") {
            showMsg("操作成功", "成功编辑镜像类型。");
            $("#imageType_update_oper_modal").modal("hide");
            refreshImagesType();
        } else {
            showErrorMsg("", "编辑镜像类型失败。");
        }
    });
}