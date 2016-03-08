package com.sigma.util;

import java.util.UUID;

/**
 * 生成唯一序号的辅助工具类
 *
 * @author：
 * @since：2012-1-31 下午12:05:33
 * @version:
 */
public class UIDGenerator {

    private static final int[] DEFAULT_CONFOUNDER = {3, 6, 7, 1, 8, 9, 5, 2};

    /**
     * 获取UUID
     *
     * @return
     */
    public static String getShortUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    /**
     * 获取UUID
     *
     * @return
     */
    public static String getUUID() {
        return UUID.randomUUID().toString();
    }


    /**
     * 把一个输入整数置换为另一个数
     *
     * @param num
     * @return
     */
    private static long confuse(long num, int[] confounder) {
        String tempStr = num + "";
        int length = confounder.length;
        int numLength = tempStr.length();

        //检查输入数值是否过大
        if (length < numLength) {
            throw new RuntimeException("confounder length must greater then number length, " + length + " : " + numLength);
        }

        String output = "";
        char[] input = tempStr.toCharArray();

        int confounderIndex = Integer.parseInt(input[input.length - 1] + "") % 8;
        int paddingLength = length - numLength;

        for (int i = 0; i < paddingLength; i++) {
            confounderIndex = (confounderIndex + 1) % 8;
            output = output + (confounder[confounderIndex] % 10);
        }

        for (int i = 0; i < numLength; i++) {
            confounderIndex = (confounderIndex + 1) % 8;
            output = output + ((Integer.parseInt(input[i] + "") + confounder[confounderIndex]) % 10);
        }
        try {
            return Long.parseLong(output);
        } catch (Exception e) {
            throw new RuntimeException("confuse number overflow : " + output);
        }
    }

    public static String generateSysUID(String sysFlag) {
        if (sysFlag == null || sysFlag.length() != 2) {
            throw new RuntimeException("sysFlag must be 2 length");
        }
        return sysFlag + getShortUUID();
    }


}
