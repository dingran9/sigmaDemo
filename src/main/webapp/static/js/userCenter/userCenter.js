/**
 * Copyright: biology
 * Author：Zhangly
 * Date: 2014/9/4.
 * Description:
 */

function modifyPwd(){
    var oldPassword = $.trim($('input[name="oldPassword"]').val());
    //var oldPassword = hex_md5($.trim($('input[name="oldPassword"]').val()));
    var newPassword = $.trim($('input[name="newPassword"]').val());
    //var newPassword = hex_md5($.trim($('input[name="newPassword"]').val()));

    var data = {oldPassword: oldPassword ,password: newPassword };
    doPost("/action/userAccount/editPwd",data,function(objs){
        if(objs.ok == true){
            $('input[name="oldPassword"]').val("");
            $('input[name="newPassword"]').val("");
            alert("密码修改成功！");
        }else{
            alert('密码修改失败！');
        }
    });
}
