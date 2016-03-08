/**
 * Created by songxiaoguang on 2014/11/10.
 */


/**
 * 地域列表
 */
function listRegionsFromInstanceApply(){
    doPost("/action/region/findRegionList",{},function(objs){
        if(objs.httpCode == "200") {
            var data = objs.data;
            var str = "";
            if(data==null||data.length<=0){
                showErrorMsg("","获取地域列表失败！");
                return;
            }
            for(var i=0;i<data.length;i++){
                str +=" <a onclick=\"loadInstanceApply('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
            }
            $("#regionList_instanceApply").empty().append(str).show();
            $("#toolbar_instanceApply").show();
            $("#widget-grid-instanceApply").show();
//            $("#toolbar_instanceApply_type").show();
//            $("#widget-grid-instanceApply-type").show();
            loadInstanceApply(data[0].regionUuid);//加载第一个
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });
}

//切换地域
function loadInstanceApply(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    //  beforeTableLoad("instanceApply_tab_ul","instanceApply_tab");
    instanceApplyloadAllData(id);
}

var sel_instanceApply_row_id = "",
    all_instanceApply_data;
function setinstanceApplySel(obj,instanceApplyname,ip,instanceApplyType){
    var obj_checked = obj.checked;
    $("#instanceApply_table input[name='cbx_instanceApply_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;
}

//刷新
function refreshInstanceApplys(){
    var regionId  = $("#regionList_instanceApply .btn-primary").attr('id');
    instanceApplyloadAllData(regionId);
}

var instanceApplyTable;


function instanceApplyloadAllData(regionId){
    doPost("/action/resourceInstanceApply/list",{"regionId":regionId}, function (objs) {
        if (objs.httpCode == "200"&&objs.code=="Success") {
            instanceApplyloadData(objs.data["pendingList"]);
            loadInstanceApplyThroughData(objs.data["throughList"]);
            loadInstanceApplyNotThroughData(objs.data["notThroughList"]);
        } else {
            var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span>没有检索到数据</span></td></tr>";
            $("#instanceApply_tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg(rpL(objs.code),rpLRespond(objs.message));
        }
    });
}
/**
 * 加载数据
 */
function instanceApplyloadData(data) {
    $("#btn_instanceApply_update").addClass('disabled');
    all_instanceApply_data = null;
    sel_instanceApply_row_id = "";
    $("#instanceApply_list_table").empty().append("<table id='instanceApply_table' class='table table-responsive talign_c table-striped table-bordered table-hover smart-form has-tickbox'><thead id='instanceApply_thead'></thead><tbody id='instanceApply_tbody'></tbody></table>");
    $("#instanceApply_thead").empty().append(
            "<tr class='talign_c'><th  style='display: none;'></th>"+
            "<th class='talign_c'>"+"姓名"+"</th>"+
            "<th class='talign_c'>"+"手机/邮箱"+"</th>"+
            "<th class='talign_c'>"+"公司名称"+"</th>"+
            "<th class='talign_c'>"+"服务器配置"+"</th>"+
            "<th class='talign_c'>"+"服务器用途"+"</th>"+
            "<th class='talign_c'>"+"申请说明"+"</th>"+
            "<th class='talign_c'>"+"申请时间"+"</th>"+
            "<th class='talign_c'>"+"操作"+"</th>"+

            "</tr>");
    var  loadStr="<tr class='odd'><td class='dataTables_empty' valign='top' colspan='7' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#instanceApply_tbody").empty().append(loadStr);
    runinstanceApplyDataTables(function(){
        instanceApplyTable = $("#instanceApply_table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 7, "desc" ]],
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
    },data);
}
function runinstanceApplyDataTables(callback,data) {
        var str = "",operation="",configure="--";
        for (var i = 0; i < data.length; i++) {
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
            operation="<a onclick=\"throughInstanceApply('" + data[i].id + "')\"> 通过</a></br>"+
            "<a onclick=\"notThroughInstanceApply('" + data[i].id + "')\"> 拒绝</a>";
            str +="<tr>" +
                "<td style='display: none;' class='text-center'><label class='checkbox'><input type='checkbox' name='cbx_instanceApply_list' onclick=\"setinstanceApplySel(this,'" + data[i].id + "')\"><i></i></label></td>" +
                "<td class='text-center'>" + data[i].name + "</td>" +
                "<td class='text-center'>" + data[i].userAccountPo.mobilePhone +"</br>"+ data[i].userAccountPo.email+ "</td>" +
                "<td class='text-center'>" + data[i].companyName + "</td>" +
                "<td class='text-align-left' style='padding-left: 5px;'>" + configure+ "</td>" +
                "<td class='text-center'>" + rpL(data[i].useType)+ "</td>" +
                "<td class='text-center'>" + data[i].applyExplain+ "</td>" +
                "<td class='text-center'>" + new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss")+ "</td>" +
                "<td class='text-center'>" +operation + "</td>" +
                "</tr>";
        }
        $("#instanceApply_tbody").empty().append(str);
        $("#instanceApply_thead").show();
        callback();
}

function throughInstanceApply(id){
    showConfirm("fa-play", "通过测试云主机申请", "是否要通过测试云主机申请?", function () {
        doPost("/action/resourceInstanceApply/through", {"instanceApplyId":id}, function (objs){
            if (objs.httpCode == "200") {
                showMsg("操作成功", "测试云主机申请通过请求成功。");
                refreshInstanceApplys();
            } else {
                showErrorMsg("", "测试云主机申请通过请求失败。");
            }
        });
    });
}
function notThroughInstanceApply(id){
    clearForm("apply_notThrough_oper");
    $("#apply_notThrough_oper_modal").modal("show");
    sel_instanceApply_row_id=id;
}
function confirmNotThroughInstanceApply(){
    var refuseExplain=$("#apply_notThrough_refuseExplain").val();
    doPost("/action/resourceInstanceApply/notThrough", {"instanceApplyId":sel_instanceApply_row_id,"refuseExplain":refuseExplain}, function (objs){
        if (objs.httpCode == "200") {
            showMsg("操作成功", "拒绝测试云主机申请请求成功。");
            $("#apply_notThrough_oper_modal").modal("hide");
            refreshInstanceApplys();
        } else {
            showErrorMsg("", "拒绝测试云主机申请通过失败。");
        }
    });
}