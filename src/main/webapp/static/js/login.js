/**
 * Copyright: biology
 * Author：Zhangly
 * Date: 2014/9/4.
 * Description:
 */


function validateLogin() {
    $("#login-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            user: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages: {
            email: {
                required: "请输入账户名"
            },
            password: {
                required: "请输入密码"
            }
        },

        highlight: function(element){
            $(element).closest('.input-group').removeClass('has-success').addClass('has-error');
        },

        unhighlight: function(element){
            $(element).closest('.input-group').removeClass('has-error').addClass('has-success');
        },

        errorPlacement: function (error, element) {
            //error.appendTo(element.parent());
        }

    });
}


window.sessionStorage.setItem('limitTime',0);
function login(){
    console.log("sdfsdfas");
    var user = $.trim($("#login-form input[name='user']").val());
    var password = $.trim($("#login-form input[name='password']").val());
    if(convertStr(user)==""){
        $(".note-error").html("请输入用户名").show();
        return;
    }
    if(convertStr(password)==""){
        $(".note-error").html("请输入密码").show();
        return;
    }
    doPostLogin('/action/idcManager/login',{user:user,password:hex_md5(password)},function(objs){

        if(objs.httpCode == "200"){
            $(".note-error").html("").hide();
            if(objs.data.isInitialise != true){
                if(objs.data.idcManagerIsStaff == true ){
                    window.location.replace("/action/idcManager/index#../../action/biology/config/create.html");
                    return;
                }
                showMsgs('不可用',"系统初始化未完成，请联系网站管理员",function(){});
                return;
            }
            window.location.replace("/action/idcManager/index");
        }else{
            $(".note-error").html(rpL(objs.message)).show();
        }
    });
}

$("#login-form input").keyup(function (e) {
    if (e.keyCode == 13) {
        login();
    }
});
