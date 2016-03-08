package com.sigma.controller.document;

import java.io.File;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.sigma.po.AttachPo;
import com.sigma.po.DictItemPo;
import com.sigma.po.DictPo;
import com.sigma.service.AttachService;
import com.sigma.util.ResponseCode;
import com.sigma.util.ResponseItem;
import com.sigma.util.UploadUtil;
@Controller
@RequestMapping(value="/uploadDocumentAttach")
public class UploadDocumentAttachController {
	private static Logger logger=Logger.getLogger(UploadDocumentAttachController.class);
	
	@Inject
	private AttachService attachService;
	
	@RequestMapping(value = "/upload")
    @ResponseBody
    public ResponseItem uploadAttach(
            @RequestParam(value = "uploadFile",required=false) MultipartFile uploadFile,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        
        try {
        	//系统参数校验
        	if (uploadFile==null) {
        		logger.error("系统上传文件为空！");
        		return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "detail exception");
        	}
        	AttachPo currAttachPo=UploadUtil.uploadFile(uploadFile);
        	currAttachPo=attachService.save(currAttachPo);
        	ri.setData(currAttachPo);
            return ri;
        } catch (Exception e) {
            logger.error("detail exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "detail exception");
        }
    }
	@RequestMapping(value = "/delete")
    @ResponseBody
    public ResponseItem delete(
            @RequestParam(value = "uuid") String dictmanagerId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            AttachPo attachPo= attachService.findByUuid(dictmanagerId);
            if(attachPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "dictPo");
            }
            attachService.delete(attachPo.getId());
            return ri;
        } catch (Exception e) {
            logger.error("delete exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "delete exception");
        }
    }
}
