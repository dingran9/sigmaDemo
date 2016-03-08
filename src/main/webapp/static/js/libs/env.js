function dw() {
}
dw.ajax = function (s) {
    jQuery.ajax(s);
};

/* 加载js
 url：加载的js名称
 fun：加载成功后的默认执行函数名
 */
function ez_include_js(url, fun) {
    $.ajax({
        //发送请求的地址
        url:"/js/" + url + ".js",

        //"script": 返回纯文本 JavaScript 代码。不会自动缓存结果。除非设置了"cache"参数。ps：在远程请求时(不在同一个域下)，所有POST请求都将转为GET请求。(因为将使用DOM的script标签来加载)
        dataType:"script",

        //async (Boolean) : (默认: true) 默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。ps: 同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
        async:false,

        success:function () {
            if (fun != undefined) {
                //执行括号里的内容 返回结果
                eval(fun + "();");
            }
        },
        error:ez_ajax_error,
        cache:true
    });
}


/* ajax请求失败温馨提示 */
function ez_ajax_error(result) {
    if (false) {
        //调试状态开打开，给程序员看
        var s = "";
        for (var k in result) {
            s += "\n" + k + ": " + result[k];
        }
        alert(s);
    }
    else {
        //调试状态开关闭，给用户看
         EzDialog("HTTP请求失败！");
    }
}
/**
 * 从C层获取数据 并解析数据 加载js
 * @param data
 */
function ez_include_plugins(data) {
    //解析data 获取js地址
    for (var i = 0; i < data.length; i++) {
        var urlStr;
        var plugin = data[i];
        var urlList = plugin.split("_");
        if (urlList.length == 1) {
            urlStr = plugin;
        } else if (urlList.length == 2) {
            urlStr = urlList[0] + "/" + urlList[1];
        }
        //根据data解析后的数据   加载js
        ez_include_js("plugins/" + urlStr, "plugin_" + plugin + "_init");
    }
}

//XXX
/* 创建div
 parentDivId：父元素（放到哪里）
 childDivId：生成的元素id
 */
function ez_init_div(parentDivId, childDivId) {
    var parentDiv = $("div#" + parentDivId);
    //查找父元素下是否存在该子元素
    var childDiv = parentDiv.find("#" + childDivId);
    //如果不存在  则创建子元素div 并添加到父元素中去
    if (childDiv.length == 0) {
        childDiv = $("<div id='" + childDivId + "'></div>");
        parentDiv.append(childDiv);
    } else {
        //如果存在 则清空子元素内容
        childDiv.empty();
    }
}
function ez_grid_init_div(parentDivId, childDivId) {
    var parentDiv = $("div#" + parentDivId);
    //查找父元素下是否存在该子元素
    var childDiv = parentDiv.find("#" + childDivId);
    //如果不存在  则创建子元素div 并添加到父元素中去
    if (childDiv.length == 0) {
        childDiv = $("<div id='" + childDivId + "'></div>");
        parentDiv.append(childDiv);
    } else {
        //如果存在 则清空子元素内容
        childDiv.empty();
    }
}

/**
 * highcharts不使用国际时间
 */
/*
Highcharts.setOptions({
    global:{
        useUTC:false
    }
});
*/


/**
 *   点击右键菜单选项时的触发事件
 *   当length=4时 是带有id参数的促发事件
 *   @param key
 */
function gl_on_key(key) {
    var ss = key.split('_');
//    四个元素代表有云id
    switch (ss.length) {
        case 3:
            eval(gl_menu_opt_data[key]);
            break;

        case 4:
            //XXX 生命周期
            var id = ss[1];
            eval(gl_menu_opt_data[ss[0] + '_' + ss[2] + '_' + ss[3]]);
            break;
    }


    $(".context-menu-list").hide();

}