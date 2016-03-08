/**
 * Created by DingRan on 2015/7/24
 */

var InstanceApplyThroughTable;
function setInstanceApplyThroughSel(obj,id,name){

    var obj_checked = obj.checked;
    $("#instanceApply_through_table input[name='cbx_instanceApply_through_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;
}

function loadInstanceApplyThroughData(data) {
    $("#instanceApply_through_list_table").empty().append("<table id='instanceApply_through_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='instanceApply_through_thead' class='talign_c'></thead><tbody id='instanceApply_through_tbody'></tbody></table>");
    $("#instanceApply_through_thead").empty().append(
            "<tr>" +
            "<th class='talign_c' style='display: none;'></th>"+
                "<th class='talign_c'>"+"姓名"+"</th>"+
                "<th class='talign_c'>"+"手机/邮箱"+"</th>"+
                "<th class='talign_c'>"+"公司名称"+"</th>"+
                "<th class='talign_c'>"+"服务器配置"+"</th>"+
                "<th class='talign_c'>"+"服务器用途"+"</th>"+
                "<th class='talign_c'>"+"申请说明"+"</th>"+
                "<th class='talign_c'>"+"申请时间"+"</th>"+
                "<th class='talign_c'>"+"通过时间"+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='8' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#instanceApply_through_tbody").empty().append(loadStr);
    runInstanceApplyThroughDataTables(function(){
        InstanceApplyThroughTable = $("#instanceApply_through_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 7, "desc" ]],
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
    },data);
}

function runInstanceApplyThroughDataTables(callback,data) {

        var str = "",createTime = "--",updateTime="--",configure="--";
        for (var i = 0; i < data.length; i++) {
            createTime = "--";
            if(data[i].createTime){
                createTime = new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss");
            }
            if(data[i].updateTime){
                updateTime = new Date(data[i].updateTime).Format("yyyy-MM-dd hh:mm:ss");
            }
            if(convertStr(data[i].productPackageInfo)!="" &&convertStr(data[i].productPackageInfo.productPackageDetailPoList)!=""){
                var cpu=0,mem=0,disk=0,bandwidth=0;
                for(var j=0;j<data[i].productPackageInfo.productPackageDetailPoList.length;j++){
                    if(data[i].productPackageInfo.productPackageDetailPoList[j].productCat.innerName=="cpu"){
                        cpu=data[i].productPackageInfo.productPackageDetailPoList[j].billUnitCount;
                    }
                    if(data[i].productPackageInfo.productPackageDetailPoList[j].productCat.innerName=="mem"){
                        mem=data[i].productPackageInfo.productPackageDetailPoList[j].billUnitCount;
                    }
                    if(data[i].productPackageInfo.productPackageDetailPoList[j].productCat.innerName=="disk"){
                        disk=data[i].productPackageInfo.productPackageDetailPoList[j].billUnitCount;
                    }
                    if(data[i].productPackageInfo.productPackageDetailPoList[j].productCat.innerName=="bandwidth"){
                        bandwidth=data[i].productPackageInfo.productPackageDetailPoList[j].billUnitCount;
                    }
                }
                configure="配置："+cpu+"核CPU "+mem+"G内存";
                if(disk>0){
                    configure+="</br>磁盘："+disk+"GB"
                }
                if(bandwidth>0){
                    configure+="</br>带宽："+bandwidth+"Mbps"
                }
                if(convertStr(data[i].systemImagePo)!=""){
                    configure+="</br>镜像："+data[i].systemImagePo.name;
                }
            }
            str +=
                "<tr>" +
                "<td class='text-center' style='display: none;'><label class='checkbox'><input type='checkbox' name='cbx_instanceApply_through_list' " +
                "onclick=\"setInstanceApplyThroughSel(this,'" + data[i].id + "','" + data[i].name + "')\"><i></i></label></td>" +
                "<td class='text-center'>" + data[i].name + "</td>" +
                "<td class='text-center'>" + data[i].userAccountPo.mobilePhone +"</br>"+ data[i].userAccountPo.email+ "</td>" +
                "<td class='text-center'>" + data[i].companyName + "</td>" +
                "<td class='text-align-left' style='padding-left: 5px;'>" + configure+ "</td>" +
                "<td class='text-center'>" + rpL(data[i].useType)+ "</td>" +
                "<td class='text-center'>" + data[i].applyExplain+ "</td>" +
                "<td class='text-center'>" + createTime+ "</td>" +
                "<td class='text-center'>" + updateTime+ "</td>" +
                "</tr>";
        }
        $("#instanceApply_through_tbody").empty().append(str);
        //获取待开通个数
        $("#instanceApply_through_count").html(data.length);
        $("#instanceApply_through_thead").show();
        callback();
}


/**
 * 未通过记录
 */

var InstanceApplyNotThroughTable;
function setInstanceApplyNotThroughSel(obj,id,name){
    var obj_checked = obj.checked;
    $("#instanceApply_notThrough_table input[name='cbx_instanceApply_notThrough_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;
}

function loadInstanceApplyNotThroughData(data) {
    $("#instanceApply_notThrough_list_table").empty().append("<table id='instanceApply_notThrough_table' class='table  table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='instanceApply_notThrough_thead' class='talign_c'></thead><tbody id='instanceApply_notThrough_tbody'></tbody></table>");
    $("#instanceApply_notThrough_thead").empty().append(
            "<tr>" +
            "<th class='talign_c' style='display: none;'></th>"+
            "<th class='talign_c'>"+"姓名"+"</th>"+
            "<th class='talign_c'>"+"手机/邮箱"+"</th>"+
            "<th class='talign_c'>"+"公司名称"+"</th>"+
            "<th class='talign_c'>"+"服务器配置"+"</th>"+
            "<th class='talign_c'>"+"服务器用途"+"</th>"+
            "<th class='talign_c'>"+"申请说明"+"</th>"+
            "<th class='talign_c'>"+"申请时间"+"</th>"+
            "<th class='talign_c'>"+"拒绝时间"+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='8' style='border-width:0px;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#instanceApply_notThrough_tbody").empty().append(loadStr);
    runInstanceApplyNotThroughDataTables(function(){
        InstanceApplyNotThroughTable = $("#instanceApply_notThrough_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 7, "desc" ]],
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
    },data);
}

function runInstanceApplyNotThroughDataTables(callback,data) {

    var str = "",createTime = "--",updateTime = "--",configure="--";
    for (var i = 0; i < data.length; i++) {
        createTime = "--";
        if(data[i].createTime){
            createTime = new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss");
        }
        if(data[i].updateTime){
            updateTime = new Date(data[i].updateTime).Format("yyyy-MM-dd hh:mm:ss");
        }
        if(convertStr(data[i].productPackageInfo)!="" &&convertStr(data[i].productPackageInfo.productPackageDetailPoList)!=""){
            var cpu=0,mem=0,disk=0,bandwidth=0;
            for(var j=0;j<data[i].productPackageInfo.productPackageDetailPoList.length;j++){
                if(data[i].productPackageInfo.productPackageDetailPoList[j].productCat.innerName=="cpu"){
                    cpu=data[i].productPackageInfo.productPackageDetailPoList[j].billUnitCount;
                }
                if(data[i].productPackageInfo.productPackageDetailPoList[j].productCat.innerName=="mem"){
                    mem=data[i].productPackageInfo.productPackageDetailPoList[j].billUnitCount;
                }
                if(data[i].productPackageInfo.productPackageDetailPoList[j].productCat.innerName=="disk"){
                    disk=data[i].productPackageInfo.productPackageDetailPoList[j].billUnitCount;
                }
                if(data[i].productPackageInfo.productPackageDetailPoList[j].productCat.innerName=="bandwidth"){
                    bandwidth=data[i].productPackageInfo.productPackageDetailPoList[j].billUnitCount;
                }
            }
            configure="配置："+cpu+"核CPU "+mem+"G内存";
            if(disk>0){
                configure+="</br>磁盘："+disk+"GB"
            }
            if(bandwidth>0){
                configure+="</br>带宽："+bandwidth+"Mbps"
            }
            if(convertStr(data[i].systemImagePo)!=""){
                configure+="</br>镜像："+data[i].systemImagePo.name;
            }
        }
        str +=
            "<tr>" +
            "<td class='text-center' style='display: none;'><label class='checkbox'><input type='checkbox' name='cbx_instanceApply_through_list' " +
            "onclick=\"setInstanceApplyThroughSel(this,'" + data[i].id + "','" + data[i].name + "')\"><i></i></label></td>" +
            "<td class='text-center'>" + data[i].name + "</td>" +
            "<td class='text-center'>" + data[i].userAccountPo.mobilePhone +"</br>"+ data[i].userAccountPo.email+ "</td>" +
            "<td class='text-center'>" + data[i].companyName + "</td>" +
            "<td class='text-align-left' style='padding-left: 5px;'>" + configure+ "</td>" +
            "<td class='text-center'>" + rpL(data[i].useType)+ "</td>" +
            "<td class='text-center'>" + data[i].applyExplain+ "</td>" +
            "<td class='text-center'>" + createTime+ "</td>" +
            "<td class='text-center'>" + updateTime+ "</td>" +
            "</tr>";
    }
    $("#instanceApply_notThrough_tbody").empty().append(str);
    //获取待开通个数
    $("#instanceApply_notThrough_count").html(data.length);

    $("#instanceApply_notThrough_thead").show();
    callback();
}
