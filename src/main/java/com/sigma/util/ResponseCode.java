package com.sigma.util;

/**
 * 返回状态码
 * Created by Zhangys on 2014/7/17.
 */
public enum ResponseCode {


    /* (code,message,httpCode)
    *
    * pay attention to :
    * the message must  end with '.'
    * */


    SUCCESS("Success", "200", "Success"),

    //service error , 500 begin
    SERVICE_ERROR("Service.Error", "500", "The request service process error."),
    //server end

    //client error, 400 begin
    UNKNOWN_OPERATION("Operation.UnKnown","400","The request operation is unsupported."),
    PARAMETER_MISS("Parameter.Miss", "400","The request parameter is miss."),
    PARAMETER_INVALID("Parameter.Invalid", "400", "The request parameter is invalid." ),
    STATE_INCORRECT("State.Incorrect", "400", "The request resource in an incorrect state for the request."),
    RESOURCE_NOTFOUND("Resource.NotFound", "400", "The request resource is not exist."),
    RESOURCE_INUSE("Resource.InUse", "400", "The request resource is in use."),
    RESOURCE_DUPLICATE("Resource.Duplicate", "400", "The request resource is duplicate."),
    RESOURCE_LIMITEXCEEDED("Resource.LimitExceeded", "400", "The request resource is limitExceeded."),
    RESOURCE_RELATIONVIOLATE("Resource.RelationViolate", "400", "The request resource has relation resources,please remove the relations first."),

    FORBIDDEN_AUTHFAILURE("Forbidden.AuthFailure", "403", "The request credentials is unauthorized，please check your credentials."),
    FORBIDDEN_NOPERMISSION("Forbidden.NoPermission", "403", "The request resource has no permissions."),
    FORBIDDEN_NOPERMISSION_IPADDRESS("Forbidden.NoPermissionIPAddress", "403", "The request ip address has no permissions."),
    FORBIDDEN_SIGNATURE_DOESNOT_MATCH("Forbidden.SignatureDoesNotMatch", "403", "The request signature does not match,please refer to the api reference."),
    FORBIDDEN_LOCKED("Forbidden.Locked", "403", "The request account is locked.");


    //client end


    public final String code;
    public final String httpCode;
    public final String message;
    ResponseCode(String code, String httpCode, String message) {
        this.code = code;
        this.httpCode = httpCode;
        this.message = message;
    }

    @Override
    public String toString() {
        return  code;
    }

    public static ResponseCode toEnum(String name) {
        for (ResponseCode res : ResponseCode.values()) {
            if (res.toString().equalsIgnoreCase(name)) {
                return res;
            }
        }
        return null;
    }
}
