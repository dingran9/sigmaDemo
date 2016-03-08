/**
 * Copyright: biology
 * Author：Zhangly
 * Date: 2014/9/3.
 * Description:
 */
$(document).ready(function(){
    refreshLimitTime();
    validateRegister();
});

function refreshVerifyCode(){
    $('img#verifyCode').attr('src','/action/userAccount/verifyCode?' + Math.random());
}

function validateRegister() {
    $("#register-form").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                //pwdStrengthValidator: true,
                rangelength: [8, 20]
            },
            repeatPassword: {
                required: true,
                equalTo: "#password"
            },
            sex:{
              required:true
            },
            telNumber: {
                required: true,
                phoneNumValidator: true
            },
            SMSCode:{
                required:true,
                minlength:6,
                maxlength:6
            },
            verifyCode:{
                required: true
            }
        },
        messages: {
            email: {
                required: "请输入邮箱",
                email: "请按邮箱格式输入"
            },
            password: {
                required: "请输入密码",
                //pwdStrengthValidator: "密码应该只包含………………",
                rangelength: "密码长度应该在x位到y位之间"
            },
            repeatPassword: {
                required: "请确认密码",
                equalTo: "两次输入的密码不一致"
            },
            sex:{
                required:"请选择性别"
            },
            telNumber: {
                required: "请输入手机号码",
                phoneNumValidator: "请按手机号码格式输入"
            },
            SMSCode:{
                required:"请输入短信验证码",
                minlength:"短信验证码为六位",
                maxlength:"短信验证码为六位"
            },
            verifyCode:{
                required:"请输入验证码"
            }
        },

        highlight: function(element){
            $(element).closest('.input-group-register').removeClass('has-success').addClass('has-error');
            btnConfirmState();
        },

        unhighlight: function(element){
                $(element).closest('.input-group-register').removeClass('has-error').addClass('has-success');
                btnConfirmState();
        },

        errorPlacement: function (error, element) {
            error.addClass("col-lg-3").css('text-align','left').css('color','#FC4343').css('line-height','34px');
            error.appendTo(element.parent());
        }

    });
}
function btnConfirmState(){
    var validateSize = 6;
    var size=0;
    $('#register-form .input-group-register').each(function () {
        if($(this).hasClass("has-success")){
            size+=1;
        }
    });
    if(validateSize==size){
        $("#registerBtn").addClass('btn-primary').removeClass("disabled").removeClass('txt-color-darken');
    }else{
        $("#registerBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    }
}

function getPhoneVerifyNum() {
    doPost("/action/userAccount/validatePhone",{mobilePhone:13312345678},function(objs){
        if(objs.ok == true){
            window.sessionStorage.setItem('limitTime',60);
            refreshLimitTime();
        } else{
            alert("获取手机验证码失败:"+ objs.data[0]);
        }
    });
}

function refreshLimitTime(){
    var limitTime = window.sessionStorage.getItem('limitTime');
    console.log(limitTime);
    if (limitTime == '0') {
        $("button#getPhoneNum").html("获取验证码").css("font-size",'0.5em').removeAttr("disabled");
    } else {
        $("button#getPhoneNum").html(limitTime+"秒后可重新获取").css("font-size",'0.5em').prop("disabled",true);
        limitTime--;
        console.log("123123123123123");
        window.sessionStorage.setItem('limitTime', limitTime);
        setTimeout(function() {
                refreshLimitTime()
            },
            1000)
    }
}
function register(){
    var email = $.trim($("input[name='email']").val());
    var password = hex_md5($.trim($("input[name='password']").val()));
    var telNumber = $.trim($("input[name='telNumber']").val());
    var validatePhone = $.trim($("input[name='SMSCode']").val());
    var verifyCode = $.trim($("input[name='verifyCode']").val());
    var sex = $("input[name='sex']:checked").val();

    /*if (sex == undefined || sex == ""){
            $("input.sex").parent().parent().append('<em for="sex" class="invalid col-lg-3" style="text-align: left; color: rgb(252, 67, 67); display: block;">请选择性别</em>');
            return;
    }*/
    var data = {email: email,password:password ,rePassword: password ,mobilePhone: telNumber,validatePhone: validatePhone ,sex: sex ,verifyCode: verifyCode };
    $("#registerBtn").removeClass('btn-primary').addClass("disabled").addClass('txt-color-darken');
    doPost("/action/userAccount/register",data,function(objs){
        if(objs){

        }else{

        }
    });

}