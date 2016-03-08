/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:角色
 */
var roleTable;


function loadroleTable(){
    //  loadURL("../../static/cniaas/role.html",$("#content_test"));

    $("#role_list_table").empty().append("<table id='role-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='role-thead' class=''></thead><tbody id='role-tbody' class='table-tbody'></tbody></table>");
    $("#role-thead").empty().append(
            "<tr><th width='5%'></th>"+
            "<th class='table-thead' width='15%'>"+rpL("name")+"</th>"+
            "<th class='table-thead' width='20%'>"+rpL("is_DA")+"</th>"+
            "<th class='table-thead' width='40%'>"+rpL("description")+"</th>"+
            "<th class='table-thead' width='20%'>"+rpL("createTime")+"</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='6' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#role-tbody").empty().append(loadStr);
    runroleDataTables(function(){
        roleTable=$("#role-table").dataTable({
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 4, "desc" ]],
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

function runroleDataTables(callback){
    $("#btn_role_edit,#btn_role_delete").addClass("disabled");

    doPost("/action/idcRole/list",{},function(objs){
        if(objs.httpCode=="200"){
            var data=objs.datas;
            var str = '';
            var input= "";
            var is_DA="否";
            for( var i=0;i<data.length;i++){
                if(data[i].isStaff=="IS_STAFF"){
                     input= "disabled='disabled'";
                }else{
                    input="";
                }
                is_DA=data[i].isDA=="IS_DA"?"是":"否";
                var time= convertStr(data[i].createDate)==""?"-": new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss");
                str += "<tr id='tr_role_" + data[i].id + "'>"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input "+input+" id='role_ch_box" + data[i].id + "' type='checkbox' name='cbx_role_list' onclick=\"set_role_Sel(this,'"+data[i].id+"')\">"+
                    "<i></i></label></td>"+
                    "<td><a onclick='showRoleDetail("+ data[i].id +")'>"+data[i].name+"</a></td>"+
                    "<td>"+  is_DA +"</td>"+
                    "<td>"+ data[i].description +"</td>"+
                    "<td>"+time +"</td>"+
                    "</tr>";
            }
            $("#role-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#role-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_role_id="";
var all_role_data="";
function set_role_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#role_list_table input[name='cbx_role_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        all_role_data = null;
        // all_role_data = roleTable.fnGetData(obj.parent);
        if(null != id)
            sel_role_id=id;

        $("#btn_role_edit,#btn_role_delete").removeClass("disabled");

    }else{
        all_role_data = null;
        $("#btn_role_edit,#btn_role_delete").addClass("disabled");
    }
}

function showRoleDetail(id){
    $("#main").css("overflow-y","scroll");
    //获取详情
    doPost("/action/idcRole/detail",{roleId:id},function(objs){
        if(objs.httpCode=="200"){
            draw_all_access_list1('role_detail_access',objs.datas);
            checked_item('role_detail_access',objs.datas);
            set_readonly("role_detail_access");
            //disableRightKey();
            var ctime= convertStr(objs.data.createDate)==""?"-": new Date(objs.data.createDate).Format("yyyy-MM-dd hh:mm:ss");
            var utime= convertStr(objs.data.updateDate)==""?"-": new Date(objs.data.updateDate).Format("yyyy-MM-dd hh:mm:ss");
            $("#role_detail_name").html(objs.data.name);
            $("#role_detail_des").html(objs.data.description);
            var isDA=objs.data.isDA=="IS_DA"?"是":"否";
            $("#role_detail_isDA").html(isDA);
            $("#role_detail_createTime").html(ctime);
            $("#role_detail_updateTime").html(utime);
            $("#role_detail_modal").show().siblings().hide();
        }else{
            console.log("code :" + objs.code + "  msg:" + objs.message);
            showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
        }

    });
}

//详情页设置权限状态不可编辑
function set_readonly(id){
    $("#"+id+" label input[type='checkbox']").each(function(){
        $(this).bind('click',function(){return false;});
        $(this).removeAttr('onchange');
    });
}

//获取子节点
function get_son_node_list(id, items){
    var son_node_list = [];
    for(k=0;k<items.length;k++){
        if(items[k].fid == id){
            son_node_list.push(items[k]);
        }
    }
    return son_node_list;
}
//获取祖父ID
function get_grand_id(fid, items){
    for(k=0;k<items.length;k++){
        if(items[k].id == fid){
            return items[k].fid;
        }
    }
}

//获取父节点名称
function get_parent_node(fid,items){
    for(var k=0;k<items.length;k++){
        if(items[k].id == fid){
            return items[k];
        }
    }
}
//获取祖父节点名称
function get_grand_name(fid,items){
    for(k=0;k<items.length;k++){
        if(items[k].id == fid){
            for(l=0;l<items.length;l++){
                if(items[l].id == items[k].fid){
                    return items[l].name;
                }
            }
        }
    }
}

function draw_all_access_list1(modal_type, permission_List){
    var items = [];
    var items = permission_List;
    items.sort(function(a,b){if(a.sequence == undefined ){a.sequence = 99;} else if(b.sequence == undefined){ b.sequence = 99;}else{} return a.sequence - b.sequence;});
    $("#" + modal_type).empty();
    for(i=0;i<items.length;i++) {
        if(items[i].fid != 0){

            var grand_id = get_grand_id(items[i].fid, items);
            var parent_node = get_parent_node(items[i].fid, items);

            if (grand_id == 0 && items[i].type == 'Operation') {
                if (!($("#"+modal_type+" li#model_" + items[i].fid).length > 0)) {
                    draw_first_level_node(modal_type,parent_node,true);
                }
                draw_second_level_node(modal_type,items[i]);

            } else if (grand_id == 0 && items[i].type == 'Model') {
                if (!($("#"+modal_type+" li#model_" + items[i].fid + '_' + items[i].id).length > 0 )) {
                    if(modal_type != 'role_detail_access'){
                        $("#"+modal_type).append('<li class="dd-item no-padding" id=model_' + items[i].fid + '_' + items[i].id + ' data-id="li_' + items[i].fid + '">'+
                            '<div class="dd-handle col-md-12" id="div_' + items[i].fid + '">'+
                            '<h6 class="col-md-3 no-padding" style="margin: 0;">'+
                            '<label id="' + items[i].fid + '">'+
                            '<input id="input_' + items[i].fid + '_' +items[i].id + '"class="checkbox style-0" type="checkbox"  onchange="select_all(\''+modal_type+'\','+'\'input_' + items[i].id + '\');">'+
                            '<span class="semi-bold ">' + rpL(items[i].name) + '</span></label></h6>'+
                            '<div id="child_' + items[i].fid + items[i].id + '" class="col-md-9" style="border-left: 2px solid #CCCCCC; ">'+
                            '</div>');
                    } else{
                        $('#role_detail_access').append('<li class="dd-item no-padding" id=model_' + items[i].fid + '_' + items[i].id + ' data-id="li_' + items[i].fid + '">'+
                            '<div class="dd-handle col-md-12" id="div_' + items[i].fid + '">'+
                            '<h6 class="col-md-3 no-padding " style="margin: 0;"><label id="' + items[i].fid + '">'+
                            '<input id="input_' + items[i].fid + items[i].id + '"class="checkbox style-0" type="checkbox"  checked="checked" onchange="select_all(\''+modal_type+'\','+'\'input_' + items[i].fid + '\');">'+
                            '<span class="semi-bold ">' + rpL(items[i].name) + '</span></label></h6>'+
                            '<div id="child_' + items[i].fid + items[i].id + '" class="col-md-9" style="border-left: 2px solid #CCCCCC; ">'+
                            '</div>');
                    }
                }
            } else if (grand_id != 0 && items[i].type == 'Operation') {
                if (!($("#"+modal_type+" li#model_" + grand_id + '_'+ items[i].fid).length > 0 )) {
                    var grand_name = get_grand_name(items[i].fid, items);
                    $("#" + modal_type).append('<li class="dd-item no-padding" id=model_' + grand_id + '_'+ items[i].fid + ' data-id="li_' + grand_id + '">'+
                        '<div class="dd-handle col-md-12" id="div_' + grand_id + '"><h6 class="col-md-3 no-padding " style="margin: 0;">'+
                        '<label id="' + grand_id + '"><input id="input_' + grand_id + '_' + items[i].fid + '"class="checkbox style-0" type="checkbox"  onchange="select_all(\''+modal_type+'\','+'\'input_' + items[i].fid  + '\');">'+
                        '<span class="semi-bold ">' + rpL(parent_node.name) + '</span></label></h6>'+
                        '<div id="child_' + grand_id + items[i].fid + '" class="col-md-9" style="border-left: 2px solid #CCCCCC; ">'+
                        '</div>');
                }
                $("#"+modal_type+" div#child_" + grand_id + items[i].fid).append('<div class="no-padding pull-left"  style="width: 33%;position:relative; " ><label><input id="input_' + items[i].fid + '_' + items[i].id + '"  class="checkbox style-0 child_box"  onchange="isAllFalse(\''+modal_type+'\',this);" type="checkbox" ><span class="font-xs">' + rpL(items[i].name) + '</span></label></div>');
                if(items[i].checked == true){$("#"+modal_type+" input#input_" + items[i].fid + '_' + items[i].id).prop('checked',true);}
                if(modal_type == "role_detail_access"){
                    $("#"+modal_type+" input#input_" + items[i].fid + '_' + items[i].fid+"_").prop('checked',true);
                    $("#"+modal_type+" input#input_" + grand_id + '_' + items[i].fid).prop('checked',true);
                }
            }
            else {continue;}
        } else {
            if(!($("#"+modal_type+" li#model_" + items[i].id).length > 0)){
                var son_node_list = get_son_node_list(items[i].id,items);
                var isAppended = false;
                if (son_node_list.length == 0){
                    isAppended = true;
                }
                for(j=0;j<son_node_list.length;j++){
                    if(son_node_list[j].type == 'Operation'){
                        isAppended = true;
                    }
                }

                draw_first_level_node(modal_type,items[i],isAppended);
            }
        }
        if(items[i].action == "rollback_snapshot"){$("#"+modal_type+" input#input_" + items[i].fid + '_' + items[i].id).addClass("snap_rollback");}
        if(items[i].action == "allocate_public_ip"){$("#"+modal_type+" input#input_" + items[i].fid + '_' + items[i].id).addClass("allocate_public_ip");}
        if(items[i].action == "release_public_ip"){$("#"+modal_type+" input#input_" + items[i].fid + '_' + items[i].id).addClass("release_public_ip");}
    }
}
//生成fid==0的节点
function  draw_first_level_node(modal_type,item,isAppended){
    //添加新节点
    if (isAppended) {
        $("#" + modal_type).append(
                '<li class="dd-item no-padding" id="model_' + item.id + '" data-id="li_' + item.id + '">' +
                '<div class="dd-handle col-md-12" id="div_' + item.id + '">'+
                '<h6 class="col-md-3 no-padding " style="margin: 0;">'+
                '<label id="' + item.id + '">'+
                '<input' +
                ' id="input_' + item.id + '_' + item.id  + '"class="checkbox style-0" type="checkbox"   onchange="select_all(\''+modal_type+'\','+'\'input_' + item.id + '\');">'+
                '<span class="semi-bold ">' + rpL(item.name) + '</span>'+
                '</label>'+
                '</h6>'+
                '<div id="child_' + item.id + '" class="col-md-9" style="border-left: 2px solid #CCCCCC; "></div>'+
                '</li>');
    }

    //如果type==Operation，那么隐藏该节点（cloud_list, serverSwitching,...）
    if(item.type == 'Operation'){$("#"+modal_type+" li#model_" + item.id).css('display','none');
        $("#"+modal_type+" input#input_" + item.id + '_' + item.id).prop('checked',true);
    } else {
        /*    $("#child_"+item.id).append('<div class="no-padding pull-left" style="width: 33%;position:relative; "> '+
         '<label>'+
         '<input id="input_' + item.id + '_' + item.id + '_"  class="checkbox style-0 child_box" onchange="isAllFalse(this);" type="checkbox" >'+
         '<span class="font-xs">' + rpL("list") + '</span>'+
         '</label>'+
         '</div>');*/
    }
    if(item.checked == true){
        $("#"+modal_type+" input#input_" + item.id + '_' + item.id).prop('checked',true);
        $("#"+modal_type+" input#input_" + item.id + '_' + item.id + '_').prop('checked',true);
    }
}

//生成fid != 0 但是fid.fid == 0 且 type == Operation的节点
function draw_second_level_node(modal_type,item){
    $("#"+modal_type+" div#child_" + item.fid).append(
            '<div class="no-padding pull-left" style="width: 33%;position:relative; "> '+
            '<label>'+
            '<input id="input_' + item.fid + '_' + item.id + '"  class="checkbox style-0 child_box" onchange="isAllFalse(\''+modal_type+'\',this);" type="checkbox" >'+
            '<span class="font-xs">' + rpL(item.name) + '</span>'+
            '</label>'+
            '</div>');

    if(item.checked == true){
        $("#"+modal_type+" input#input_" + item.fid + '_' + item.id).prop('checked',true);
    }
}
function checked_item(id,permission_list){
    var items = permission_list;
    for(i=0;i<items.length;i++) {
        $("#"+id+" input#input_" + items[i].id + '_' + items[i].id + '_').prop('checked', true);
        if (items[i].fid != 0) {
            $("#"+id+" input#input_" + items[i].fid + '_' + items[i].id).prop('checked', true);

        } else {
            $("#"+id+" input[id$=_"+ items[i].id + "]").prop('checked',true);
        }

    }


}
/*
 全选 or 全不选
 */
function select_all(fid,str){
    var id = str.split('_')[1];
    if($("#"+fid+" input[id$=_"+ id + "]").prop('checked')){
        $("#"+fid+" input[id$=_"+ id + "]").prop('indeterminate',false);
        $("#"+fid+" input[id$=_"+ id + "]").css('visibility','hidden');
        $('#'+fid+' input[id^=' + str +'_]').each(function (){
            $(this).checked = true;
            $(this).prop('checked',true);
        });
    }
    else {
        $('#'+fid+' [id^=' + str +'_]').each(function (){$(this).removeAttr('checked');});
    }
}
/*
 监控子权限变化
 如果子权限全部未选，则父节点变为未选，
 如果子权限有已选的(不是全部)，那么父节点置为半选状态
 如果子权限全部选上，那么父节点置为全选
 */
function isAllFalse(id,objs){

    var flag = true;
    var idNum = objs.id;
    var fid = idNum.split('_')[1];
    var brother_id = idNum.split('_')[0] + '_' + idNum.split('_')[1];

    $("#"+id+" input[id$=_"+ fid + "]").prop('checked',false);
    $("#"+id+" input[id$=_"+ fid + "]").prop('indeterminate',false);
    $("#"+id+" input[id$=_"+ fid + "]").css('visibility','hidden');
    //遍历全部子节点，检查其权限状态
    $('#'+id+' [id^=' + brother_id +'_]').each(function (){
        //如果有一个子节点的权限为真，那么父节点的状态可以更改为半选
        if($(this).prop('checked') == true ){
            $("#"+id+" input[id$=_"+ fid + "]").prop('checked',false);
            $("#"+id+" input[id$=_"+ fid + "]").prop('indeterminate',true);
            $("#"+id+" input[id$=_"+ fid + "]").css('visibility','visible');
            $("#"+id+" input[id$=_"+ fid + "_]").css('checked',true);
        }
        else if($(this).prop('checked') == false && $(this).hasClass('child_box')){
//            console.log("===="+flag);
            flag = false;
        }
        else{}
    });

    //flag==true说明具有全部子权限，父节点要改为全选状态
    if(flag){
        $("input[id$=_"+ fid + "]").prop('checked',true);
        $("input[id$=_"+ fid + "]").prop('indeterminate',false);
        $("input[id$=_"+ fid + "]").css('visibility','hidden');
    }

}

/*
 记录所有被选择的权限
 */
function access_change(id){
    //find the all the input elements
    access_list = '';

    $('#'+id+' li input').each(function (){
        if(this.checked == true || this.indeterminate==true){
            var idNum = this.id.split('_')[2];
            if (access_list == ''){
                access_list += idNum
            }else{
                access_list = access_list+ ';' + idNum;
            }
        }
    });
    return access_list;
}

