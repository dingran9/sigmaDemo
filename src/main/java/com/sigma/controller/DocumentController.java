package com.sigma.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sigma.comm.Constants;
import com.sigma.po.AttachPo;
import com.sigma.po.DocumentPo;
import com.sigma.service.AttachService;
import com.sigma.service.DocumentService;
import com.sigma.util.ResponseCode;
import com.sigma.util.ResponseItem;
import com.sigma.util.StringHelper;
import com.sigma.util.UIDGenerator;

/**
 * Created by Administrator on 2015/12/20.
 */

@Controller
@RequestMapping(value = "/document")
public class DocumentController {


    private final Logger logger = LoggerFactory.getLogger(DocumentController.class);

    @Inject
    private DocumentService documentService;
    @Inject
    private AttachService attachService;

    /**
     * 查询
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    public ResponseItem list(HttpServletRequest request) throws Exception {

        ResponseItem ri = new ResponseItem();

        try {
            List<DocumentPo> documentPos= documentService.findAll();
            ri.setData(documentPos);
            return ri;
        } catch (Exception e) {
            logger.error("list exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "list exception");

        }
    }

    /**
     * 详情
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/detail")
    @ResponseBody
    public ResponseItem detail(
            @RequestParam(value = "documentId") String documentId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DocumentPo documentPo= documentService.findByUuid(documentId);
            if(documentPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "documentPo");
            }
            /*
             * 附件处理
             */
            //查询附件
            List<AttachPo> currAttachPos=attachService.findByObjId(documentPo.getUuid());
            //设置附件内容
            documentPo.setAttachPos(currAttachPos);
            ri.setData(documentPo);
            return ri;
        } catch (Exception e) {
            logger.error("detail exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "detail exception");
        }
    }
    /**
     * 新增
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/add")
    @ResponseBody
    public ResponseItem add(
            @RequestParam(value = "attachIds") String attachIds,
            @RequestParam(value = "name") String name,
            //文献来源：杂志名称
            @RequestParam(value = "magazine") String magazine,
            @RequestParam(value = "firstAuthor") String firstAuthor ,
            @RequestParam(value = "correspondentAuthor") String correspondentAuthor ,
            @RequestParam(value = "publishDate") String publishDate ,
            @RequestParam(value = "entryType") String entryType ,
            @RequestParam(value = "impactFactors") String impactFactors ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
        	//文献处理
            DocumentPo documentPo=new DocumentPo();
            documentPo.setName(name);
            documentPo.setFirstAuthor(firstAuthor);
            documentPo.setCorrespondentAuthor(correspondentAuthor);
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");//小写的mm表示的是分钟
            //发布日期空值判断
            if(!StringHelper.isEmpty(publishDate)){
            	documentPo.setPublishDate(sdf.parse(publishDate));
            }
            documentPo.setEntryType(entryType);
            //杂志
            documentPo.setMagazine(magazine);
            documentPo.setImpactFactors(impactFactors);
            documentPo.setUuid(UIDGenerator.getUUID());
            documentPo=documentService.save(documentPo);
            //附件更新处理：需要添加事务处理
            String attachIdArr[]=attachIds.split(",");
            for (String attachId : attachIdArr) {
				if (StringHelper.isEmpty(attachId)) {
					continue;
				}
				AttachPo currAttach=attachService.findByUuid(attachId);
				if (currAttach!=null) {
					//设置所属对象id
					currAttach.setObjId(documentPo.getUuid());
					//更新操作时间
					currAttach.setIssueDate(new Date());
					//设置附件类型
					currAttach.setObjType(Constants.ATTACH_TYPE_DOCUMENT);
					attachService.save(currAttach);
				}
			}
            ri.setData(documentPo);
            return ri;
        } catch (Exception e) {
            logger.error("add exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "add exception");
        }
    }

    /**
     * 修改
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/update")
    @ResponseBody
    public ResponseItem update(
            @RequestParam(value = "documentId") String documentId,
            @RequestParam(value = "name",required = false) String name,
            //杂志
            @RequestParam(value = "magazine",required = false) String magazine,
            //附件id
            @RequestParam(value = "attachIds",required = false) String attachIds,
            @RequestParam(value = "firstAuthor",required = false) String firstAuthor ,
            @RequestParam(value = "correspondentAuthor",required = false) String correspondentAuthor ,
            @RequestParam(value = "publishDate",required = false) String publishDate ,
            @RequestParam(value = "entryType",required = false) String entryType ,
            @RequestParam(value = "impactFactors",required = false) String impactFactors ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DocumentPo documentPo= documentService.findByUuid(documentId);
            if(documentPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "document");
            }
            //文章名字
            if(StringUtils.isNotBlank(name)){
                documentPo.setName(name);
            }
            //第一作者
            if(StringUtils.isNotBlank(firstAuthor)){
                documentPo.setFirstAuthor(firstAuthor);
            }
            //杂志
            if(StringUtils.isNotBlank(magazine)){
            	documentPo.setFirstAuthor(magazine);
            }
            if(StringUtils.isNotBlank(correspondentAuthor)){
                documentPo.setCorrespondentAuthor(correspondentAuthor);
            }
            if(StringUtils.isNotBlank(publishDate) ){
                SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");//小写的mm表示的是分钟
                documentPo.setPublishDate(sdf.parse(publishDate));
            }
            if(StringUtils.isNotBlank(entryType)){
                documentPo.setEntryType(entryType);
            }
            if(StringUtils.isNotBlank(impactFactors)){
                documentPo.setImpactFactors(impactFactors);
            }
            String attachIdArr[]=attachIds.split(",");
            for (String attachId : attachIdArr) {
				if (StringHelper.isEmpty(attachId)) {
					continue;
				}
				AttachPo currAttach=attachService.findByUuid(attachId);
				if (currAttach!=null) {
					currAttach.setObjId(documentPo.getUuid());
					//更新操作时间
					currAttach.setIssueDate(new Date());
					attachService.save(currAttach);
				}
			}
            ri.setData(documentService.save(documentPo));
            return ri;
        } catch (Exception e) {
            logger.error("update exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "update exception");
        }
    }
    /**
     * 删除
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/delete")
    @ResponseBody
    public ResponseItem delete(
            @RequestParam(value = "documentId") String documentId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DocumentPo documentPo= documentService.findByUuid(documentId);
            if(documentPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "document");
            }
            documentService.delete(documentPo.getId());
            return ri;
        } catch (Exception e) {
            logger.error("delete exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "delete exception");
        }
    }
}
