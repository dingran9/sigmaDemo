package com.sigma.util;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;

import com.sigma.po.AttachPo;

public class UploadUtil {
	private static Logger logger=Logger.getLogger(UploadUtil.class);
	/**
	 * 上传附件，并生成附件实体类
	 * @param uploadFile
	 * @return
	 */
	public static AttachPo uploadFile(MultipartFile uploadFile){
		//附件名称
		String attachName=uploadFile.getOriginalFilename();
		//文件后缀
		String extension=getFileExt(attachName);
		//文件存储路径：创建文件目录
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy/MM/dd");
		//根据配置文件读取上传文件保存路径
		String defaultDir=ConfigUtil.getString("uploadDir");
		File dirFile=new File(defaultDir+sdf.format(new Date()));
		if (!dirFile.exists()) {
			dirFile.mkdirs();
		}
		//生成文件名
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmssSSS");
		String mDateTime = formatter.format(cal.getTime());
		//文件路径+文件名
		String finalFilePathString=defaultDir+sdf.format(new Date())+"/"+mDateTime+"."+extension;
		//上传文件
//		try {
//			FileUtils.copyFile(uploadFile.transferTo(dest);, new File(finalFilePathString));
//		} catch (IOException e) {
//			logger.error("文件上传出错");
//			e.printStackTrace();
//		}
		try {
			uploadFile.transferTo(new File(finalFilePathString));
		} catch (IllegalStateException | IOException e) {
			e.printStackTrace();
		}
		AttachPo currAttachPo=new AttachPo();
		currAttachPo.setAttachName(attachName);
		currAttachPo.setAttachPath(sdf.format(new Date())+mDateTime+"."+extension);
		currAttachPo.setIssueDate(new Date());
		currAttachPo.setExtension(extension);
		currAttachPo.setUuid(UIDGenerator.getUUID());
		currAttachPo.setServerId("1");
		return currAttachPo;
	}
	/**
	 * 根据文件名称获取文件后缀
	 * @param fileName
	 * @return
	 */
	public static String getFileExt(String fileName) {
		int iIndex = fileName.lastIndexOf(".");
		if (iIndex < 0)
			return "";
		return fileName.substring(iIndex + 1).toLowerCase();
	}
	public static void main(String[] args) {
		System.out.println(ConfigUtil.getString("uploadDir"));
	}
}
