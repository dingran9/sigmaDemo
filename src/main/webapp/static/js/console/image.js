/**
 * Created by songxiaoguang on 2014/11/10.
 */


/**
 * 地域列表
 */
function listRegionsFromImage(){
    doPost("/action/region/findRegionList",{},function(objs){
        if(objs.httpCode == "200") {
            var data = objs.data;
            var str = "";
            if(data==null||data.length<=0){
                showErrorMsg("","获取地域列表失败！");
                return;
            }
            for(var i=0;i<data.length;i++){
                str +=" <a onclick=\"loadImage('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
            }
            $("#regionList_image").empty().append(str).show();
            $("#toolbar_image").show();
            $("#widget-grid-image").show();
//            $("#toolbar_image_type").show();
//            $("#widget-grid-image-type").show();
            loadImage(data[0].regionUuid);//加载第一个
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });
}

//切换地域
function loadImage(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
  //  beforeTableLoad("image_tab_ul","image_tab");
    imageloadData(id);
    var params_image_type ={
        "url":"/action/systemImage/findImageType",
        "data":{"regionId":id}
    };
    //获取未开通云主机列表
    loadImageTypeData(params_image_type);
}

var sel_image_row_id = "",
    sel_image_row_ip="",
    sel_region_id_image="",
    sel_region_id_imageType="",
    all_image_data;
function setimageSel(obj,imagename,ip,imageType){

    sel_region_id_image = $("#regionList_image .btn-primary").attr('id');

    var obj_checked = obj.checked;
    $("#image_table input[name='cbx_image_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != imagename)
            sel_image_row_id = imagename;
        sel_region_id_imageType=imageType;
        sel_image_row_ip = ip;
        all_image_data = imageTable.fnGetData(obj.parent);
        $("#btn_image_update").removeClass('disabled');
    }else{
        sel_image_row_id = "";
        sel_image_row_ip = "";
        sel_region_id_imageType="";
        all_image_data = null;
        $("#btn_image_update").addClass('disabled');
    }
}

//刷新
function refreshImages(){
    var regionId  = $("#regionList_image .btn-primary").attr('id');
    imageloadData(regionId);
}

//刷新
function refreshImagesType(){
    var id = $("#regionList_image .btn-primary").attr('id');
    var params_image_type ={
        "url":"/action/systemImage/findImageType",
        "data":{"regionId":id}
    };
    //获取镜像类型
    loadImageTypeData(params_image_type);

}
var imageTable;
/**
 * 加载数据
 */
function imageloadData(regionId) {
    $("#btn_image_update").addClass('disabled');
    all_image_data = null;
    sel_image_row_id = "";
    sel_region_id_imageType="";
    $("#image_list_table").empty().append("<table id='image_table' class='table table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='image_thead'></thead><tbody id='image_tbody'></tbody></table>");
    $("#image_thead").empty().append(
            "<tr class='talign_c'><th></th>"+
            "<th class='talign_c'>"+"镜像名称"+"</th>"+
            "<th class='talign_c'>"+"类型"+"</th>"+
            "<th class='talign_c'>"+"OS"+"</th>"+
            "<th class='talign_c'>"+"版本"+"</th>"+

            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='7' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#image_tbody").empty().append(loadStr);
    runimageDataTables(function(){
        imageTable = $("#image_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 8, "desc" ]],
            "sRowSelect": "single",
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ],
            "oLanguage": {
                "sFilter":"搜索",
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
            }
        });
    },regionId);
}
function runimageDataTables(callback,regionId) {
    doPost("/action/image/findImageList",{"regionId":regionId}, function (objs) {
        if (objs.httpCode == "200"&&objs.code=="Success") {
            var str = "",imageType="",imageTypeId;

            for (var i = 0; i < objs.data.length; i++) {
                imageType=rpL(objs.data[i].systemImageType)==""?"-":rpL(objs.data[i].systemImageType.name);
                imageTypeId=rpL(objs.data[i].systemImageType)==""?"-":rpL(objs.data[i].systemImageType.id);
                str +="<tr>" +
                    "<td class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_image_list' onclick=\"setimageSel(this,'" + objs.data[i].id + "','" + objs.data[i].os + "','" + imageTypeId+ "')\"><i></i></label></td>" +
                    "<td class='text-center'>" + objs.data[i].name + "</td>" +
                    "<td class='text-center'>" + imageType + "</td>" +
                    "<td class='text-center'>" + objs.data[i].os + "</td>" +
                    "<td class='text-center'>" + rpL(objs.data[i].version) + "</td>" +

                    "</tr>";
            }
            $("#image_tbody").empty().append(str);
        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span>没有检索到数据</span></td></tr>";
            $("#image_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
            return function () {
            };
        }
        $("#image_thead").show();
        callback();
    });
}

function getSyncImageListByRegion(){
    $("#update_image_list_table").empty().append(" <table id='update_image_table' class='table table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'>"+
        "<thead id='update_image_thead'>"+
        "    <tr class='talign_c' role='row'>"+
        "        <th></th>"+
        "        <th class='talign_c'>镜像名称</th>"+
        "        <th class='talign_c'>操作</th>"+
        "        <th class='talign_c'>类型</th>"+
        "    </tr>"+
        "    </thead>"+
        "<tbody id='update_image_tbody'>"+
        "    <tr class='odd'><td class='dataTables_empty' valign='top' colspan='3' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"+
        "</tbody>"+
        "</table>");
    var regionId  = $("#regionList_image .btn-primary").attr('id');
    doPost("/action/image/findSyncImageList",{regionId:regionId,isImageType:true},function(objs){
        if(objs.httpCode == "200" && objs.data){
            var str = "";
            if((objs.data.Deleted == undefined || objs.data.Deleted.length == 0) && (objs.data.Created == undefined  || objs.data.Created.length == 0)){
                showMsg("操作成功","没有需要同步的数据");
                return true;
            }else{
                if( objs.data.Deleted){
                    for(var i = 0 ; i < objs.data.Deleted.length ; i++){
                        str += "<tr><td class='text-center' style='width: 18px;'><label class='checkbox'><input type='checkbox' onclick=\"setUpdateImageSel(this,'" + objs.data.Deleted[i].imageUuid + "','0')\"><i></i></label></td>" +
                            "<td class='text-center' dataID='"+ objs.data.Deleted[i].imageUuid +"'>" + objs.data.Deleted[i].name + "</td>" +
                            "<td class='text-center'>待删除</td>" +
                            "<td class='text-center'>" + objs.data.Deleted[i].systemImageType.name + "</td>" +
                            "</tr>";
                    }
                }
                if(objs.data.Created){
                    var imageTypes="";
                    if(objs.datas.length>0){
                        for(var j=0;j<objs.datas.length;j++){
                            imageTypes+="<option value='"+objs.datas[j].id+"'>"+objs.datas[j].name+"</option>"
                        }
                    }

                    for(var i = 0 ; i < objs.data.Created.length ; i++){
                        str += "<tr><td class='text-center'  style='width: 18px;'><label class='checkbox'><input type='checkbox' onclick=\"setUpdateImageSel(this,'" + objs.data.Created[i].imageUuid + "','1')\"><i></i></label></td>" +
                            "<td class='text-center' dataID='"+ objs.data.Created[i].imageUuid +"'>" + objs.data.Created[i].name + "</td>" +
                            "<td class='text-center'>待新增</td>" +
                            "<td class='text-center'><select id='image_type_select"+objs.data.Created[i].imageUuid+"' style='width: 100%;'>"+imageTypes+"</select></td>" +
                            "</tr>";
                    }
                }

                $("#update_image_tbody").empty().append(str);
                $("#update_image_table_modal").modal("show");
                runUpdateImageDataTables();
            }
        }else{
            console.log("code:"+objs.code+", message:"+objs.message);
            showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
        }
    });

}

function runUpdateImageDataTables(){
    var updateImageTable = null;
    updateImageTable = $("#update_image_table").dataTable({
        "bDestroy":true,
        "bRetrieve":true,
        "sPaginationType" : "bootstrap_full",
        "aaSorting": [[ 1, "desc" ]],
        "sRowSelect": "multiple",
        "bFilter": false,
        "bLengthChange": false,
        "aoColumnDefs": [
            { "sWidth": "20px", "aTargets": [ 0 ] }
        ],
        "oLanguage": {
            "sFilter":"搜索",
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
        }
    });
    updateImageIdDeleteList = [];
    updateImageIdCreateList = [];
}
var updateImageIdDeleteList = [],updateImageIdCreateList = [];
function setUpdateImageSel(obj,id,type){
    if(type == "0"){
        if(updateImageIdDeleteList.indexOf(id) >= 0){
            arrayDelete(updateImageIdDeleteList,id);
        }else{
            updateImageIdDeleteList.push(id);
        }
    }else{
        if(updateImageIdCreateList.indexOf(id) >= 0){
            arrayDelete(updateImageIdCreateList,id);
        }else{
            updateImageIdCreateList.push(id);
        }
    }
}


function confirmOperationModal(){
    $("#update_image_table_modal").modal("hide");
    $("#confirm_update_image_table_modal").modal("show");
    var deleteStr = "", createStr = "";
    for(var i = 0 ; i < updateImageIdDeleteList.length ; i++){
        deleteStr += '<div>'+ $('td[dataId="'+updateImageIdDeleteList[i] +'"]').text()+'</div>';
    }
    deleteStr = deleteStr == ""?"无":deleteStr;

    $("#deleteImageList").empty().append(deleteStr);
    for(var i = 0 ; i < updateImageIdCreateList.length ; i++){
        createStr += '<div>'+ $('td[dataId="'+updateImageIdCreateList[i] +'"]').text()+'</div>';
    }
    createStr = createStr == ""?"无":createStr;
    $("#createImageList").empty().append(createStr);

}

function returnUpdateImageTableList(){
    $("#confirm_update_image_table_modal").modal("hide");
    $("#update_image_table_modal").modal("show");
}

function doSyncImageListByRegion(){
    var regionId  = $("#regionList_image .btn-primary").attr('id');
    //获取待新增的镜像类型
    var updateImageIdAndTypeCreateList=[];
    for(var i=0;i<updateImageIdCreateList.length;i++){
        var typeId=  $("#image_type_select"+updateImageIdCreateList[i]).val();
        updateImageIdAndTypeCreateList.push(updateImageIdCreateList[i]+"|"+typeId);
    }
    console.log(updateImageIdAndTypeCreateList);
    doPost("/action/image/syncImageWithBs",
            {
                    regionId:regionId,
                deletedImageIds:updateImageIdDeleteList.join(","),
                createdImageIds:updateImageIdAndTypeCreateList.join(",")
            },
        function(objs){
            if(objs.httpCode == "200"){
                if(objs.data){
                    showMsg("操作成功","数据同步完成");
                    $("#confirm_update_image_table_modal").modal("hide");
                    refreshImages();
                }else{
                    console.log("code:"+objs.code+", message:"+objs.message);
                    showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
                }
            }else{
                console.log("code:"+objs.code+", message:"+objs.message);
                showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
            }
    });
}


function updateImage(){
    if(sel_image_row_id==null || sel_image_row_id==""){
        showErrorMsg("","镜像不能为空。");
        return;
    }
    var imageTypeId=$("#image_update_imageType").val();
    if(imageTypeId==null || imageTypeId==""){
        showErrorMsg("","镜像类型不能为空。");
        return;
    }
    doPost("/action/systemImage/update", {"imageId":sel_image_row_id,"imageTypeId":imageTypeId}, function (objs){
        if (objs.httpCode == "200") {
            showMsg("操作成功", "成功编辑镜像。");
            $("#image_update_oper_modal").modal("hide");
            refreshImages();
        } else {
            showErrorMsg("", "编辑镜像失败。");
        }
    });
}
