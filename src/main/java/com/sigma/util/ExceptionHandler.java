package com.sigma.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.HttpSessionRequiredException;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.UndeclaredThrowableException;
import java.util.*;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2014/9/5
 * Description:
 */
public class ExceptionHandler implements HandlerExceptionResolver {
    private final Logger logger = LoggerFactory.getLogger(ExceptionHandler.class);
    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object o, Exception e) {
        Map<String, Object> map = new HashMap<String, Object>();
        List<String> messages = new ArrayList<String>();
        map.put("ok", false);
        if (e instanceof HttpSessionRequiredException) {
            logger.error("----e instanceof HttpSessionRequiredException : not login");
            PrintWriter pw = null;
            try {
                pw = response.getWriter();
            } catch (IOException e1) {
                e1.printStackTrace();
            }
            pw.write("<script type=\"text/javascript\">window.location.href = \"/login.jsp\";</script>");
            pw.flush();
            messages.add("您还没有登录或者离开页面的时间过长，请登录系统或刷新页面！");
            map.put("httpCode","403");
            map.put("code","Forbidden");
            map.put("isLogin", false);
            return new ModelAndView("login", map);
        }else if (e instanceof UndeclaredThrowableException || e instanceof NoPermissionException) {//TODO 添加自定义异常
            logger.error("----e instanceof NoPermissionException : no permission");
            map.put("isLogin", true);
            map.put("httpCode",ResponseCode.FORBIDDEN_NOPERMISSION.httpCode);
            map.put("code",ResponseCode.FORBIDDEN_NOPERMISSION.code);
            map.put("message",ResponseCode.FORBIDDEN_NOPERMISSION.message);
            return new ModelAndView("jsonView", map);
        }else {
            logger.error(e.getMessage(),e);
            map.put("httpCode", ResponseCode.SERVICE_ERROR.httpCode);
            map.put("code", ResponseCode.SERVICE_ERROR.code);
            map.put("message",ResponseCode.SERVICE_ERROR.message);
            messages.add(e.getMessage());
            map.put("isLogin",true);

        }
        //TODO  添加错误界面
        map.put("created", new Date());
        map.put("data", messages);
        return new ModelAndView("error500", map);
//        return new ModelAndView("jsonView", map);
    }
}
