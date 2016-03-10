package com.sigma.comm;

/**
 * Copyright：CNIaas Technology (Beijing) CO.,LTD
 * Author: DingRan
 * Date: 2014/9/5
 * Description:
 */
public final class Constants {
    private Constants() {
    }
    /**
     * 附件类型:文献附件 0
     */
    public static int ATTACH_TYPE_DOCUMENT=0;
    public final static String SESSION_ID = "d5uf9pl0c68";
    public static final String RANDOM_CODE = "RANDOMVALIDATECODEKEY";
    
    /**
     * 节点类型
     */
    //干预物
    public static String NODE_TYPE_INTERVENTION="intervention";
    //微生物
    public static String NODE_TYPE_MICROORGANISM="microorganism";
    //生理过程
    public static String NODE_TYPE_PHYSIOLOGICALPROCESS="physiological_process";
    //疾病
    public static String NODE_TYPE_DISEASE="disease";
     //疾病
    public static String NODE_TYPE_PHYSIOLOGICALPROCESS_CHANGE="physiological_process_change";
}
