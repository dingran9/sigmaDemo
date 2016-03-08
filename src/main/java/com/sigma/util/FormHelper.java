package com.sigma.util;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2014/9/2
 * Description:
 */
@Component("formHelper")
public class FormHelper {

    public ResponseItem check(BindingResult result) {
        ResponseItem ri = new ResponseItem();
        for (FieldError e : result.getFieldErrors()) {
//            ri.setOk(false);
            return ResponseItem.responseWithName(ri, ResponseCode.PARAMETER_INVALID.toString(),e.getDefaultMessage());
//            ri.getData().add(e.getDefaultMessage());
        }
//        ri.setOk(ri.getData().isEmpty());
        return ri;

    }
    /**
     * @param request request请求
     * @param captcha 用户输入的验证码文本
     * @return 成功？
     */
    public boolean check(HttpServletRequest request, String captcha) {
//        logger.debug("验证码{} {}", request.getSession().getAttribute(Constants.KAPTCHA_SESSION_KEY), request.getParameter(captcha) );
 //       return StringUtils.equals((String) request.getSession().getAttribute(Constants.KAPTCHA_SESSION_KEY), request.getParameter(captcha));
        return false;
    }


    public ResponseItem check(BindingResult result, HttpServletRequest request, String captcha) {
        ResponseItem ri = check(result);

        if (!check(request, captcha)) {
//            ri.getData().add("验证码输入有误！");
//            ri.setOk(false);
            return ResponseItem.responseWithName(ri, ResponseCode.PARAMETER_INVALID.toString(),"captcha");

        }

        return ri;
    }


    public boolean check(Map<String, Object> map, BindingResult result) {

        if (result.hasErrors()) {
            String msg = "";
            for (FieldError e : result.getFieldErrors()) {
                msg += "<br>" + e.getDefaultMessage();
            }
            map.put("reason", msg);
            return false;
        }
        return true;
    }

    private final static Logger logger = LoggerFactory.getLogger(FormHelper.class);
}
