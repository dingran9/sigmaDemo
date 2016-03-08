var skinTable;


function loadSkinTable(){
    all_skin_data=null;

    $("#skin_list_table").empty().append("<table id='skin-table' class='table table-responsive table-striped table-bordered table-hover table-text-center'><thead id='skin-thead' class=''></thead><tbody id='skin-tbody' class='table-tbody'></tbody></table>");
    $("#skin-thead").empty().append(
            "<tr><th width='5%'></th>"+
            "<th class='table-thead'>"+rpL("name")+"</th>"+
            "<th class='table-thead'>"+rpL("LOGO")+"</th>"+
            "<th class='table-thead' style='width: 40%;'>"+rpL("style_colorList")+"</th>"+
            "<th class='table-thead'>"+rpL("isDefault")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='5' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#skin-tbody").empty().append(loadStr);
    runSkinDataTables(function(){
        skinTable=$("#skin-table").dataTable({
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

function runSkinDataTables(callback){

    doPost("/action/systemStyle/list",{resourceType:0},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = "";
            var skinData = {};
            var skinDataStr = "";
            var operationStr = "";
            for( var i=0;i<data.length;i++){
                themeArray[objs.datas[i].name] = JSON.parse(objs.datas[i].content);
                themeArray[objs.datas[i].name].isDefault = false;
                if(objs.datas[i].isDefault){
                    themeArray[objs.datas[i].name].isDefault = true;
                }else{

                }

                skinData = JSON.parse(data[i].content);

                skinDataStr = "";
                operationStr = "";
                for(var j in skinData){
                    if(j.indexOf("li") < 0){
                        skinDataStr += "<label  title='" + j + "' style='width: 30px;height: 30px;margin:0 5px -2px;background: "+ skinData[j] + "'>" +'' + "</label>";
                    }
                }
                if(data[i].isDefault){
                    operationStr = '<label skinid="'+data[i].id+'" style="color:#000;font-weight:bold;">当前默认样式</label>';
                }else{
                    operationStr = '<a skinid="'+data[i].id+'" onclick="setIsDefault(this,true);">设为默认</a>';
                }
                var imageType= 'data:image/'+data[i].logoFileName.split(".")[1] +'data:image/png;base64,';
                str += "<tr id='tr_skin_" + data[i].id + "' ondblclick=\"showDetail('"+data[i].id+"')\">"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='skin_" + data[i].id + "' type='checkbox' name='cbx_skin_list' onclick=\"set_skin_Sel(this,'"+data[i].id+"')\">"+
                    "<i></i></label></td>"+
                    "<td title='"+data[i].description+"'><a href='#../../action/cniaas/merchant/skin.html?skinname="+ data[i].name +"' >"+ data[i].name+"</a></td>"+
                    "<td><img style='width:110px;height: 49px;' src='"+imageType+data[i].logo+"'></td>"+
                    "<td>"+ skinDataStr +"</td>"+
                    "<td>"+ operationStr +"</td>"+
                    "</tr>";
            }
            $("#skin-tbody").empty().append(str);

            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='4' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>";
            $("#skin-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_skin_id="";
var all_skin_data="";
function set_skin_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#skin_list_table input[name='cbx_skin_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_skin_data = null;
        if(null != id)
            sel_skin_id=id;

        $("#btn_skin_setDefault,#btn_skin_delete").removeClass("disabled");

    }else{
        all_skin_data = null;
        $("#btn_skin_setDefault,#btn_skin_delete").addClass("disabled");
    }
}

function deleteskin(){
    doPost("/action/systemStyle/delete",{id:sel_skin_id},function(obj){
        if(obj.httpCode == "200"){
            loadSkinTable();
        }else if(obj.httpCode == "400" && obj.code == "Resource.InUse"){
            showErrorMsg("删除失败","设为默认的皮肤不可被删除");
        }else{
            showErrorMsg(obj.code,"程序内部错误");
        }
    },true);
}


function setIsDefault(_this,isDefault){
    var objTr = $(_this).closest("tr");
    console.log(objTr);
    var id = $(_this).attr("skinid");
    doPost("/action/systemStyle/setWhetherDefault",{id:id,isDefault:isDefault},function(obj){
        if(obj.httpCode == "200"){
            loadSkinTable();
        }else{

        }
    });
}