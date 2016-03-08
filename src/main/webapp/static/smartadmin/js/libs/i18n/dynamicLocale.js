
var i18n = "zh_cn";

/**
 * 动态取得本地资源文件内容
 */

/**
 * 处理response中的message
 * message形式为：一固定字符串 + 变量
 * 所以需要将message分为两部分，分别获取本地资源文件里相应的内容
 */
function rpLRespond(messages){
       var message = messages.split(".")[0];
       var parameter = messages.split(".")[1];
       var messagePre = "";
       var parameterPre = "";
       if(convertStr(rpl[i18n][message]) != "") {
           messagePre = rpl[i18n][message];
       }
    //console.log(convertStr(rpl[i18n][parameter]));
       if(convertStr(rpl[i18n][parameter]) != "" && convertStr(rpl[i18n][parameter]) != undefined){
           parameterPre = " <" +rpl[i18n][parameter]+ ">";
       }
	return (messagePre + parameterPre);
}

/**
 * 描述：动态取得本地资源文件内容
 * 
 * 参数：
 *   key 对应的资源的key
 *   params 对应资源中的参数对象(Hash)
 *   
 * 返回：对应的资源内容
 * 
 * 用法：i18n("helloParam",{first:value1,second:value2});
 */
function rpL(key,params){
	var result = ""; 	// 对应的资源的内容
	var paramsObj = {};	// 参数对象
	if(params) paramsObj = params;
	
	if(convertStr(key) != "" && convertStr(rpl) != ""){
		// 根据key取得对应的资源内容，如果没有找到则返回key值
		if(convertStr(rpl[i18n][key]) != ""){
			result = rpl[i18n][key];
		}else{
			result = key;
		}
		
		// 替换对应参数为value的值
		var regExp = new RegExp(); //替换资源中参数的正则
		for(var k in paramsObj){
			regExp = eval("/{{:" + k + "}}/g");
			result = result.replace(regExp,paramsObj[k]);
		}
		
		// 如果没有找到对应的资源则返回 "No Value"
		if(/{{:[a-zA-Z]+}}/.test(result)){
			result = result.replace(/{{:[a-zA-Z]+}}/g, "No Value");
		}
	}
	return result;
}
