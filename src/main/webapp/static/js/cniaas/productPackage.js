/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:产品类别
 */
var productPackageTable;


//loadproductPackageTable();
function loadproductPackageTable(id){
  //  loadURL("../../static/cniaas/productPackage.html",$("#content_test"));

    $("#productPackage_list_table").empty().append("<table id='productPackage-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='productPackage-thead' class=''></thead><tbody id='productPackage-tbody' class='table-tbody'></tbody></table>");

    $("#productPackage-thead").empty().append(
            "<tr><th width='5%'></th>"+
            "<th class='table-thead' width='5%'>"+rpL("number")+"</th>"+
            "<th class='table-thead' width='15%'>"+rpL("name")+"</th>"+
            "<th class='table-thead' width='11%'>"+rpL("bill_cycle")+"</th>"+
            "<th class='table-thead' width='12%'>"+rpL("totalPrice")+"</th>"+
            "<th class='table-thead' width='10%'>"+rpL("status")+"</th>"+
            "<th class='table-thead' width='10%'>"+rpL("region")+"</th>"+
            "<th class='table-thead' width='20%'>"+rpL("description")+"</th>"+
            "<th class='table-thead' width='25%'>"+rpL("createTime")+"</th>"+
          /*  "<th class='table-thead'>"+rpL("updateTime")+"</th>"+*/
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='9' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#productPackage-tbody").empty().append(loadStr);
    runproductPackageDataTables(function(){
        productPackageTable=$("#productPackage-table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
//            "bFilter": true,
            'bSort':true,
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
    },id);
}

function runproductPackageDataTables(callback,id){
    sel_productPackage_sort=null;
     sel_productPackage_id=null;
     all_productPackage_data=null;
    $("#btn_productPackage_edit,#btn_productPackage_delete,#btn_productPackage_editSort").addClass("disabled");
    var regionId="";
    if(convertStr(id)==""){
        regionId=$("#regionList_productPackage a.btn-primary").attr("id");
        regionId=regionId.split(",");
        regionId=regionId[1];
    }else{
        regionId=id.split(",");
        regionId=regionId[1];
    }

    var data={regionId:regionId};
    doPost("/action/productPackage/list",data,function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = '';
            var status="";
            for( var i=0;i<data.length;i++){
                var description="";
                var snap=0;
                var snapbillUnitName="";
                for(var j=0;j<data[i].productPackageDetailPoList.length;j++){
                    if(convertStr(data[i].productPackageDetailPoList[j].productCat.name)!="" && data[i].productPackageDetailPoList[j].productCat.innerName=="cpu") {
                        description += "<span style='padding-left: 5px;'>CPU: " + data[i].productPackageDetailPoList[j].billUnitCount + data[i].productPackageDetailPoList[j].productCat.billUnitName+"</span>";
                    }
                    if(convertStr(data[i].productPackageDetailPoList[j].productCat.name)!="" && data[i].productPackageDetailPoList[j].productCat.innerName=="mem"){
                        description+="<span style='padding-left: 5px;'>内存: "+data[i].productPackageDetailPoList[j].billUnitCount + data[i].productPackageDetailPoList[j].productCat.billUnitName+" </span>";
                    }
                    if(convertStr(data[i].productPackageDetailPoList[j].productCat.name)!="" && data[i].productPackageDetailPoList[j].productCat.innerName=="disk"){
                        description+="<span style='padding-left: 5px;'>磁盘: "+data[i].productPackageDetailPoList[j].billUnitCount+ data[i].productPackageDetailPoList[j].productCat.billUnitName+" </span>";
                    }
                    if(convertStr(data[i].productPackageDetailPoList[j].productCat.name)!="" && data[i].productPackageDetailPoList[j].productCat.innerName=="bandwidth"){
                        description+="<span style='padding-left: 5px;'>带宽: "+data[i].productPackageDetailPoList[j].billUnitCount + data[i].productPackageDetailPoList[j].productCat.billUnitName+" </span>";
                    }
                    if(convertStr(data[i].productPackageDetailPoList[j].productCat.name)!="" && data[i].productPackageDetailPoList[j].productCat.innerName=="snapshot"){
                       // description+="快照: "+data[i].productPackageDetailPoList[j].billUnitCount +" 个</br>";
                        snap++;
                        snapbillUnitName=snap+ data[i].productPackageDetailPoList[j].productCat.billUnitName;
                    }
                 /*   if(convertStr(data[i].productPackageDetailPoList[j].productCat.name)!="" && data[i].productPackageDetailPoList[j].productCat.innerName=="image"){
                        description+="镜像: "+data[i].productPackageDetailPoList[j].billUnitCount;
                    }*/
                }
                if(snap>0){
                    description+="<span style='padding-left: 5px;'>快照: "+snapbillUnitName+"</span>";
                }
                var billCycle;
                if(Number(data[i].billCycle)%12==0){
                     billCycle= Math.floor(data[i].billCycle/12)+"年";
                }else{
                     billCycle= data[i].billCycle>12?Math.floor(data[i].billCycle/12)+"年"+data[i].billCycle%12+"月":data[i].billCycle+"月";
                }

                if(data[i].status=="Enable"){
                    status='<span class="success-type">'+rpL(data[i].status)+'<span>';
                }else{
                    status='<span class="disable-type">'+rpL(data[i].status)+'<span>'
                }

                var name='<span id="productPackage_name_'+data[i].id+'">' +
                    '<span style="margin-left: 5px;">'+data[i].packageName+'</span>';
                var visibleStr = "";
                if(i == 0){
                    visibleStr = ' style="visibility: hidden;" '
                }
                if(data[i].status=="Enable"){
                    name+='<a title="向上移动"'+ visibleStr  +' class="text-right" onclick="editPackageSort('+data[i].id+','+data[i].sort+')"><i style="" class="glyphicon glyphicon-arrow-up"></i></a>';
                }
                name+= '</span>';
                str += "<tr id='tr_productPackage_" + data[i].id + "'>"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='productPackage_" + data[i].id + "' type='checkbox' name='cbx_productPackage_list' onclick=\"set_productPackage_Sel(this,'"+data[i].id+"','"+data[i].sort+"','"+data[i].status+"')\">"+
                    "<i></i></label></td>"+
                    "<td>"+(i+1)+"</td>"+
                    "<td>"+name+"</td>"+
                    "<td>"+billCycle +"</td>"+
                    "<td class='pay-balance'>"+data[i].totalPrice +"</td>"+
                    "<td>"+status+"</td>"+
                    "<td>"+data[i].systemRegionPo.name+"</td>"+
//                    "<td>"+status+"</td>"+
                    "<td style='text-align: left;'>"+ description+"</td>"+
                    "<td>"+new Date(data[i].createTime).Format("yyyy-MM-dd hh:mm:ss")  +"</td>"+
        /*            "<td>"+ convertStr(data[i].updateTime) +"</td>"+*/
                    "</tr>";
            }
            $("#productPackage-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='9' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#productPackage-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_productPackage_id="";
var all_productPackage_data="";
var sel_productPackage_sort="";
function set_productPackage_Sel(obj,id,sort,status){
    var obj_checked = obj.checked;
    $("#productPackage_list_table input[name='cbx_productPackage_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_productPackage_data = null;
      //  all_productPackage_data = productPackageTable.fnGetData(obj.parent);
        if(null != id){
            sel_productPackage_id=id;
            sel_productPackage_sort=sort;
        }
        if(status=="Disable"){
            $("#btn_productPackage_enabled,#btn_productPackage_delete").removeClass("disabled");
            $("#btn_productPackage_disabled").addClass("disabled");
        }else{
            $("#btn_productPackage_enabled,#btn_productPackage_delete").addClass("disabled");
            $("#btn_productPackage_disabled").removeClass("disabled");
        }
       $("#btn_productPackage_edit,#btn_productPackage_editSort").removeClass("disabled");

    }else{
        sel_productPackage_id=null;
        sel_productPackage_sort=null;
        all_productPackage_data = null;
        $("#btn_productPackage_edit,#btn_productPackage_delete,#btn_productPackage_editSort,#btn_productPackage_enabled,#btn_productPackage_disabled").addClass("disabled");
    }
   // console.log("id="+id);
}


function showproductPackageDetail(id){
    doPost("/action/productPackage/detail",{productPackageId:id},function(objs){

    });
}

function addPackageValidate(){
    $("#productPackage-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            productPackage_name:{
                required:true
            },
            price:{
                required:true,
                number:true
            }
        },
        messages:{
            productPackage_name:{
                required:"名称不能为空"
            },
            price:{
                required:"价格不能为空",
                number:"价格只能是数字"
            }
        },
/*        highlight: function(element){
            $(element).removeClass('package-hsa-success').addClass('package-hsa-error');
            packageValidateBtn("productPackageBtn",2);
        },

        unhighlight: function(element){
            $(element).removeClass('package-hsa-error').addClass('package-hsa-success');
            $(element).parent().find("em").remove();
            packageValidateBtn("productPackageBtn",2);
        },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function editPackageValidate(){
    $("#productP-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            productPackage_name:{
                required:true
            },
            price:{
                required:true,
                number:true
            }
        },
        messages:{
            productPackage_name:{
                required:"名称不能为空"
            },
            price:{
                required:"价格不能为空",
                number:"价格只能是数字"
            }
        },
/*        highlight: function(element){
            $(element).removeClass('package-hsa-success').addClass('package-hsa-error');
            packageValidateBtn("productP_edit_btn",2);
        },

        unhighlight: function(element){
            $(element).removeClass('package-hsa-error').addClass('package-hsa-success');
            $(element).parent().find("em").remove();
            packageValidateBtn("productP_edit_btn",2);
        },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }

    });
    packageValidateBtn();
}
function packageValidateBtn(id,number){
    var validateSize = number;
    var size=0;
    $("#productP-form input").each(function () {
        if($(this).hasClass("package-hsa-success")){
            size+=1;
        }
    });
    if(validateSize==size){
        $("#"+id).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
    }else{
        $("#"+id).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
    }
}
function editPackageSort(id,sort){
    if(sort<=1){
        showMsg("温馨提示","该套餐排序顺序已最高");
    }else{
        doPost("/action/productPackage/editSort",{productPackageId:id},function(objs){
            if(objs.httpCode=="200"){
                showMsg("温馨提示","编辑排序成功");
                loadproductPackageTable();
            }else{
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
            }
        });
    }
}