/**
 * Created by songxiaoguang on 2014/11/19.
 */


/**
 * 地域列表
 */
function listHostRegionsFromMonitor(){
    doPost("/action/region/findRegionList",{},function(objs){
        if(objs.httpCode == "200") {
                var data = objs.data, str = "";
                if(data==null||data.length<=0){
                    showErrorMsg("","获取地域列表失败！");
                    return;
                }
                for(var i=0;i<data.length;i++){
                    str +=" <a onclick=\"load_host_monitor('"+data[i].regionUuid+"')\" id ='"+data[i].regionUuid+"' style='width:120px;margin:13px'  class='bs-btn '>"+data[i].name+"</a>";
                }
                $("#host_regionList_monitor").empty().append(str).show();
                load_host_monitor(data[0].regionUuid);//加载第一个
        }else{
            console.log("code :" + objs.code + "  msg:"+objs.message);
            showErrorMsg("","获取地域列表失败！");
        }

    });
}

//切换地域
function load_host_monitor(id){
    $("#"+id).addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    initHostData(id)
}

function initHostData(regionUuid){

    doPost("/action/monitor/sortNodeCurrentStatus", {"regionId":regionUuid}, function (objs){
        if (objs.httpCode == "200"&&objs.code=="Success") {
            var CPU_USE_RATE_LIST = objs.data.monitorSort.cpu,
                MEM_USE_RATE_LIST =  objs.data.monitorSort.mem,
                NIC_VALUE_LIST = objs.data.monitorSort.nic,
                IO_VALUE_LIST = objs.data.monitorSort.loadavg,
                top_ins = [],
                str1 = "",
                str2 = "",
                str3 = "",
                str4 = "";
            $("#host_cpu_thead").empty().append(
                    "<tr><th></th>"+
                    "<th class='text-center'  width='20%'>"+"名称"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"状态"+"</th>"+
                    "<th class='text-center'  width='20%'>"+"IP"+"</th>"+
                    "<th class='text-center'  width='45%'>"+"24小时走势"+"</th>"+
                    "<th class='text-center'  width='15%'>"+"使用率"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"最后更新时间"+"</th>"+
                    "</tr>");
            $("#host_mem_thead").empty().append(
                    "<tr><th></th>"+
                    "<th class='text-center'  width='20%'>"+"名称"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"状态"+"</th>"+
                    "<th class='text-center'  width='20%'>"+"IP"+"</th>"+
                    "<th class='text-center'  width='45%'>"+"24小时走势"+"</th>"+
                    "<th class='text-center'  width='15%'>"+"使用率"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"最后更新时间"+"</th>"+
                    "</tr>");
            $("#host_nic_thead").empty().append(
                    "<tr><th></th>"+
                    "<th class='text-center'  width='20%'>"+"名称"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"状态"+"</th>"+
                    "<th class='text-center'  width='20%'>"+"IP"+"</th>"+
                    "<th class='text-center'  width='45%'>"+"24小时走势"+"</th>"+
                    "<th class='text-center'  width='15%'>"+"带宽"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"最后更新时间"+"</th>"+
                    "</tr>");
            $("#host_io_thead").empty().append(
                    "<tr><th></th>"+
                    "<th class='text-center'  width='20%'>"+"名称"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"状态"+"</th>"+
                    "<th class='text-center'  width='20%'>"+"IP"+"</th>"+
                    "<th class='text-center'  width='45%'>"+"24小时走势"+"</th>"+
                    "<th class='text-center'  width='15%'>"+"使用率"+"</th>"+
                    //"<th class='text-center'  width='20%'>"+"最后更新时间"+"</th>"+
                    "</tr>");

            if(CPU_USE_RATE_LIST!=null&&CPU_USE_RATE_LIST.length>0){
                for (var i = 0; i < CPU_USE_RATE_LIST.length; i++) {

                    var hostInfo_cpu = CPU_USE_RATE_LIST[i],
                        hostInfo_mem = MEM_USE_RATE_LIST[i],
                        hostInfo_nic = NIC_VALUE_LIST[i],
                        hostInfo_io = IO_VALUE_LIST[i];


                    top_ins.push(hostInfo_cpu.address);
                    top_ins.push(hostInfo_mem.address);
                    top_ins.push(hostInfo_nic.address);
                    top_ins.push(hostInfo_io.address);

                    str1 +=
                        "<tr class='text-center'>" +
                        "<td class='text-center'>"+(i+1)+"</td>" +
                        "<td class='text-center'>" + hostInfo_cpu.name + "</td>" +
                        //"<td class='text-center'>" + rpL(hostInfo_cpu.state) + "</td>"+
                        "<td class='text-center'>" + hostInfo_cpu.address + "</td>"+
                        "<td class='text-align-center'>" +"<div id = '"+replaceIP(hostInfo_cpu.address)+"cpu"+"' class='sparkline txt-color-blue text-align-center' data-sparkline-type='line' data-sparkline-height='22px' data-sparkline-width='200px' data-sparkline-barwidth='2'>loading...</div>" + "</td>" +
                        "<td class='text-center'>" + hostInfo_cpu.cpu+"%"+ "</td>" +
                        //"<td class='text-center'>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "</tr>";
                    str2 +=
                        "<tr class='text-center'>" +
                        "<td class='text-center'>"+(i+1)+"</td>" +
                        "<td class='text-center'>" + hostInfo_mem.name + "</td>" +
                        //"<td class='text-center'>" + rpL(hostInfo_cpu.state) + "</td>" +
                        "<td class='text-center'>" + hostInfo_mem.address + "</td>"+
                        "<td class='text-align-center'>" +"<div id = '"+replaceIP(hostInfo_mem.address)+"mem"+"' class='sparkline txt-color-blue text-align-center' data-sparkline-type='line' data-sparkline-height='22px' data-sparkline-width='200px' data-sparkline-barwidth='2'>loading...</div>" + "</td>" +
                        "<td class='text-center'>" + hostInfo_mem.mem+"%"+ "</td>" +
                        //"<td class='text-center'>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "</tr>";
                    str3 +=
                        "<tr class='text-center'>" +
                        "<td class='text-center'>"+(i+1)+"</td>" +
                        "<td class='text-center'>" + hostInfo_nic.name + "</td>" +
                        //"<td class='text-center'>" + rpL(hostInfo_cpu.state) + "</td>" +
                        "<td class='text-center'>" + hostInfo_nic.address + "</td>"+
                        "<td class='text-align-center'>" +"<div id = '"+replaceIP(hostInfo_nic.address)+"nic"+"' class='sparkline txt-color-blue text-align-center' data-sparkline-type='line' data-sparkline-height='22px' data-sparkline-width='200px' data-sparkline-barwidth='2'>loading...</div>" + "</td>" +
                        "<td class='text-center'>" + hostInfo_nic.nic+"Kbps"+ "</td>" +
                       // "<td class='text-center'>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "</tr>";
                    str4 +=
                        "<tr class='text-center'>" +
                        "<td class='text-center'>"+(i+1)+"</td>" +
                        "<td class='text-center'>" + hostInfo_io.name + "</td>" +
                        //"<td class='text-center'>" + rpL(hostInfo_cpu.state) + "</td>" +
                        "<td class='text-center'>" + hostInfo_io.address + "</td>"+
                        "<td class='text-align-center'>" +"<div id = '"+replaceIP(hostInfo_io.address)+"loadavg"+"' class='sparkline txt-color-blue text-align-center' data-sparkline-type='line' data-sparkline-height='22px' data-sparkline-width='200px' data-sparkline-barwidth='2'>loading...</div>" + "</td>" +
                        "<td class='text-center'>" + hostInfo_io.loadavg+"%"+ "</td>" +
                        //"<td class='text-center'>" + new Date().Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                        "</tr>";

                }

                $("#host_cpu_tbody").empty().append(str1);
                $("#host_mem_tbody").empty().append(str2);
                $("#host_nic_tbody").empty().append(str3);
                $("#host_io_tbody").empty().append(str4);
                getHostDetailTrend(unique(top_ins),regionUuid);
            }else{
                var loadStr = "<tr class='odd'><td class='dataTables_empty' valign='top' colspan='10' style='border-width:0px;'><span>没有检索到数据</span></td></tr>"
                $("#host_cpu_tbody").empty().append(loadStr);
                $("#host_mem_tbody").empty().append(loadStr);
                $("#host_nic_tbody").empty().append(loadStr);
                $("#host_io_tbody").empty().append(loadStr);
            }

        } else if (!objs.data || !objs.data.monitorSort){
            showErrorMsg("","该地域下暂时没有监控信息");
        }else {
            showErrorMsg("程序异常","获取监控信息失败");
        }
    })

}

function getHostDetailTrend(top_ins, regionUuid) {
    var timestamp = 24 * 60 * 60;

    for (var i = 0; i < top_ins.length; i++) {
        var node_ip = top_ins[i];
        doPost("/action/monitor/findNodeStatus", {"nodeIP": node_ip, "regionId": regionUuid, "timestamp": timestamp}, function (objs) {
            if (objs.httpCode == "200" && objs.code == "Success") {
                //for (var j = 0; j < objs.data.metricses.length; j++) {
                    var nic_data = objs.data.metricses[0],
                        mem_data = objs.data.metricses[1],
                        cpu_data = objs.data.metricses[2],
                        loadavg_data = objs.data.metricses[3];
                    $("#" + replaceIP(top_ins[i]) + "cpu").html(cpu_data.lines.join(","));
                    $("#" + replaceIP(top_ins[i]) + "mem").html(mem_data.lines.join(","));
                    $("#" + replaceIP(top_ins[i]) + "nic").html(nic_data.lines.join(","));
                    $("#" + replaceIP(top_ins[i]) + "loadavg").html(loadavg_data.lines.join(","));

                //}

            } else {
                showErrorMsg(rpL(objs.data.code), "24小时趋势信息失败！");
            }

        }, "", false);

        //runAllCharts("[id^='"+ top_ins[i] +"']");
        runAllCharts("#" + replaceIP(top_ins[i]) + "cpu");
        runAllCharts("#" + replaceIP(top_ins[i]) + "mem");
        runAllCharts("#" + replaceIP(top_ins[i]) + "nic");
        runAllCharts("#" + replaceIP(top_ins[i]) + "loadavg");

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

function replaceIP(ip){
    if(ip){
        return ip.replace(/\./g,"_");
    }else{
        return "";
    }
}
