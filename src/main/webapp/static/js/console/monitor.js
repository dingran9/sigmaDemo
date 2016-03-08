/**
 * Created by songxiaoguang on 2014/10/13.
 */


var chart1,
    chart2,
    chart3,
    chart4,
    cpu_data = null,
    mem_data = null,
    nic_data = null,
    io_data = null;

//云主机监控
function instance_monistor(){
    var currentTime = Date.parse(new Date());
    disableRightKey();
    $('#ins_monitor_modal').modal("show");
    $("#btn_ins_monitor_30m").addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    var timestamp=30*60;
    plotChart(timestamp);
}

//物理主机监控
function node_monistor(){
    var currentTime = Date.parse(new Date());
    disableRightKey();
    $('#node_monitor_modal').modal("show");
    $("#btn_node_monitor_30m").addClass("btn-primary").removeClass("btn-default ").siblings().addClass("btn-default ").removeClass("btn-primary");
    var timestamp=30*60;
    plotChart_node(timestamp);

}

function plotChart(timestamp){
    Highcharts.setOptions({
        global: {
            useUTC: false
        }

    });
    var currentTime = Date.parse(new Date());
    var instanceList = [];
    instanceList.push(sel_row_id);
    doPost("/action/monitor/findHostStatus",{"instanceId":sel_row_id,
        //"nodeIP":node_ip,
        "regionId":sel_region_id,
        "timestamp":timestamp},
        function(objs){
        if(objs.httpCode == "200"&&objs.code=="Success"){

                for(var i=0;i<objs.data.metricses.length;i++){
                    if(objs.data.metricses[i].keyName=="cpu"){
                        cpu_data=objs.data.metricses[i];
                    }
                    else if(objs.data.metricses[i].keyName=="mem"){
                        mem_data = objs.data.metricses[i];
                    }else if(objs.data.metricses[i].keyName=="nic"){
                        nic_data = objs.data.metricses[i];
                    }else if(objs.data.metricses[i].keyName=="io"){
                        io_data = objs.data.metricses[i];
                    }
                }
                var cpu_datas =[];

                for(var i=0;i<cpu_data.xList.length;i++){
                    var tmp=[];
                    tmp[0] = cpu_data.xList[i];
                    tmp[1] = parseFloat(cpu_data.lines[i]);
                    cpu_datas.push(tmp)
                }
                var mem_datas =[];

                for(var i=0;i<mem_data.xList.length;i++){
                    var tmp2=[];
                    tmp2[0] = mem_data.xList[i];
                    tmp2[1] = parseFloat(mem_data.lines[i]);
                    mem_datas.push(tmp2)
                }

                var nic_datas =[];

                for(var i=0;i<nic_data.xList.length;i++){
                    var tmp3=[];
                    tmp3[0] = nic_data.xList[i];
                    tmp3[1] = parseFloat(nic_data.lines[i]);
                    nic_datas.push(tmp3)
                }

                var io_datas =[];

                for(var i=0;i<io_data.xList.length;i++){
                    var tmp4=[];
                    tmp4[0] = io_data.xList[i];
                    tmp4[1] = parseFloat(io_data.lines[i]);
                    io_datas.push(tmp4)
                }

            }
            chart1 = new Highcharts.Chart({
                chart: {
                    renderTo: 'cpu-container',
                    zoomType: 'x',
                    spacingRight: 20
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                colors: [
                    "#35a1eb",
                    "#65cd00",
                    "#ffa500",
                    "#e9d600",
                    "#cccccc"
                ],
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: 'CPU使用率(%)'
                    },
                   // max: 100,
                    min: 0,
                    //tickInterval:20,
                    showFirstLabel: false,
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000'
                },
                tooltip: {
                    shared: true
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: [0, 0, 0, 300],
                            stops: [
                                [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [
                    {
                        type: 'area',
                        name: 'CPU使用率 %',
                        data: cpu_datas
                    }
                ]
            });
            chart2 = new Highcharts.Chart({
                chart: {
                    renderTo: 'mem-container',
                    zoomType: 'x',
                    spacingRight: 20
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                colors: [
                    "#35a1eb",
                    "#65cd00",
                    "#ffa500",
                    "#e9d600",
                    "#cccccc"
                ],
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: '内存使用率(%)'
                    },
                    // max: 100,
                    min: 0,
                    //tickInterval:20,
                    showFirstLabel: false,
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000'
                },
                tooltip: {
                    shared: true
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: [0, 0, 0, 300],
                            stops: [
                                [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [
                    {
                        type: 'area',
                        name: '内存使用率 %',
                        data: mem_datas
                    }
                ]
            });
            chart3 = new Highcharts.Chart({
                    chart: {
                        renderTo: 'bandwidth-container',
                        zoomType: 'x',
                        spacingRight: 20
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: ''
                    },
                    colors: [
                        "#35a1eb",
                        "#65cd00",
                        "#ffa500",
                        "#e9d600",
                        "#cccccc"
                    ],
                    xAxis: {
                        type: 'datetime',
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        title: {
                            text: '虚机带宽(Kbps)'
                        },
                        /*min: 0,
                        max: 10,*/
                        showFirstLabel: false,
                        lineWidth: 1,
                        tickWidth: 1,
                        tickColor: '#000'
                    },
                    tooltip: {
                        formatter: function() {
                            var s =  Highcharts.dateFormat("%A, %b %e, %Y",this.x);
                            $.each(this.points, function(i, point) {
                                var y = "";
                                if(point.y < 1e3){
                                    y = point.y;
                                }else if(point.y >= 1e3 && point.y < 1e6){
                                    y = (point.y/1e3).toFixed(2) + "K";
                                }else if(point.y >= 1e6 && point.y < 1e9){
                                    y = (point.y/1e6).toFixed(2) + "M";
                                }else if(point.y >= 1e9){
                                    y = (point.y/1e9).toFixed(2) + "G";
                                }
                                s += '<br/>'+ point.series.name +': <b>'+ y+'</b>';
                            });
                            return s;
                        },
                        shared: true
                    },
                    legend: {
                        enabled: true
                    },
                    plotOptions: {
                        line: {
                            lineWidth: 1,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {
                                        enabled: true,
                                        radius: 5
                                    }
                                }
                            },
                            shadow: false,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [
                        {
                            type: 'line',
                            name: '带宽 Kbps',
                            fillColor: {
                                linearGradient: [0, 0, 0, 300],
                                stops: [
                                    [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')]
                                ]
                            },
                            data: nic_datas
                        }
                    ]
                });
            chart4 = new Highcharts.Chart({
                chart: {
                    renderTo: 'diskio-container',
                    zoomType: 'x',
                    spacingRight: 20
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                colors: [
                    "#35a1eb",
                    "#65cd00",
                    "#ffa500",
                    "#e9d600",
                    "#cccccc"
                ],
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: '磁盘I/O(Kb/s)'
                    },
                    /*min: 0,
                    max: 100,*/
                    showFirstLabel: false,
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000'
                },
                tooltip: {
                    formatter: function() {
                        var s =  Highcharts.dateFormat("%A, %b %e, %Y",this.x);
                        $.each(this.points, function(i, point) {
                            var y = "";
                            if(point.y < 1e3){
                                y = point.y;
                            }else if(point.y >= 1e3 && point.y < 1e6){
                                y = (point.y/1e3).toFixed(2) + "K";
                            }else if(point.y >= 1e6 && point.y < 1e9){
                                y = (point.y/1e6).toFixed(2) + "M";
                            }else if(point.y >= 1e9){
                                y = (point.y/1e9).toFixed(2) + "G";
                            }
                            s += '<br/>'+ point.series.name +': <b>'+ y+'</b>';
                        });
                        return s;
                    },
                    shared: true
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    line: {
                        lineWidth: 1,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [
                    {
                        type: 'line',
                        name: '磁盘 Kb/s',
                        fillColor: {
                            linearGradient: [0, 0, 0, 300],
                            stops: [
                                [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')]
                            ]
                        },
                        data: io_datas
                    }
                ]
            });

    },"json");

}



var cpu_data_host = null;
var mem_data_host = null;
var nic_data_host=null;
var io_data_host=null;

function plotChart_node(timestamp){

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    doPost("/action/monitor/findNodeStatus",{
            "nodeIP":sel_host_row_ip,
            "regionId":sel_region_id_host,
            "timestamp":timestamp},
        function(objs){
        if(objs.httpCode == "200"&&objs.code=="Success"){
            for(var i=0;i<objs.data.metricses.length;i++){
                if(objs.data.metricses[i].keyName=="cpu"){
                    cpu_data_host=objs.data.metricses[i];
                }
                else if(objs.data.metricses[i].keyName=="mem"){
                    mem_data_host = objs.data.metricses[i];
                }else if(objs.data.metricses[i].keyName=="nic"){
                    nic_data_host = objs.data.metricses[i];
                }else if(objs.data.metricses[i].keyName=="loadavg"){
                    io_data_host = objs.data.metricses[i];
                }
            }
                var cpu_data_hosts =[];

                for(var i=0;i<cpu_data_host.xList.length;i++){
                    var tmp=[];
                    tmp[0] = cpu_data_host.xList[i];
                    tmp[1] = parseFloat(cpu_data_host.lines[i]);
                    cpu_data_hosts.push(tmp)
                }
                var mem_data_host_datas =[];

                for(var i=0;i<mem_data_host.xList.length;i++){
                    var tmp2=[];
                    tmp2[0] = mem_data_host.xList[i];
                    tmp2[1] = parseFloat(mem_data_host.lines[i]);
                    mem_data_host_datas.push(tmp2)
                }

                var nic_data_host_datas =[];

                for(var i=0;i<nic_data_host.xList.length;i++){
                    var tmp4=[];
                    tmp4[0] = nic_data_host.xList[i];
                    tmp4[1] = parseFloat(nic_data_host.lines[i]);
                    nic_data_host_datas.push(tmp4)
                }

                var io_data_host_datas =[];

                for(var i=0;i<io_data_host.xList.length;i++){
                    var tmp5=[];
                    tmp5[0] = io_data_host.xList[i];
                    tmp5[1] = parseFloat(io_data_host.lines[i]);
                    io_data_host_datas.push(tmp5)
                }
            }
            chart1 = new Highcharts.Chart({
                chart: {
                    renderTo: 'cpu-container-node',
                    zoomType: 'x',
                    spacingRight: 20
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                colors: [
                    "#35a1eb",
                    "#65cd00",
                    "#ffa500",
                    "#e9d600",
                    "#cccccc"
                ],
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: 'CPU使用率(%)'
                    },
                    //max: 100,
                    min: 0,
                    //tickInterval:20,
                    showFirstLabel: false,
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000'
                },
                tooltip: {
                    shared: true
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: [0, 0, 0, 300],
                            stops: [
                                [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [
                    {
                        type: 'area',
                        name: 'CPU使用率 %',
                        data: cpu_data_hosts
                    }
                ]
            });


            chart2 = new Highcharts.Chart({
                chart: {
                    renderTo: 'mem-container-node',
                    zoomType: 'x',
                    spacingRight: 20
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                colors: [
                    "#35a1eb",
                    "#65cd00",
                    "#ffa500",
                    "#e9d600",
                    "#cccccc"
                ],
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: '内存使用率 %'
                    },
                    /*min: 0,
                     max: 10,*/
                    showFirstLabel: false,
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000'
                },
                tooltip: {
                    formatter: function() {
                        var s =  Highcharts.dateFormat("%A, %b %e, %Y",this.x);
                        $.each(this.points, function(i, point) {
                            var y = "";
                            if(point.y < 1e3){
                                y = point.y;
                            }else if(point.y >= 1e3 && point.y < 1e6){
                                y = (point.y/1e3).toFixed(2) + "K";
                            }else if(point.y >= 1e6 && point.y < 1e9){
                                y = (point.y/1e6).toFixed(2) + "M";
                            }else if(point.y >= 1e9){
                                y = (point.y/1e9).toFixed(2) + "G";
                            }
                            s += '<br/>'+ point.series.name +': <b>'+ y+'</b>';
                        });
                        return s;
                    },
                    shared: true
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    line: {
                        lineWidth: 1,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [
                    {
                        type: 'line',
                        name: '内存使用率 %',
                        fillColor: {
                            linearGradient: [0, 0, 0, 300],
                            stops: [
                                [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')]
                            ]
                        },
                        data: mem_data_host_datas
                    }
                ]
            });

            chart3 = new Highcharts.Chart({
                chart: {
                    renderTo: 'bandwidth-container-node',
                    zoomType: 'x',
                    spacingRight: 20
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                colors: [
                    "#35a1eb",
                    "#65cd00",
                    "#ffa500",
                    "#e9d600",
                    "#cccccc"
                ],
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: '带宽(Kbps)'
                    },
                    /*min: 0,
                     max: 100,*/
                    showFirstLabel: false,
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000'
                },
                tooltip: {
                    formatter: function() {
                        var s =  Highcharts.dateFormat("%A, %b %e, %Y",this.x);
                        $.each(this.points, function(i, point) {
                            var y = "";
                            if(point.y < 1e3){
                                y = point.y;
                            }else if(point.y >= 1e3 && point.y < 1e6){
                                y = (point.y/1e3).toFixed(2) + "K";
                            }else if(point.y >= 1e6 && point.y < 1e9){
                                y = (point.y/1e6).toFixed(2) + "M";
                            }else if(point.y >= 1e9){
                                y = (point.y/1e9).toFixed(2) + "G";
                            }
                            s += '<br/>'+ point.series.name +': <b>'+ y+'</b>';
                        });
                        return s;
                    },
                    shared: true
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    line: {
                        lineWidth: 1,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [
                    {
                        type: 'line',
                        name: '带宽 Kbps',
                        fillColor: {
                            linearGradient: [0, 0, 0, 300],
                            stops: [
                                [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')]
                            ]
                        },
                        data: nic_data_host_datas
                    }
                ]
            });
            chart4 = new Highcharts.Chart({
                chart: {
                    renderTo: 'io-container-node',
                    zoomType: 'x',
                    spacingRight: 20
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                colors: [
                    "#35a1eb",
                    "#65cd00",
                    "#ffa500",
                    "#e9d600",
                    "#cccccc"
                ],
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: '磁盘I/O(Kb/s)'
                    },
                    /*min: 0,
                     max: 100,*/
                    showFirstLabel: false,
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#000'
                },
                tooltip: {
                    formatter: function() {
                        var s =  Highcharts.dateFormat("%A, %b %e, %Y",this.x);
                        $.each(this.points, function(i, point) {
                            var y = "";
                            if(point.y < 1e3){
                                y = point.y;
                            }else if(point.y >= 1e3 && point.y < 1e6){
                                y = (point.y/1e3).toFixed(2) + "K";
                            }else if(point.y >= 1e6 && point.y < 1e9){
                                y = (point.y/1e6).toFixed(2) + "M";
                            }else if(point.y >= 1e9){
                                y = (point.y/1e9).toFixed(2) + "G";
                            }
                            s += '<br/>'+ point.series.name +': <b>'+ y+'</b>';
                        });
                        return s;
                    },
                    shared: true
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    line: {
                        lineWidth: 1,
                        marker: {
                            enabled: false,
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [
                    {
                        type: 'line',
                        name: '磁盘I/O(Kb/s)',
                        fillColor: {
                            linearGradient: [0, 0, 0, 300],
                            stops: [
                                [0, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')]
                            ]
                        },
                        data: io_data_host_datas
                    }
                ]
            });
    },"json");

}
