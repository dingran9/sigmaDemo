package com.sigma.util;


import org.springframework.data.domain.Page;

import java.io.Serializable;
import java.util.Collection;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2014/9/2
 * Description:
 */
public class ResponseItem implements Serializable {
    private static final long serialVersionUID = -31085742939234526L;

    private String code;
    private String message;
    private String httpCode;

    private Long iTotalRecords;
    private Long iTotalDisplayRecords;

    private Object data;
    private Collection datas;

    public ResponseItem(){
        ResponseCode responseCode = ResponseCode.toEnum(ResponseCode.SUCCESS.toString());
        this.code = responseCode.toString();
        this.message = responseCode.message;
        this.httpCode = responseCode.httpCode;
    }


    public Collection getDatas() {
        return datas;
    }

    public void setDatas(Collection datas) {
        this.datas = datas;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getHttpCode() {
        return httpCode;
    }

    public void setHttpCode(String httpCode) {
        this.httpCode = httpCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


    public Long getiTotalRecords() {
        return iTotalRecords;
    }

    public void setiTotalRecords(Long iTotalRecords) {
        this.iTotalRecords = iTotalRecords;
    }

    public Long getiTotalDisplayRecords() {
        return iTotalDisplayRecords;
    }

    public void setiTotalDisplayRecords(Long iTotalDisplayRecords) {
        this.iTotalDisplayRecords = iTotalDisplayRecords;
    }

    /**
     * 设置分页信息
     * @param page
     */
    public void setPage(Page page){
        this.iTotalRecords = page.getTotalElements();
        this.datas = page.getContent();
        this.iTotalDisplayRecords = page.getTotalElements();
    }
    /**
     * 根据错误代码设置异常 并自定义消息
     * @param code
     * @param message
     * @return
     */
    public static <T> T setResponse(ResponseItem response,String code,String message){
        ResponseCode error = ResponseCode.toEnum(code);
        response.setCode(error.code);
        response.setHttpCode(error.httpCode);
        response.setMessage(error.message + message);
        return (T)response;
    }
    public  static <T> T  responseWithName(ResponseItem response,String code, Object msg){
        ResponseCode error = ResponseCode.toEnum(code);
        response.setCode(error.code);
        response.setHttpCode(error.httpCode);
        response.setMessage(msg.toString());
        return (T)response;
    }
    public  static <T> T  responseWithName(ResponseItem response,String code){
        ResponseCode error = ResponseCode.toEnum(code);
        response.setCode(error.code);
        response.setHttpCode(error.httpCode);
        response.setMessage(error.message);
        return (T)response;
    }

}
