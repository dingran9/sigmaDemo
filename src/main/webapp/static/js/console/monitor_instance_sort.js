/**
 * Created by songxiaoguang on 2014/11/19.
 */


/**
 * 地域列表
 */
function listRegionsFromMonitor(){
    doPost("/action/region/findRegionList",{},function(objs){
        if(objs.httpCode == "200") {
                var data = objs.data,str = "";
                if(data==null||data.length<=0){
                    showErrorMsg("","获取地域列表失败！");
                    return;
                }
                for(var i=0;i<data.length;i++){
                    str +=" <a onclick=\"load_instance_monitor('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
                }
                $("#regionList_monitor").empty().append(str).show();
                load_instance_monitor(data[0].regionUuid);//加载第一个
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
        }

    });
}

//切换地域
function load_instance_monitor(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    initData(id)
}

function initData(regionUuid){
    doPost("/action/monitor/sortHostCurrentStatus", {"regionId":regionUuid}, function (objs){
        if (objs.httpCode == "200"&&objs.code=="Success" && objs.data.monitorSort) {
            var CPU_USE_RATE_LIST = objs.data.monitorSort.cpu,
                MEM_USE_RATE_LIST =  objs.data.monitorSort.mem,
                NIC_VALUE_LIST = objs.data.monitorSort.nic,
                IO_VALUE_LIST = objs.data.monitorSort.io,
                top_ins = [],
                temp = [],
                str1 = "",
                str2 = "",
                str3 = "",
                str4 = "";
            $("#instance_cpu_thead").empty().append(
                    "<tr><th></th>"+
                    "<th class='text-center'  width='20%'>"+"名称"+"</th>"+
                    "<th class='text-center'  width='20%'>"+"状态"+"</th>"+
                    "<th class='text-center'  width='15%'>"+"IP"+"</th>"+
                    "<th class='text-center'  width='35%'>"+"24小时走势"+"</th>"+
                    "<th class='text-center'  width='10%'>"+"使用率"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"最后更新时间"+"</th>"+
                    "</tr>");
            $("#instance_mem_thead").empty().append(
                    "<tr><th></th>"+
                    "<th class='text-center'  width='20%'>"+"名称"+"</th>"+
                    "<th class='text-center'  width='20%'>"+"状态"+"</th>"+
                    "<th class='text-center'  width='15%'>"+"IP"+"</th>"+
                    "<th class='text-center'  width='35%'>"+"24小时走势"+"</th>"+
                    "<th class='text-center'  width='10%'>"+"使用率"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"最后更新时间"+"</th>"+
                    "</tr>");
            $("#instance_nic_thead").empty().append(
                    "<tr><th></th>"+
                    "<th class='text-center'  width='20%'>"+"名称"+"</th>"+
                    "<th class='text-center'  width='20%'>"+"状态"+"</th>"+
                    "<th class='text-center'  width='15%'>"+"IP"+"</th>"+
                    "<th class='text-center'  width='35%'>"+"24小时走势"+"</th>"+
                    "<th class='text-center'  width='10%'>"+"带宽"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"最后更新时间"+"</th>"+
                    "</tr>");
            $("#instance_io_thead").empty().append(
                    "<tr><th></th>"+
                    "<th class='text-center'  width='20%'>"+"名称"+"</th>"+
                    "<th class='text-center'  width='20%'>"+"状态"+"</th>"+
                    "<th class='text-center'  width='15%'>"+"IP"+"</th>"+
                    "<th class='text-center'  width='35%'>"+"24小时走势"+"</th>"+
                    "<th class='text-center'  width='10%'>"+"I/O速度"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"最后更新时间"+"</th>"+
                    "</tr>");

            if(CPU_USE_RATE_LIST!=null&&CPU_USE_RATE_LIST.length>0){
                for (var i = 0; i < CPU_USE_RATE_LIST.length; i++) {

                    var instanceInfo_cpu = CPU_USE_RATE_LIST[i].instance,
                        instanceInfo_mem = MEM_USE_RATE_LIST[i].instance,
                        instanceInfo_nic = NIC_VALUE_LIST[i].instance,
                        instanceInfo_io  = IO_VALUE_LIST[i].instance;

                    var params  =[];

                    if($.inArray(instanceInfo_cpu.uuid,temp)<0){
                        temp.push(instanceInfo_cpu.uuid);
                        top_ins.push({"instanceId":instanceInfo_cpu.uuid,"nodeIp":CPU_USE_RATE_LIST[i].nodeIp});
                    }
                    if($.inArray(instanceInfo_mem.uuid,temp)<0){
                        temp.push(instanceInfo_mem.uuid);
                        top_ins.push({"instanceId":instanceInfo_mem.uuid,"nodeIp":MEM_USE_RATE_LIST[i].nodeIp});
                    }
                    if($.inArray(instanceInfo_nic.uuid,temp)<0){
                        temp.push(instanceInfo_nic.uuid);
                        top_ins.push({"instanceId":instanceInfo_nic.uuid,"nodeIp":NIC_VALUE_LIST[i].nodeIp});
                    }
                    if($.inArray(instanceInfo_io.uuid,top_ins)<0){
                        temp.push(instanceInfo_io.uuid);
                        top_ins.push({"instanceId":instanceInfo_io.uuid,"nodeIp":IO_VALUE_LIST[i].nodeIp});
                    }

                    str1 +=
                        "<tr class='text-center'>" +
                        "<td class='text-center'>"+(i+1)+"</td>" +
                        "<td class='text-center'>" + instanceInfo_cpu.hostName + "</td>" +
                        "<td class='text-center'>" + rpL(instanceInfo_cpu.state) + "</td>"+
                        "<td class='text-center'>" + instanceInfo_cpu.privateIp + "</td>"+
                        "<td class='text-align-center'>" +"<div id = '"+instanceInfo_cpu.uuid+"cpu"+"' class='sparkline txt-color-blue text-align-center' data-sparkline-type='line' data-sparkline-height='22px' data-sparkline-width='200px' data-sparkline-barwidth='2'>loading...</div>" + "</td>" +
                        "<td class='text-center'>" + parseFloat(CPU_USE_RATE_LIST[i].cpu)+"%"+ "</td>" +
                        //"<td class='text-center'>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "</tr>";
                    str2 +=
                        "<tr class='text-center'>" +
                        "<td class='text-center'>"+(i+1)+"</td>" +
                        "<td class='text-center'>" + instanceInfo_mem.hostName + "</td>" +
                        "<td class='text-center'>" + rpL(instanceInfo_cpu.state) + "</td>" +
                        "<td class='text-center'>" + instanceInfo_mem.privateIp + "</td>"+
                        "<td class='text-align-center'>" +"<div id = '"+instanceInfo_mem.uuid+"mem"+"' class='sparkline txt-color-blue text-align-center' data-sparkline-type='line' data-sparkline-height='22px' data-sparkline-width='200px' data-sparkline-barwidth='2'>loading...</div>" + "</td>" +
                        "<td class='text-center'>" + MEM_USE_RATE_LIST[i].mem+"%"+ "</td>" +
                        //"<td class='text-center'>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "</tr>";
                    str3 +=
                        "<tr class='text-center'>" +
                        "<td class='text-center'>"+(i+1)+"</td>" +
                        "<td class='text-center'>" + instanceInfo_nic.hostName + "</td>" +
                        "<td class='text-center'>" + rpL(instanceInfo_cpu.state) + "</td>" +
                        "<td class='text-center'>" + instanceInfo_nic.privateIp + "</td>"+
                        "<td class='text-align-center'>" +"<div id = '"+instanceInfo_nic.uuid+"nic"+"' class='sparkline txt-color-blue text-align-center' data-sparkline-type='line' data-sparkline-height='22px' data-sparkline-width='200px' data-sparkline-barwidth='2'>loading...</div>" + "</td>" +
                        "<td class='text-center'>" + NIC_VALUE_LIST[i].nic+"Kbps"+ "</td>" +
                       // "<td class='text-center'>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "</tr>";
                    str4 +=
                        "<tr class='text-center'>" +
                        "<td class='text-center'>"+(i+1)+"</td>" +
                        "<td class='text-center'>" + instanceInfo_io.hostName + "</td>" +
                        "<td class='text-center'>" + rpL(instanceInfo_cpu.state) + "</td>" +
                        "<td class='text-center'>" + instanceInfo_io.privateIp + "</td>"+
                        "<td class='text-align-center'>" +"<div id = '"+instanceInfo_io.uuid+"io"+"' class='sparkline txt-color-blue text-align-center' data-sparkline-type='line' data-sparkline-height='22px' data-sparkline-width='200px' data-sparkline-barwidth='2'>loading...</div>" + "</td>" +
                        "<td class='text-center'>" + IO_VALUE_LIST[i].io+"KB/s"+ "</td>" +
                        //"<td class='text-center'>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "</tr>";

                }

                $("#instance_cpu_tbody").empty().append(str1);
                $("#instance_mem_tbody").empty().append(str2);
                $("#instance_nic_tbody").empty().append(str3);
                $("#instance_io_tbody").empty().append(str4);
                getDetailTrend(top_ins,regionUuid);
            }else{
                var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
                $("#instance_cpu_tbody").empty().append(loadStr);
                $("#instance_mem_tbody").empty().append(loadStr);
                $("#instance_nic_tbody").empty().append(loadStr);
                $("#instance_io_tbody").empty().append(loadStr);
            }

        } else if (!objs.data || !objs.data.monitorSort){
            showErrorMsg("","该地域下暂时没有监控信息");
        }else {
            showErrorMsg("程序异常","获取监控信息失败");
        }
    })

}

//获取趋势
function getDetailTrend(top_ins, regionUuid) {

    var timestamp = 24 * 60 * 60;
    for (var i = 0; i < top_ins.length; i++) {
        doPost("/action/monitor/findHostStatus", {"instanceId": top_ins[i].instanceId, "nodeIP": top_ins[i].nodeIp, "regionId": regionUuid, "timestamp": timestamp}, function (objs) {
            if (objs.httpCode == "200" && objs.code == "Success") {

                var nic_data = objs.data.metricses[0],
                    mem_data = objs.data.metricses[1],
                    cpu_data = objs.data.metricses[2],
                    io_data = objs.data.metricses[3];
                $("#" + top_ins[i].instanceId + "cpu").html(cpu_data.lines.join(","));
                $("#" + top_ins[i].instanceId + "mem").html(mem_data.lines.join(","));
                $("#" + top_ins[i].instanceId + "nic").html(nic_data.lines.join(","));
                $("#" + top_ins[i].instanceId + "io").html(io_data.lines.join(","));


            } else {
                showErrorMsg(rpL(objs.data.code), "24小时趋势信息失败！");
                console.log("code :" + objs.code + "  msg:" + objs.message);
            }

        }, "", false);

        //runAllCharts("[id^='"+ top_ins[i] +"']");
        runAllCharts("#" + top_ins[i].instanceId + "cpu");
        runAllCharts("#" + top_ins[i].instanceId + "mem");
        runAllCharts("#" + top_ins[i].instanceId + "nic");
        runAllCharts("#" + top_ins[i].instanceId + "io");

    }

}


function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

