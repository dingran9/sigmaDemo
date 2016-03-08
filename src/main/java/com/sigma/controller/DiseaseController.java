package com.sigma.controller;

import com.sigma.po.DictItemPo;
import com.sigma.po.DiseaseAttachedPo;
import com.sigma.po.DiseasePo;
import com.sigma.po.DocumentPo;
import com.sigma.service.*;
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
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
@Controller
@RequestMapping(value = "/disease")
public class DiseaseController {
    private final Logger logger = LoggerFactory.getLogger(DictItemController.class);

    @Inject
    private DiseaseService diseaseService;
    @Inject
    private DiseaseAttachedService diseaseAttachedService;
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
            List<DiseasePo> diseasePos= diseaseService.findAll();
            ri.setData(diseasePos);
            return ri;
        } catch (Exception e) {
            logger.error("list exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "list exception");

        }
    }
    /**
     * 
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/findParents")
    @ResponseBody
    public ResponseItem findParents(HttpServletRequest request) throws Exception {

        ResponseItem ri = new ResponseItem();

        try {
            List<DiseasePo> diseasePos= diseaseService.findByParents();
            ri.setData(diseasePos);
            return ri;
        } catch (Exception e) {
            logger.error("list exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "list exception");

        }
    }
    /**
     *
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/findChildren")
    @ResponseBody
    public ResponseItem findChildren(HttpServletRequest request) throws Exception {

        ResponseItem ri = new ResponseItem();

        try {
            List<DiseasePo> diseasePos= diseaseService.findChildren();
            ri.setData(diseasePos);
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
            @RequestParam(value = "diseaseId") String diseaseId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DiseasePo diseasePo= diseaseService.findByUuid(diseaseId);
            if(diseasePo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "diseasePo");
            }
            diseasePo.setDiseaseAttachedPo(diseaseAttachedService.findByDiseaseId(diseasePo.getId()));
            ri.setData(diseasePo);
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
            @RequestParam(value = "category") String category,
            @RequestParam(value = "pathogeny") String pathogeny ,
            @RequestParam(value = "parentId",required = false) String parentId,
            @RequestParam(value = "change",required = false) String change,
            @RequestParam(value = "microbialChanges",required = false) String microbialChanges,
            @RequestParam(value = "relatedFamily",required = false) String relatedFamily,
            @RequestParam(value = "relatedNegativeFamily",required = false) String relatedNegativeFamily,
            @RequestParam(value = "relatedGenus",required = false) String relatedGenus,
            @RequestParam(value = "relatedNegativeGenus",required = false) String relatedNegativeGenus,
            @RequestParam(value = "pathogenMetabolites",required = false) String pathogenMetabolites ,
            @RequestParam(value = "physiologicalProcess",required = false) String physiologicalProcess ,
            @RequestParam(value = "researchMethod",required = false) String researchMethod ,
//            @RequestParam(value = "documentId",required = false) String documentId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DiseasePo diseasePo=new DiseasePo();
            diseasePo.setLevel(0);
            if(parentId!=null){
                DiseasePo fDiseasePo= diseaseService.findByUuid(parentId);
                if(fDiseasePo != null){
                    diseasePo.setParentDiseasePo(fDiseasePo);
                    diseasePo.setLevel(1);
                }
            }
            diseasePo.setName(name);
            diseasePo.setCategory(category);
            diseasePo.setPathogeny(pathogeny);
            DiseaseAttachedPo diseaseAttachedPo=new DiseaseAttachedPo();
            //文献不记录
//            if(documentId!=null){
//                DocumentPo documentPo= documentService.findByUuid(documentId);
//                if(documentPo != null){
//                    diseaseAttachedPo.setDocumentId(documentPo.getId());
//                }
//            }
            diseaseAttachedPo.setChange(change);
            diseaseAttachedPo.setMicrobialChanges(microbialChanges);
            diseaseAttachedPo.setRelatedFamily(relatedFamily);
            diseaseAttachedPo.setRelatedNegativeFamily(relatedNegativeFamily);
            diseaseAttachedPo.setRelatedGenus(relatedGenus);
            diseaseAttachedPo.setRelatedNegativeGenus(relatedNegativeGenus);
            diseaseAttachedPo.setPathogenMetabolites(pathogenMetabolites);
            diseaseAttachedPo.setPhysiologicalProcess(physiologicalProcess);
            diseaseAttachedPo.setResearchMethod(researchMethod);

            ri.setData(diseaseService.save(diseasePo,diseaseAttachedPo));
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
            @RequestParam(value = "diseaseId") String diseaseId,
            @RequestParam(value = "name",required = false) String name,
            @RequestParam(value = "category",required = false) String category,
            @RequestParam(value = "pathogeny",required = false) String pathogeny ,
            //父级疾病：此处应该是id ，但是目前输入内容为疾病name
            @RequestParam(value = "parentId",required = false) String parentId,
            @RequestParam(value = "change",required = false) String change,
            @RequestParam(value = "microbialChanges",required = false) String microbialChanges,
            @RequestParam(value = "relatedFamily",required = false) String relatedFamily,
            @RequestParam(value = "relatedNegativeFamily",required = false) String relatedNegativeFamily,
            @RequestParam(value = "relatedGenus",required = false) String relatedGenus,
            @RequestParam(value = "relatedNegativeGenus",required = false) String relatedNegativeGenus,
            @RequestParam(value = "pathogenMetabolites",required = false) String pathogenMetabolites ,
            @RequestParam(value = "physiologicalProcess",required = false) String physiologicalProcess ,
            @RequestParam(value = "researchMethod",required = false) String researchMethod ,
//            @RequestParam(value = "documentId",required = false) String documentId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DiseasePo diseasePo= diseaseService.findByUuid(diseaseId);
            if(diseasePo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "diseasePo");
            }
            if(StringUtils.isNotBlank(name)){
                diseasePo.setName(name);
            }
            if(StringUtils.isNotBlank(category)){
                diseasePo.setCategory(category);
            }
            if(StringUtils.isNotBlank(pathogeny)){
                diseasePo.setPathogeny(pathogeny);
            }
            if(parentId!=null){
                DiseasePo fDiseasePo= diseaseService.findByUuid(parentId);
//                DiseasePo parentDiseasePo= diseaseService.findByName(parentId);
                if(fDiseasePo != null){
                    diseasePo.setParentDiseasePo(fDiseasePo);
                    diseasePo.setLevel(1);
                }
            }
            DiseaseAttachedPo diseaseAttachedPo= diseaseAttachedService.findByDiseaseId(diseasePo.getId());
            if(diseaseAttachedPo==null){
                diseaseAttachedPo=new DiseaseAttachedPo();
                diseaseAttachedPo.setDiseaseId(diseasePo.getId());
            }

            if(StringUtils.isNotBlank(change)){
                diseaseAttachedPo.setChange(change);
            }
            if(StringUtils.isNotBlank(microbialChanges)){
                diseaseAttachedPo.setMicrobialChanges(microbialChanges);
            }
            if(StringUtils.isNotBlank(relatedFamily)){
                diseaseAttachedPo.setRelatedFamily(relatedFamily);
            }
            if(StringUtils.isNotBlank(relatedNegativeFamily)){
                diseaseAttachedPo.setRelatedNegativeFamily(relatedNegativeFamily);
            }
            if(StringUtils.isNotBlank(relatedGenus)){
                diseaseAttachedPo.setRelatedGenus(relatedGenus);
            }
            if(StringUtils.isNotBlank(relatedNegativeGenus)){
                diseaseAttachedPo.setRelatedNegativeGenus(relatedNegativeGenus);
            }
            if(StringUtils.isNotBlank(pathogenMetabolites)){
                diseaseAttachedPo.setPathogenMetabolites(pathogenMetabolites);
            }
            if(StringUtils.isNotBlank(physiologicalProcess)){
                diseaseAttachedPo.setPhysiologicalProcess(physiologicalProcess);
            }
            if(StringUtils.isNotBlank(researchMethod)){
                diseaseAttachedPo.setResearchMethod(researchMethod);
            }
//            if(documentId!=null){
//                DocumentPo documentPo= documentService.findByUuid(documentId);
//                if(documentPo != null){
//                    diseaseAttachedPo.setDocumentId(documentPo.getId());
//                }
//            }

            ri.setData(diseaseService.update(diseasePo,diseaseAttachedPo));
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
            @RequestParam(value = "diseaseId") String diseaseId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DiseasePo diseasePo= diseaseService.findByUuid(diseaseId);
            if(diseasePo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "diseasePo");
            }
            diseaseService.delete(diseasePo.getId());
            return ri;
        } catch (Exception e) {
            logger.error("delete exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "delete exception");
        }
    }
    /**
     * 搜索
     *
     * @return ResponseItem
     * @throws Exception
     */
    @RequestMapping(value = "/search")
    @ResponseBody
    public ResponseItem search(
    		@RequestParam(value = "keyWord") String keyWord,
    		HttpServletRequest request) throws Exception {
    	ResponseItem ri = new ResponseItem();
    	try {
    		List<DiseasePo> diseasePos= diseaseService.findByKeyWord(keyWord);
    		if(diseasePos== null){
    			return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "diseasePos");
    		}
    		ri.setDatas(diseasePos);
    		return ri;
    	} catch (Exception e) {
    		logger.error("search exception:", e);
    		return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "search exception");
    	}
    }
}
