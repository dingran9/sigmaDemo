package com.sigma.from;

import javax.validation.constraints.NotNull;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2014/9/27
 * Description:
 */
public class ValidateForm {
    @NotNull(message = "验证码不能为空")
    private String verifyCode;
    @NotNull(message = "手机号不能为空")
    private String phone;

    public String getVerifyCode() {
        return verifyCode;
    }

    public void setVerifyCode(String verifyCode) {
        this.verifyCode = verifyCode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
