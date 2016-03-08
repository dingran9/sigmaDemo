package com.sigma.util;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2014/10/10
 * Description:
 */
public class NoPermissionException extends Exception {
    private final String classN;

    public NoPermissionException(String message) {
        super(message);
        this.classN = NoPermissionException.class.getName();
    }


    public NoPermissionException(String message, Throwable e) {
        super(message, e);
        this.classN = e.getClass().getName();
    }

    public NoPermissionException(Throwable e) {
        super(e.getMessage());
        this.classN = e.getClass().getName();
    }

    public String getClassN() {
        return classN;
    }


}
