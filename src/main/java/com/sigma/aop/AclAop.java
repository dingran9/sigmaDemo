package com.sigma.aop;


import com.sigma.util.NoPermissionException;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2014/10/10
 * Description:  this is test
 */
@Aspect
public class AclAop {
    private final Logger logger = LoggerFactory.getLogger(AclAop.class);


    @Before("execution(* com.sigma.*.controller.*.*(..))")
    public void beforeIntercept() {//test(), Object[] args, Object cObj
        logger.debug("before interceptor ControllerAopTest");
    }

    @Around("execution(* com.sigma.*.controller.*.*(..))")
    public Object doAround(ProceedingJoinPoint pjp) throws NoPermissionException {
        logger.debug("------------------->begin");
        String[] notFilter = new String[]{"/idcManager/login", "/idcManager/logout", "/idcManager/handleLogout", "/idcManager/index","/instance","/volume","/snapshot","/image","/monitor"};
        HttpServletRequest request = null;
        Object obj = null;
        Object[] args = pjp.getArgs();
        for (Object arg : args) {
            logger.debug("------------------->args" + arg);
            if (arg instanceof HttpServletRequest) request = (HttpServletRequest) arg;
        }
        if (request == null) {
            logger.debug("------------------->no request");
            throw new NoPermissionException("noRequest");
        }
        // 请求的uri
        String uri = request.getRequestURI();
        logger.debug("---------------uri="+uri);
        // uri中包含background时才进行过滤
        for (String s : notFilter) {
            if (uri.contains(s)) {
                try {
                    obj = pjp.proceed();
                } catch (Throwable throwable) {
                    throwable.printStackTrace();
                    throw new NoPermissionException("noRequest");
                }
                return obj;
            }
        }

        logger.debug("------------------->noPermissionException");
        throw new NoPermissionException("noPermissionException");
    }
}
