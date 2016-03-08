/**
 * Created by ZHANGLY on 2014/7/22.
 */

/**
 * name format validator
 * 名称格式验证
 */
jQuery.validator.addMethod("nameValidator",function(value){
    var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/;
    return reg.test(value);
},$.validator.format("名称只由1~20位汉字、字母、数字和下划线且不能以下划线开头和结尾"));

/**
 * password strength validator
 * 密码强度验证
 */
jQuery.validator.addMethod("pwdStrengthValidator",function(value,element,param){
    var pwdArr = new Array("\\/",":","\\*",'\"',"<",">","^","(",")","￥","%","&","|","?","+","!","\\","#");
    for (var pwds in pwdArr){
        if(pwdArr[pwds]==value){
            return false;
        }
    }
    var reg = /^(?=^.{8,64}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-zA-Z]))(?=(1)(?=.*\d)|.*[^A-Za-z0-9])^.*$/;
    return reg.test(value);
},$.validator.format("密码必须为8-20位数字、字母以及@!%+_，如Abcabc123!@是一个合法的密码"));

/**
 * password strength validator
 * 密码强度验证
 * 能够验证密码强度级别
 */
jQuery.validator.addMethod("pwdStrengthValidator1",function(value,element,param){
    if(value.length >=6) {
        if(/[a-zA-Z]+/.test(value) && /[0-9]+/.test(value) && /\W+\D+/.test(value)) {
            return(1);
        }else if(/[a-zA-Z]+/.test(value) || /[0-9]+/.test(value) || /\W+\D+/.test(value)) {
            if(/[a-zA-Z]+/.test(value) && /[0-9]+/.test(value)) {
                return(-1);
            }else if(/\[a-zA-Z]+/.test(value) && /\W+\D+/.test(value)) {
                return(-1);
            }else if(/[0-9]+/.test(value) && /\W+\D+/.test(value)) {
                return(-1);
            }else{
                return(0);
            }
        }
    }else{
        return(null);
    }
},$.validator.format("密码必须为8-20位数字、字母以及@!%+_，如Abcabc123!@是一个合法的密码"));

/**
 * password strength validator
 * 密码强度验证（允许大小写字母和数字）
 */
jQuery.validator.addMethod("pwdValidator",function(value,element,param){
    var pwdArr = new Array("\\/",":","\\*",'\"',"<",">","^","(",")","￥","%","&","|","?","+","!","\\","#");
    for (var pwds in pwdArr){
        if(pwdArr[pwds]==value){
            return false;
        }
    }

    //var reg = /^[0-9A-Za-z]{8,20}$/;
    var reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-Z0-9]{2,}$/;
    return reg.test(value);
},$.validator.format("密码必须由8-20位数字及大小写字母构成"));


/**
 * phone number validator
 * 手机号码格式验证
 */
jQuery.validator.addMethod("phoneNumValidator", function(value, element,param) {
    var isMob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|17[0678][0-9]{8}|18[0123456789][0-9]{8}|14[57][0-9]{8}|1349[0-9]{7})$/;

    if(isMob.test(value)){
        return true;
    }
}, "请输入正确格式手机号码");

/**
 * Telephone number validator
 * 电话号码验证
 */
jQuery.validator.addMethod("telNumValidator", function(value, element,param) {
    if(convertStr(value)!=""){
        var reg = /^(\d{3,4}-?)?\d{7,9}$/g;
        return reg.test(value);
    }else{
        return true;
    }
}, "请输入正确格式电话号码");

/**
 * Fax number validator
 * 传真号码验证
 */
jQuery.validator.addMethod("faxNumValidator", function(value, element,param) {
    if(convertStr(value)!=""){
        var reg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
        return reg.test(value);
    }else{
        return true;
    }
}, "请输入正确传真号码");

/**
 * IP 地址格式验证
 */
jQuery.validator.addMethod("IPValidator",function(value,element,param){
    var ipV=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return ipV.test(value);
},$.validator.format("请输入有效的IP地址"));

/**
 * 非 0 验证
 */
jQuery.validator.addMethod("notZero",function(value,element,param){
    if(value == 0 || value == "0"){
        return false;
    }else{
        return true;
    }
},$.validator.format("值不能为零"));

/**
 *  判断是否包含小数
 */
jQuery.validator.addMethod("notDecimal",function(value,element,param){

    if (!isNaN(value)) {
        return (value.indexOf('.') < 0)?true:false;
    }
},$.validator.format("不能是小数"));

/**
 * 邮编验证
 * */
jQuery.validator.addMethod("zipCheck", function(value, element, param){
    var zip = /^[0-9]{6}$/;
    return zip.test(value);
}, $.validator.format("邮编格式不正确"));