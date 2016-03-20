package com.sigma.controller;

import com.sigma.po.DiseasePo;
import com.sigma.po.DocumentPo;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.service.DiseaseService;
import com.sigma.service.ExperimentalResultService;
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
@RequestMapping(value = "/experimentalResult")
public class ExperimentalResultController {

    private final Logger logger = LoggerFactory.getLogger(DictItemController.class);

    @Inject
    private ExperimentalResultService experimentalResultService;

    @Inject
    private DiseaseService diseaseService;
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
            List<ExperimentalResultPo> experimentalResultPos= experimentalResultService.findAll();
            if (experimentalResultPos!=null&&experimentalResultPos.size()>0) {
            	for (ExperimentalResultPo experimentalResultPo : experimentalResultPos) {
            		if (experimentalResultPo==null) {
						continue;
					}
            		DiseasePo diseasePo=diseaseService.findOne(experimentalResultPo.getDiseaseId());
            		experimentalResultPo.setDiseasePo(diseasePo);
            	}
			}
            ri.setData(experimentalResultPos);
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
            @RequestParam(value = "experimentalId") String experimentalId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            ExperimentalResultPo experimentalResultPo= experimentalResultService.findByUuid(experimentalId);
            if(experimentalResultPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "documentPo");
            }
            if(experimentalResultPo.getDiseaseId()!=null){
                experimentalResultPo.setDiseasePo(diseaseService.findOne(experimentalResultPo.getDiseaseId()));
            }
            ri.setData(experimentalResultPo);
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
            @RequestParam(value = "type") Integer type,
            @RequestParam(value = "diseaseId") String diseaseId,
            //实验编码
            @RequestParam(value = "experimentalNum") String experimentalNum,
            @RequestParam(value = "interventionNote") String interventionNote,
            @RequestParam(value = "intervention") String intervention,
            @RequestParam(value = "interventionEffect") String interventionEffect,
            @RequestParam(value = "microorganism") String microorganism  ,
            @RequestParam(value = "strainVariation") String strainVariation  ,
            @RequestParam(value = "physiologicalProcess") String physiologicalProcess,
            @RequestParam(value = "physiologicalProcessChange") String physiologicalProcessChange  ,
            @RequestParam(value = "experimentType") Integer experimentType  ,
            @RequestParam(value = "hostName") String hostName  ,
            @RequestParam(value = "animalModel") String animalModel  ,
            @RequestParam(value = "documentId") String documentId  ,
            @RequestParam(value = "sourceElement") String sourceElement  ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            DiseasePo diseasePo= diseaseService.findByUuid(diseaseId);
            if(diseasePo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "疾病类型");
            }
            ExperimentalResultPo experimentalResultPo=new ExperimentalResultPo();
            //实验结果类型
            experimentalResultPo.setType(type);
            //疾病id
            experimentalResultPo.setDiseaseId(diseasePo.getId());
            //干预物
            experimentalResultPo.setIntervention(intervention);
            //干预物注释
            experimentalResultPo.setInterventionNote(interventionNote);
            //干预物影响
            experimentalResultPo.setInterventionEffect(interventionEffect);
            //微生物
            experimentalResultPo.setMicroorganism(microorganism);
            experimentalResultPo.setStrainVariation(strainVariation);
            //生理过程
            experimentalResultPo.setPhysiologicalProcess(physiologicalProcess);
            //生理过程变化
            experimentalResultPo.setPhysiologicalProcessChange(physiologicalProcessChange);
            //实验类型
            experimentalResultPo.setExperimentType(experimentType);
            //宿主
            experimentalResultPo.setHostName(hostName);
            //模型
            experimentalResultPo.setAnimalModel(animalModel);
            //实验编码
            experimentalResultPo.setExperimentalNum(experimentalNum);
            //设置文献id
            experimentalResultPo.setDocumentId(documentId);
            experimentalResultPo.setSourceElement(sourceElement);
            ri.setData(experimentalResultService.save(experimentalResultPo));
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
            @RequestParam(value = "experimentalId") String experimentalId,
            @RequestParam(value = "type") Integer type,
            @RequestParam(value = "diseaseId") String diseaseId,
            //实验编码
            @RequestParam(value = "experimentalNum") String experimentalNum,
            @RequestParam(value = "intervention") String intervention,
            @RequestParam(value = "interventionEffect") String interventionEffect,
            @RequestParam(value = "microorganism") String microorganism  ,
            @RequestParam(value = "strainVariation") String strainVariation  ,
            @RequestParam(value = "physiologicalProcess") String physiologicalProcess,
            @RequestParam(value = "physiologicalProcessChange") String physiologicalProcessChange  ,
            @RequestParam(value = "experimentType") Integer experimentType  ,
            @RequestParam(value = "hostName") String hostName  ,
            @RequestParam(value = "animalModel") String animalModel  ,
            @RequestParam(value = "sourceElement") String sourceElement  ,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            ExperimentalResultPo experimentalResultPo= experimentalResultService.findByUuid(experimentalId);
            if(experimentalResultPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "experimentalResultPo");
            }
            if(type!=null){
                experimentalResultPo.setType(type);
            }
            if(StringUtils.isNotBlank(diseaseId)){
                DiseasePo diseasePo= diseaseService.findByUuid(diseaseId);
                if(diseasePo!= null){
                    experimentalResultPo.setDiseaseId(diseasePo.getId());
                }
            }
            //干预物
            if(StringUtils.isNotBlank(intervention)){
                experimentalResultPo.setIntervention(intervention);
            }
            //干预物影响
            if(StringUtils.isNotBlank(interventionEffect)){
                experimentalResultPo.setInterventionEffect(interventionEffect);
            }
            //微生物
            if(StringUtils.isNotBlank(microorganism)){
                experimentalResultPo.setMicroorganism(microorganism);
            }
            //菌种变化
            if(StringUtils.isNotBlank(strainVariation)){
                experimentalResultPo.setStrainVariation(strainVariation);
            }
            //生理过程
            if(StringUtils.isNotBlank(physiologicalProcess)){
                experimentalResultPo.setPhysiologicalProcess(physiologicalProcess);
            }
            //生理过程变化
            if(StringUtils.isNotBlank(physiologicalProcessChange)){
                experimentalResultPo.setPhysiologicalProcessChange(physiologicalProcessChange);
            }
            //实验类型
            if(null!=experimentType){
                experimentalResultPo.setExperimentType(experimentType);
            }
            //宿主
            if(StringUtils.isNotBlank(hostName)){
                experimentalResultPo.setHostName(hostName);
            }
            //实验编码
            if(StringUtils.isNotBlank(experimentalNum)){
            	experimentalResultPo.setExperimentalNum(experimentalNum);
            }
            //实验模型：人类/动物
            if(StringUtils.isNotBlank(animalModel)){
                experimentalResultPo.setAnimalModel(animalModel);
            }
            if(StringUtils.isNotBlank(sourceElement)){
                experimentalResultPo.setSourceElement(sourceElement);
            }
            ri.setData(experimentalResultService.save(experimentalResultPo));
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
            @RequestParam(value = "experimentalId") String experimentalId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            ExperimentalResultPo experimentalResultPo= experimentalResultService.findByUuid(experimentalId);
            if(experimentalResultPo== null){
                return ResponseItem.responseWithName(ri, ResponseCode.RESOURCE_NOTFOUND.toString(), "experimentalResultPo");
            }
            experimentalResultService.delete(experimentalResultPo.getId());
            return ri;
        } catch (Exception e) {
            logger.error("delete exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "delete exception");
        }
    }
}
