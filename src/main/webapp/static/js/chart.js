/**
 * ajax请求获取 Chart
 */
function EzAjaxChart(url, type, data, config) {
    this._init = function () {
        EzAjax(url, "GET", data, function (fm) {
            EzResponse(fm, "", function () {
                if (data == undefined) {
                    data = {};
                }
                if (config == undefined) {
                    config = {};
                }
//                XXX flag代表？标识
                config['flag'] = fm.flag;
                config['submit'] = function (result) {
//                    生成chart
                    var chart = new EzChart(result.data[0], "line", result.data[1], result.data[2], config);
                    chart.center();
                    chart.maximize();
                    chart.show();
                };
//                创建form  存放chart
                var form = new EzForm(fm.id, fm.title, fm.action, fm.fields, fm.captcha, config);
                form.center();
                form.show();
//                var chart = new EzChart(c.id, c.action, type, c.title, c.dateList, config);
            });
        });
    };

    this._init();
}


//function EzChart(id, action, type, winTitle, dataList, config) {
/**
 * 创建 chart
 * @param id   chart Id
 * @param type  chart  类型 （line、bar、pie）
 * @param winTitle  chart窗口的标题
 * @param dataList  显示的数据 （list类型）
 * @param config   其他的数据
 */
function EzChart(id, type, winTitle, dataList, config) {
    var _id;
    this._init = function () {
//       拼写chart 真实Id
        var rid = 'chart_' + id;
//        拼接div的Id
        _id = 'div#' + rid;
//        创建存放chart的div
        ez_init_div(gl_root_div, rid);
        /*
         如果 该div下没有kendoWindow这个数据名 则创建一个id为rid的Window
         data(key,value):key 存储的数据名  value:将要存储的任何数据*/
        if ($(_id).data("kendoWindow") == undefined) {
             EzWindow(rid, winTitle, "800px", true, ["Maximize", "Close"]);
//            new EzWindow(rid, winTitle, "650px", true, ["Refresh", "Maximize", "Close"]);
        }

        var _fn_content = function () {
//            创建data并将chart里的dataList数据插入该data中
            var data = '';
//            data += '<table class="monitorFilter">';
//            data += '<tr><td>开始日期</td><td><input id="' + id + '_startdate" value="" /></td><td>结束日期</td><td><input id="' + id + '_enddate" value="" /></td><td><input id="fm_' + id + '_submit" type="button" value="筛选" /></td></tr></table>';
            data += '<div class="monitorList">';
            for (var i = 0; i < dataList.length; i++) {
                var chartData = dataList[i];

                data = data + '<div id="' + rid + '_' + chartData.id + '" class="monitorItem fL" style="width: 50%;" ></div>';
            }
            data += '<div class="clear"></div></div>';
//           content（）： 查找匹配元素内部所有的子节点（包括文本节点）。如果元素是一个iframe，则查找文档内容
            $(_id).data("kendoWindow").content(data);

//            $("#" + id + "_startdate").kendoDatePicker();
//            $("#" + id + "_enddate").kendoDatePicker();
        };
//        执行该function
        _fn_content();


//        var _fn_submit = function (result) {
//            if (result.ok) {
//                var fun_submit = config['submit'];
//                if (fun_submit == undefined) {
//                    new EzDialog("操作成功");
//                }
//                else {
//                    fun_submit(result);
//                }
//                $(_id).data("kendoWindow").close();
//            }
//            else {
//                new EzDialog(result.data.join("<br/>"));
//            }
//
//        };
//
//
//        var on_submit_submit = function(){
//            var time = {};
//            time.startDate = $("#" + id + "_startdate").val();
//            time.endDate = $("#" + id + "_enddate").val();
//
//            new EzAjax(action, "POST", time, _fn_submit);
//        };
//
//
//        $("#fm_" + id + "_submit").click(on_submit_submit);

        var _build_chart_list = function () {
            for (var i = 0; i < dataList.length; i++) {
                var chartData = dataList[i];
                if (type == "line") {
//                   创建线性图表
                     EzLineChart(rid + "_" + chartData.id, chartData.title, chartData.subTitle, chartData.css, chartData.xName, chartData.xList, chartData.yName, chartData.lines, config);
                } else if (type == "pie") {
                }
            }
        };
        _build_chart_list();


//        //刷新函数
//        var _fn_refresh = config['refresh'];
//        $(_id).data("kendoWindow").wrapper.find(".k-i-refresh").click(function () {
//            if (_fn_refresh != undefined) {
//                _fn_refresh();
//            }else{
//                eval('refresh_chart_' + id + "();");
//            }
//        });

    };


    this.center = function () {
        $(_id).data("kendoWindow").center();
    };

    this.show = function () {
        $(_id).data("kendoWindow").open();
    };

    this.hide = function () {
        $(_id).data("kendoWindow").close();
    };

    this.maximize = function () {
        $(_id).data("kendoWindow").maximize();
    };

    this._init();
}

/**
 *  创建线性图表
 * @param id  线性图表 id
 * @param title 线性图表 标题
 * @param subTitle
 * @param style css 样式
 * @param xName x轴名称
 * @param xList x轴数据
 * @param yTitle y轴名称
 * @param lines
 * @param config
 */
function EzLineChart(id, title, subTitle, style, xName, xList, yTitle, lines, config) {
    this._init = function () {
        var seriesArray = [];
        var xLable = [];
//    tooltip 图表工具提示： 鼠标放在一个数据点上的时候 提示出 x轴和y轴数据
        var tooltip_str = "'<b>'+ this.series.name +'</b><br/>' + this.x +': '+ this.y";
        if ("tooltip" in config) {
            if (config["tooltip"] != null) {
                tooltip_str = config["tooltip"];
            }
        }

        for (var key in lines) {
            var dataItem = {
                name:key,
                marker:{
                    symbol:'diamond'
                },
                data:lines[key]
            };
//            push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
            seriesArray.push(dataItem);
        }

        /**
         * 循环xList  将数据放入xLable中 （x轴 存放的是时间）
         */
//       for (var i in xList) {
//            var time = new Date(xList[i]);
//            //timeItem = timeItem.format('yy-MM-dd hh:mm:ss');
////toLocaleDateString() 方法可根据本地时间把 Date 对象的日期部分转换为字符串，并返回结果。
////           XXX
//            var timeStr = time.toLocaleTimeString()
//            xLable.push(timeStr);
//        }
//       将 年月日 拆分 并转成int类型
        var tickInterval_num = parseInt(xList.length / 3);

//        Highcharts图表控件是目前使用最为广泛的图表控件

        var chart = new Highcharts.Chart({
            chart:{
                renderTo:id,
                inverted:false,
                type:"spline",
                style:style
            },
            title:{
                text:title
            },
            subtitle:{
                text:subTitle
            },
            xAxis:{
                categories:xLable,
                //step:2,
                tickInterval:tickInterval_num,
                /*type:'datetime',
                 //			dateTimeLabelFormats:{
                 //				second: '%H:%M:%S',
                 //				minute: '%e. %b %H:%M',
                 //				hour: '%b/%e %H:%M',
                 //				day: '%e日/%b',
                 //				week: '%e. %b',
                 //				month: '%b %y',
                 //				year: '%Y'
                 //			},
                 dateTimeLabelFormats:{
                 hour:'HH:mm'
                 },*/
                tickPixelInterval:150
            },
            yAxis:{
                title:{
                    text:yTitle
                }
            },
            tooltip:{
                formatter:function () {
//                    return eval("'<b>'+ this.series.name +'</b><br/>' + this.x +': '+ this.y");
                    return eval(tooltip_str);
                }
            },
            plotOptions:{
                spline:{
                    lineWidth:4,
                    states:{
                        hover:{
                            lineWidth:5
                        }
                    },
                    marker:{
                        enabled:false
                    }
                }
            },
            legend:{
                align:'center'
            },
            resizeable:true,
            series:seriesArray
        });
        //chart.setSize(600,250);
    };

    this._init();
}

function EzLineChart2(id, title, subTitle, style, xName, xList, lines, config) {
    var chart=null;
    this._init = function () {
        var seriesArray = [];
        var xLable = [];

        var ds = new Date(xList[0]);
        start = ds.getDate() + " " + ds.getHours() + ":" + ds.getMinutes() + ":" + ds.getSeconds();
        var de = new Date(xList[xList.length - 1]);
        end = de.getDate() + " " + de.getHours() + ":" + de.getMinutes() + ":" + de.getSeconds();

        for (var key in lines) {
            var lineItem = lines[key];
            var lineData = [];
            for (var i = 0; i < xList.length; i++) {
                var time = xList[i];
                var value = lineItem[i];
                lineData.push([time, value]);
            }
            var dataItem = {
                name:key,
                data:lineData
            };
            seriesArray.push(dataItem);
        }

         chart = new Highcharts.Chart({
            chart:{
                renderTo:id,
                inverted:false,
                type:"spline",
                style:style
            },
            title:{
                text:title
            },
            subtitle:{
                text:subTitle
            },
            xAxis:config.xAxis,
            yAxis:config.yAxis,
            plotOptions:{
                spline:{
                    lineWidth:1.5,
                    fillOpacity:0.1,
                    marker:{
                        enabled:false,
                        states:{
                            hover:{
                                enabled:true,
                                radius:2
                            }
                        }
                    },
                    shadow:false
                }
            },
            legend:{
                align:'center'
            },
            resizeable:true,
            series:seriesArray
        });
        //chart.setSize(600,250);
    };

    this._init();
    return chart;
}

/**
 * 饼图
 */
function EzPieChart(id, title, subTitle, style, width, height, items, config) {
    var total = 0;
    var tooltip_str = "'{series.name}: <b>{point.y}/' + total + '</b>'";
    if ("tooltip" in config) {
        tooltip_str = config["tooltip"];
    }

    for (var i = 0; i < items.length; i++) {
        var data_item = items[i];
        total += data_item[1];
    }
    var chart = new Highcharts.Chart({
        chart:{
            renderTo:id,
            plotShadow:false,
            width:width,
            height:height,
            style:style
        },
        title:{
            text:title
        },
        subtitle:{
            text:subTitle
        },
        tooltip:{
            pointFormat:eval(tooltip_str),
            percentageDecimals:1
        },
        plotOptions:{
            pie:{
                allowPointSelect:true,
                cursor:'pointer',
                dataLabels:{
                    enabled:true,
                    formatter:function () {
                        return '<b>' + this.point.name + '</b>: ' + this.y
                    }
                }
            }
        },
        series:items
    });
}