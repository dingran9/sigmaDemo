/**
 * Copyright: cniaas
 * Author：dingRan
 * Date: 2014/9/15.
 * Description:产品类别
 */
var expTable;

function loadexpTable(id,catId){

    $("#exp_list_table").empty().append("<table id='exp-table' class='table table-responsive table-striped table-bordered table-hover table-text-center cniaas-table'><thead id='exp-thead' class=''></thead><tbody id='exp-tbody' class='table-tbody'></tbody></table>");

    $("#exp-thead").empty().append(
            "<tr>" +
            "<th width='5%'></th>"+
            //文献
            "<th class='table-thead' width='20%'>实验名称</th>"+
            //实验类型：干预型实验/观察型实验
            "<th class='table-thead' width='20%'>实验类型</th>"+
            //疾病名称
            "<th class='table-thead' width='20%'>疾病名称</th>"+
            //实验结果类型
            "<th class='table-thead' width='20%'>实验结果类型</th>"+
            //录入时间
            "<th class='table-thead' width='20%'>录入日期</th>"+
            "</tr>");

    var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3><i class='fa fa-cog fa-spin'></i>正在努力加载...</h3></span></td></tr>"
    $("#exp-tbody").empty().append(loadStr);
    runexpDataTables(function(){
        expTable=$("#exp-table").dataTable({
            "bFilter":true,
            "bDestroy":true,
            "bRetrieve":true,
            "sPaginationType" : "bootstrap_full",
            "aaSorting": [[ 7, "desc" ]],
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
            "fnDrawCallback": function( ) {
                $("#exp-table input").prop("checked",false);
                $("#exp_"+sel_exp_id).prop("checked",true);
            },
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: [ '_all' ]
                }
            ]
        });
    },id,catId);
}

function runexpDataTables(callback,id,catId){
    sel_exp_id=null;
    $("#btn_exp_edit,#btn_exp_delete").addClass("disabled");

    var data={};
    doPost("/action/experimentalResult/list",data,function(objs){
        if(objs.httpCode=="200"){
            var data=objs.data,
                str = '';

            for( var i=0;i<data.length;i++){
            	//实验编码
            	var empNum="实验名称"+i;;
            	if(data[i].experimentalNum){
            		empNum=data[i].experimentalNum;
            	}
            	var diseaseName="无此疾病";
            	if(data[i].diseasePo){
            		diseaseName=data[i].diseasePo.name;
            	}
                str += "<tr id='tr_exp_" + data[i].uuid + "'>"+
                    "<td class='check-tr'><label class='checkbox'>"+
                    "<input id='exp_" + data[i].uuid + "' type='checkbox' name='cbx_exp_list' onclick=\"set_exp_Sel(this,'"+data[i].uuid+"')\">"+
                    "<i></i></label></td>"+
                    "<td>"+empNum+"</td>"+
                    "<td>"+rpL("expRType_"+data[i].experimentType)+"</td>"+
                    "<td>"+diseaseName+"</td>"+
                    "<td>"+ rpL("expType_"+data[i].type) +"</td>"+
                    "<td>"+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+"</td>"+
                    "</tr>";
            }
            $("#exp-tbody").empty().append(str);
            callback();
        }else{
            var  loadStr="<tr class='odd'><td valign='top' colspan='10' style='border-width:0;'><span><h3>没有检索到数据</h3></span></td></tr>"
            $("#exp-tbody").empty().append(loadStr);
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });

}

var sel_exp_id="";
function set_exp_Sel(obj,id){
    var obj_checked = obj.checked;
    $("#exp_list_table input[name='cbx_exp_list']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;

    if(obj.checked){
        if(null != id){
            sel_exp_id=id;
        }
        $("#btn_exp_edit,#btn_exp_delete").removeClass("disabled")

    }else{
        $("#btn_exp_edit,#btn_exp_delete").addClass("disabled");
    }
}




//新增验证
function validateexp() {
    $("#exp-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                //pwdStrengthValidator: true,
                rangelength: [8, 20]
            },
            repeatPassword: {
                required: true,
                equalTo: "#password"
            },
            sex:{
                required:true
            },
            telNumber: {
                required: true,
                phoneNumValidator: true
            },
            SMSCode:{
                required:true,
                minlength:6,
                maxlength:6
            },
            verifyCode:{
                required: true
            }
        },
        messages: {
            email: {
                required: "请输入邮箱",
                email: "请按邮箱格式输入"
            },
            password: {
                required: "请输入密码",
                //pwdStrengthValidator: "密码应该只包含………………",
                rangelength: "密码长度应该在x位到y位之间"
            },
            repeatPassword: {
                required: "请确认密码",
                equalTo: "两次输入的密码不一致"
            },
            sex:{
                required:"请选择性别"
            },
            telNumber: {
                required: "请输入手机号码",
                phoneNumValidator: "请按手机号码格式输入"
            },
            SMSCode:{
                required:"请输入短信验证码",
                minlength:"短信验证码为六位",
                maxlength:"短信验证码为六位"
            },
            verifyCode:{
                required:"请输入验证码"
            }
        },

        highlight: function(element){
            $(element).closest('.input-group-exp').removeClass('has-success').addClass('has-error');
            btnConfirmState();
        },

        unhighlight: function(element){
            $(element).closest('.input-group-exp').removeClass('has-error').addClass('has-success');
            btnConfirmState();
        },

        errorPlacement: function (error, element) {
            error.addClass("col-lg-3").css('text-align','left').css('color','#FC4343').css('line-height','34px').css("float","left");
            error.appendTo(element.parent());
        }

    });
}
function btnConfirmState(){
    var validateSize = 6,size=0;
    $('#exp-form .input-group-exp').each(function () {
        if($(this).hasClass("has-success")){
            size+=1;
        }
    });
    if(validateSize==size){
        $("#expBtn").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }else{
        $("#expBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }
}

function addExperimentalResult(){
    var _expNo= $.trim($("#exp_add_no").val());
	//实验结果类型
    var _expType = $.trim($("#exp_type").val());
    //疾病id
    var _diseaseName = $.trim($("#exp_diseaseId").val());
    //实验类型：干预、观察
    var _expResultType = $.trim($("#exp_result_type").val());
    //干预物
    var _intervention = $.trim($("#exp_intervention").val());
    //干预物影响
    var _interventionEffect = $.trim($("#exp_intervention_effect").val());
    //微生物
    var _microorganism = $.trim($("#exp_microorganism").val());
    //菌种变化
    var _strainVariation = $.trim($("#exp_strain_variation").val());
    //菌代谢物质
    var _bacteriaMetabolism = $.trim($("#exp_bacteria_metabolism").val());
    //生理过程
    var _physiologicalProcess = $.trim($("#exp_physiological_process").val());
    //生理过程变化
    var _physiologicalProcessChange = $.trim($("#exp_physiological_process_change").val());
    //干预物注释
    var _interventionNote = $.trim($("#exp_intervention_note").val());
    //宿主
    var _hostName = $.trim($("#exp_hostName").val());
    var _sourceElement = $.trim($("#exp_source_element").val());
    //动物模型/人群特征
    var _animalModel = $.trim($("#exp_animal_model").val());
    var _documentId = $.trim($("#document_insList").val());

    var data = {
            experimentalNum:_expNo,
    		type:_expResultType,//实验结果类型
    		diseaseId: _diseaseName,//疾病id
    		interventionNote: _interventionNote,//干预物注释
    		intervention:_intervention,//干预物
    		interventionEffect:_interventionEffect,//干预物影响
    		microorganism: _microorganism,//微生物
    		strainVariation: _strainVariation,//菌种变化
    		physiologicalProcess: _physiologicalProcess,//生理过程
    		physiologicalProcessChange: _physiologicalProcessChange,//负科相关
    		experimentType: _expType,//实验类型
    		hostName: _hostName,//宿主
    		animalModel: _animalModel,//模型
            sourceElement: _sourceElement,//引发源
            documentId: _documentId//文献
    		};
    doPost("/action/experimentalResult/add",data,function(objs){
        if(objs.httpCode=="200"){
            showMsg("温馨提示","添加成功。");
            loadexpTable();
            $("#exp_widget-grid").show().siblings().hide();
            $("#exp_btns,#regionList_exp_div,#exp_tab_ul").show();
        }else{
            if(objs.code=="Resource.InUse" && objs.httpCode=="400"){
                showErrorMsg("温馨提示","该实验记录已经存在");
            }else{
                console.log("code :" + objs.code + "  msg:" + objs.message);
                showErrorMsg("","code :" + objs.code + "  msg:" + objs.message);
            }
        }
    });


}


function addexpCatValidate(){
    $("#exp-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
        	exp_name:{
                required:true
            },
            exp_parentId:{
                required:true
            },
            exp_category:{
                required:true
            },
            exp_pathogeny:{
                required:true
            },
            exp_catagory:{
                required:true

            },
            bill_unit_count:{
                required:true,
                number:true,
                min:0
            },
            unit_count_min:{
                required:true,
                number:true,
                min:0
            }
        },
        messages:{
        	exp_name:{
                required:"疾病名称不能为空"
            },
            exp_parentId:{
                required:"疾病父级大类"
            },
            exp_category:{
                required:"所属分类不能为空"
            },
            exp_pathogeny:{
                required:"病因为空"
            },
            exp_catagory:{
                required:"所属层级不能为空"
            }
        },
        /*        highlight: function(element){
         $(element).removeClass('exp-hsa-success').addClass('exp-hsa-error');
         expValidateBtn("exp-form","expBtn","expCat_type");
         },

         unhighlight: function(element){
         $(element).removeClass('exp-hsa-error').addClass('exp-hsa-success');
         $(element).parent().find("em").remove();
         expValidateBtn("exp-form","expBtn","expCat_type");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}
function editexpCatValidate(){
    $("#exp_edit-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules:{
            expCat_type:{
                required:true
            },
            exp_edit_region:{
                required:true
            },
            exp_image:{
                required:true
            },
            exp_status:{
                required:true
            },
            price:{
                required:true,
                number:true,
                min:0

            },
            bill_unit_count:{
                required:true,
                number:true,
                min:0
            },
            unit_count_min:{
                required:true,
                number:true,
                min:0
            }
        },
        messages:{
            expCat_type:{
                required:"产品类别不能为空"
            },
            exp_edit_region:{
                required:"地域不能为空"
            },
            exp_image:{
                required:"镜像不能为空"
            },
            exp_status:{
                required:"状态不能为空"
            },
            price:{
                required:"价格不能为空",
                number:"价格只能是数字",
                min:"价格不能小于零"
            },
            bill_unit_count:{
                required:"计费单位不能为空",
                number:"计费单位只能是数字",
                min:"计费单位不能小于零"
            },
            unit_count_min:{
                required:"计费最小值不能为空",
                number:"计费最小值只能是数字",
                min:"计费最小值不能小于零"
            }
        },
        /*        highlight: function(element){
         $(element).removeClass('exp-hsa-success').addClass('exp-hsa-error');
         expValidateBtn("exp_edit-form","exp_editBtn");
         },

         unhighlight: function(element){
         $(element).removeClass('exp-hsa-error').addClass('exp-hsa-success');
         $(element).parent().find("em").remove();
         expValidateBtn("exp_edit-form","exp_editBtn");
         },*/
        errorPlacement: function (error, element) {
            error.css('text-align','left').css('color','#FC4343').css("float","left");
            element.after(error);
        }
    });
}

function expValidateBtn(tableId,btnId,catId){
    if($("#"+tableId+ "exp-hsa-error").length>0){
        $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
    }else{
        var size=0;
        var type=  $('#'+catId).find("option:checked").text();

        if(type=="cpu" || type=="mem"){
            $("#"+tableId+" input.cpu").each(function () {
                if($(this).hasClass("exp-hsa-success")){
                    size+=1;
                }
            });
            if(size==2){
                $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }
        }else if(type=="image"){
            $("#"+tableId+" input.image").each(function () {
                if($(this).hasClass("exp-hsa-success")){
                    size+=1;
                }
            });
            if(size==1){
                if(convertStr($("#"+tableId+"select[name=exp_image]").val())==""){
                    $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
                }else{
                    $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
                }
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }

        }else if(type=="disk"){
            $("#"+tableId+" input.disk").each(function () {
                if($(this).hasClass("exp-hsa-success")){
                    size+=1;
                }
            });
            if(size==2){
                $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }
        }else if(type=="bandwidth"){
            $("#"+tableId+" input.bandwidth").each(function () {
                if($(this).hasClass("exp-hsa-success")){
                    size+=1;
                }
            });
            if(size>=4){
                $("#"+btnId).addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken').attr("disabled", false);
            }else{
                $("#"+btnId).removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken').attr("disabled", true);
            }
        }
    }


}



function initDatePlugin(id,linkId,option,defaultDate,minDate){

    if(defaultDate == null || defaultDate == undefined){
        defaultDate = new Date();
    }
    if(minDate == null || minDate == undefined){
        minDate = new Date();
    }
    var dates = caculateDate((new Date().getTime()),defaultDate),
        yearstr = '',
        monthstr = '',
        daystr = '';

    if(dates.year > 0){
        yearstr = "+"+dates.year+"y ";
    }else if(dates.year < 0){
        yearstr = dates.year+"y ";
    }else{

    }
    if(dates.month > 0){
        monthstr = "+"+dates.month+"m ";
    }else if(dates.month < 0){
        monthstr = dates.month+"m ";
    }else{

    }
    if(dates.day > 0){
        daystr = "+"+dates.day+"d";
    }else if(dates.day < 0){
        daystr = dates.day+"d";
    }else{

    }


    $(id).datepicker({
        dateFormat: 'yy-mm-dd',
//        minDate:minDate,
        defaultDate: yearstr + monthstr + daystr,
        dayNamesMin:['日', '一', '二', '三', '四', '五', '六'],
        monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        prevText: '<i class="fa fa-chevron-left"></i>',
        nextText: '<i class="fa fa-chevron-right"></i>'
        /*onSelect: function (selectedDate) {
            $(linkId).datepicker('option', option, selectedDate);
        }*/
    });


    $(id).val(new Date(defaultDate).Format("yyyy-MM-dd"));
//    $(linkId).datepicker('option', option, new Date(defaultDate));
}


/**
 * 计算两个日期中年月日的差
 * @param fromDate
 * @param toDate
 * @returns {{year: number, month: number, day: number}}
 */
function caculateDate(fromDate, toDate){

    if(fromDate == undefined){
        fromDate = new Date();
    }else{
        fromDate = new Date(fromDate);
    }
    if(toDate == undefined){
        toDate = new Date();
    }else{
        toDate = new Date(toDate);
    }

    var years = toDate.getYear() - fromDate.getYear();
    var months = toDate.getMonth() - fromDate.getMonth();
    var days = toDate.getDate() - fromDate.getDate();

    return {year:years,month:months,day:days}

}

function initGraph(data){
	//生成图形方法
	var g = {
		      nodes: [],
		      edges: []
		    },
		    colors = [
		                '#617db4',
		                '#668f3c',
		                '#c6583e',
		                '#b956af'
		              ],
		    s;
	for (i = 0; i < data.nodePos.length; i++) {
		  g.nodes.push({
		    id: data.nodePos[i].uuid+"",
		    label: data.nodePos[i].label,
		    x:data.nodePos[i].positionX,
		    y: data.nodePos[i].positionY,
		    size: data.nodePos[i].size,
		    color: data.nodePos[i].color
		  });
		}

		for (i = 0; i < data.edgePos.length; i++) {
		  g.edges.push({
		    id: data.edgePos[i].uuid+"",
		    source: data.edgePos[i].source.uuid+"",
		    target: data.edgePos[i].target.uuid+"",
		    // note the EdgeShapeLibrary.enumerate() returns the names of all
		    // supported renderers
		    //type: EdgeShapeLibrary.enumerate().map(function(s){return s.name;})[Math.round(Math.random()*4)],
		    type: data.edgePos[i].edgeType,
//			    type: 'curvedArrow',
		    curvedArrow:'target',
		    size: Math.random()
		  });
		}
//			sigma.renderers.def = sigma.renderers.canvas
		s = new sigma({
		  graph: g,
		  renderer: {
		    // IMPORTANT:
		    // This works only with the canvas renderer, so the
		    // renderer type set as "canvas" is necessary here.
		    container: document.getElementById('graph-container'),
		    type: 'canvas'
		  },
		  settings: {
		    minNodeSize: 1,
		    maxNodeSize: 10,
		    minEdgeSize: 0.1,
		    maxEdgeSize: 2
		  }
		});
		CustomEdgeShapes.init(s);
		
		sigma.plugins.dragNodes(s, s.renderers[0]);
		s.refresh();
}

//测试搜索
function searchDisease(){
	var _keyWord=$("#keyWord").val();
    doPost("/action/disease/search",{keyWord:_keyWord},function(objs){
        if(objs.httpCode === "200"){
//             showMsg("操作成功",objs.datas[0].name,3000);
            //检索节点等
            doPost("/action/shape/search",{shapeId:objs.datas[0].id},function(objs){
                if(objs.httpCode === "200"){
                	//画板初始化
                	$("#graph-container").html("");
                	initGraph(objs.data);
                }else{
                    console.log(objs);
//                     showErrorMsg("操作失败",rpLRespond(objs.message));
                }
            });
        }else{
            console.log(objs);
//             showErrorMsg("操作失败",rpLRespond(objs.message));
        }
    });
}