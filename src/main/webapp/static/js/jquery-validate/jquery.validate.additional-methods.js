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
 * phone number validator
 * 手机号码格式验证
 */
jQuery.validator.addMethod("phoneNumValidator", function(value, element,param) {

        //var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
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