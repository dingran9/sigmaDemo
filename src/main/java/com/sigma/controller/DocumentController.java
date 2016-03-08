package com.sigma.controller;

import com.sigma.po.DiseasePo;
import com.sigma.po.DocumentPo;
import com.sigma.service.DocumentService;
import com.sigma.util.ResponseCode;
import com.sigma.util.ResponseItem;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import javax.print.Doc;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */

@Controller
@RequestMapping(value = "/document")
public class DocumentController {


    private final Logger logger = LoggerFactory.getLogger(DocumentController.class);

    @Inject
    private DocumentService documentService;

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
            @RequestParam(value = "name") String name,
            @RequestParam(value = "firstAuthor") String firstAuthor ,
            @RequestParam(value = "correspondentAuthor") String correspondentAuthor ,
            @RequestParam(value = "publishDate") String publishDate ,
            @RequestParam(value = "entryType") String entryType ,
            @RequestParam(value = "impactFactors") String impactFactors ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DocumentPo documentPo=new DocumentPo();
            documentPo.setName(name);
            documentPo.setFirstAuthor(firstAuthor);
            documentPo.setCorrespondentAuthor(correspondentAuthor);
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");//小写的mm表示的是分钟
            documentPo.setPublishDate(sdf.parse(publishDate));
            documentPo.setEntryType(entryType);
            documentPo.setImpactFactors(impactFactors);
            ri.setData(documentService.save(documentPo));
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
            if(StringUtils.isNotBlank(name)){
                documentPo.setName(name);
            }
            if(StringUtils.isNotBlank(firstAuthor)){
                documentPo.setFirstAuthor(firstAuthor);
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
