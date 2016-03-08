package com.sigma.util;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: wangbin
 * Date: 2014/10/13
 * Description: 帮助类
 */
public class StringHelper {

    //截取字符串符号
    public final static String SPLIT_PARAM_ONE = "_";
    public final static String SPLIT_PARAM_TOW = "\\|";
    public final static String SPLIT_PARAM_TOW_ = "|";
    public final static String SPLIT_PARAM_THREE = ",";
    public final static String SPLIT_PARAM_FOUR = "-";
    public final static String SPLIT_PARAM_FIVE = "&";
    public final static String SPLIT_PARAM_SIX = "=";

    private static String splitParamOne;
    private static String splitParamTow;

    public StringHelper() {
        splitParamOne = SPLIT_PARAM_ONE;
        splitParamTow = SPLIT_PARAM_TOW;
    }

    /**
     * 构造
     * @param one
     * @param tow
     */
    public StringHelper(String one,String tow){
        splitParamOne = one;
        splitParamTow = tow;
    }


    /**
     * test
     * @param args
     */
    public static void main(String [] args){
//        String str = getClassPath(StringHelper.class);
//        System.out.println(str.substring(0,str.indexOf("/")));
//
//        System.out.println(getDirByOs());

        //        System.out.println(setOrderExtParamValue("resUser_|billCycle_2|imageid_149|imagetype_0|isBalance_false|payType_alipay|","type","222"));
//        System.out.println(setOrderExtParamValue("resUser_sdfdsf|billCycle_1|imageid_149|tYPE_0|isBalance_false|payType_alipay|","wangb","1231"));
//        System.out.println(getOrderExtParamValue("resUser_jhk|billCycle_2|isBalance_false|couponId_|type_order|","type"));

        String strUrl = "e=278047762@qq.com&c=dsadsad1sa155545&t=" + Long.toString(DateUtils.nowTimeMillis());

        String extParam = "";
        StringHelper stringHelper = new StringHelper(SPLIT_PARAM_SIX,SPLIT_PARAM_FIVE);
        extParam = stringHelper.setExtParamValue(extParam,"e","278047762@qq.com");
        System.out.println("extParam 1:"+extParam);
        extParam = stringHelper.setExtParamValue(extParam,"c","dsadsad1sa155545");
        System.out.println("extParam 2:"+extParam);
        extParam = stringHelper.setExtParamValue(extParam,"t",DateUtils.nowTimeMillis());
        int len = extParam.length();
        System.out.println("extParam 3:"+extParam.substring(0,len-1));
    }

    /**
     * 根据名称获取订单临时字段参数
     * @param extParam
     * @param name
     * @return
     */
    public static String getOrderExtParamValue(String extParam,String name){
        StringHelper stringHelper = new StringHelper();
        return stringHelper.getExtParamValue(extParam, name);
    }

    /**
     * 设置订单临时参数
     * @param extParam
     * @param name
     * @param value
     * @return
     */
    public static String setOrderExtParamValue(String extParam,Object name,Object value){
        StringHelper stringHelper = new StringHelper();
        return stringHelper.setExtParamValue(extParam, name, value);
    }

    /**
     * 获取自定义字符串中的参数值
     * @param extParam
     * @param name
     * @return
     */
    public String getExtParamValue(String extParam,String name){
        String value = "";
        if(StringUtils.isBlank(extParam)){
            return value;
        }
        String[] paramArrs = extParam.split(splitParamTow);
        if(paramArrs.length > 0){
            for (String param :paramArrs){
                if(param.split(splitParamOne).length > 1){
                    String key = param.split(splitParamOne)[0];
                    String value_ = param.split(splitParamOne)[1];
                    if(name.equals(key)){
                        return value_;
                    }
                }
            }
        }

        return value;
    }

    /**
     * 设置自定义字符串中的参数
     * @param extParam
     * @param name
     * @param value
     * @return
     */
    public String setExtParamValue(String extParam,Object name,Object value){
        String result = "";

        if(StringUtils.isBlank(name.toString()) && StringUtils.isBlank(value.toString())){
            return extParam;
        }
        //如字符为\\| 拼接时需要转换
        String tow = splitParamTow;
        if(splitParamTow.equals(SPLIT_PARAM_TOW)){
            tow = SPLIT_PARAM_TOW_;
        }

        if(StringUtils.isBlank(extParam)){
            return (tow + name + splitParamOne + value + tow);
        }
        if(!extParam.contains(tow + name + splitParamOne)){
            return extParam + name + splitParamOne + value + tow;
        }
        String[] paramArrs = extParam.split(splitParamTow);

        if(paramArrs.length > 0){
            for (String param :paramArrs){
                String key = param.split(splitParamOne)[0];
                if(param.split(splitParamOne).length > 1) {
                    String value_ = param.split(splitParamOne)[1];
                    if (name.equals(key)) {
                        result += key + splitParamOne + value + tow;
                    } else {
                        result += key + splitParamOne + value_ + tow;
                    }
                }else{
                    if (name.equals(key)) {
                        result += key + splitParamOne + value + tow;
                    }
                }
            }
        }
        return result;
    }


    /**
     * 解决下载文件中文名乱码
     * @param filename
     * @param request
     * @return
     * @throws Exception
     */
    public static String downFilename(String filename,HttpServletRequest request) throws Exception {
        String agent = request.getHeader("USER-AGENT");
        //获取浏览器类型 :Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16 (.NET CLR 3.5.30729)
        String downLoadName = "";
        if (null != agent && -1 != agent.indexOf("MSIE")){   //IE
            downLoadName = URLEncoder.encode(filename, "UTF-8");
        }else if (null != agent && -1 != agent.indexOf("Mozilla")){ //Firefox
            downLoadName = new String(filename.getBytes("UTF-8"),"iso-8859-1");
        }else{
            downLoadName = URLEncoder.encode(filename, "UTF-8");
        }
        return downLoadName;
    }
    /**
     * 根据操作系统获取文件存放目录
     * @return
     */
    public static String getDirByOs() {
        String os = System.getProperty("os.name");
        String sysPath = File.separatorChar + "etc" + File.separatorChar + "ezcloud" + File.separatorChar;

        if (StringUtils.isNotEmpty(os) && os.startsWith("Windows")) {
            String path = getClassPath(StringHelper.class);
            path = path.substring(0,path.indexOf("/"));
            return path + sysPath;
        }else {
            return sysPath;
        }
    }

    /**
     * 得到指定类的路径，例如E:/workspace/JavaGUI/bin/com/util
     * @param classs
     * @return
     */
    public static String getClassPath(Class classs){
        String strClassName = classs.getName();
        String strPackageName = "";
        if (classs.getPackage() != null) {
            strPackageName = classs.getPackage().getName();
        }
        String strClassFileName = "";
        if (!"".equals(strPackageName)) {
            strClassFileName = strClassName.substring(strPackageName.length() + 1,
                    strClassName.length());
        } else {
            strClassFileName = strClassName;
        }
        URL url = null;
        url = classs.getResource(strClassFileName + ".class");
        String strURL = url.toString();
        strURL = strURL.substring(strURL.indexOf('/') + 1, strURL
                .lastIndexOf('/'));
        //返回当前类的路径，并且处理路径中的空格，因为在路径中出现的空格如果不处理的话，
        //在访问时就会从空格处断开，那么也就取不到完整的信息了，这个问题在web开发中尤其要注意
        return strURL.replaceAll("%20", " ");
    }

    /**
     * 转换lang数组
     * @param str
     * @param splitParam
     * @return
     */
    public static Long [] toLongs(String str, String splitParam){
        Long [] result = {};
        if(StringUtils.isBlank(splitParam)) {
            return result;
        }
        String[] args = str.split(splitParam);
        List<Long> list = new ArrayList<>();
        if(args.length > 0){
            for(int i = 0;i< args.length;i++){
                if(StringUtils.isBlank(args[i].trim())){
                    continue;
                }
                list.add(Long.parseLong(args[i]));
            }
            result = new Long[list.size()];

            for(int i = 0;i<list.size();i++){
                result[i] = list.get(i);
            }
        }
        return result;
    }

    /**
     * 判断字符串中是否有中文
     * 有中文返回true
     * @param str
     * @return
     */
    public static boolean isChineseChar(String str){
        boolean temp = false;
        Pattern p=Pattern.compile("[\u4e00-\u9fa5]");
        Matcher m=p.matcher(str);
        if(m.find()){
            temp =  true;
        }
        return temp;
    }

    /**
     * 向页面写内容
     * @param response
     * @param result
     * @throws Exception
     */
    public static void printf(HttpServletResponse response, String result)
            throws Exception {
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");
        response.getWriter().write(result);
        response.getWriter().flush();
        response.getWriter().close();
    }

    /**
     * 生成代金卷密码
     * @return
     */
    public static String generateCouponPWD(){
        String str = UUID.randomUUID().toString().toUpperCase().replace("-","").substring(0,16);
        char [] chars = str.toCharArray();
        String result = "";
        for (int i = 0;i<chars.length;i++){
            if(i % 4 == 0 && i != 0){
                result += "-";
            }
            result += chars[i];
        }
        return result;
    }

    /**
     * 生成订单号
     *
     * @return
     */
    public static String generateCode(int len) {
        if(len <= 0) {
            len = 4;
        }
        char[] chars = "0123456789".toCharArray();//ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789
        int maxPos = chars.length;
        String str = "";
        for (int i = 0; i < len; i++) {
            Random random = new Random();
            str += chars[random.nextInt(maxPos)];
        }
        return DateUtils.getYmdHmsTime() + str;
    }
    /**
     * 是否为null，是否是""
     * @param string
     * @return
     */
    public static boolean isEmpty(String string) {
		return string == null || string.length() == 0;
	}
}
