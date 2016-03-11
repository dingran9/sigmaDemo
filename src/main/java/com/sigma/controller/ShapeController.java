package com.sigma.controller;

import com.sigma.comm.Constants;
import com.sigma.node.NodeDirector;
import com.sigma.node.impl.DiseaseNodeBuilder;
import com.sigma.po.EdgePo;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.po.ShapePo;
import com.sigma.service.EdgeService;
import com.sigma.service.ExperimentalResultService;
import com.sigma.service.NodeService;
import com.sigma.service.ShapeService;
import com.sigma.util.ResponseCode;
import com.sigma.util.ResponseItem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/11/14.
 */
@Controller
@RequestMapping(value = "/shape")
public class ShapeController {

    private final Logger logger = LoggerFactory.getLogger(ShapeController.class);

    @Inject
    private ExperimentalResultService experimentalResultService;
    @Inject
    private NodeService nodeService;
    @Inject
    private EdgeService edgeService;
    @Inject
    private ShapeService shapeService;
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
            List<ShapePo> shapePos= shapeService.findAll();
            ri.setData(shapePos);
            return ri;
        } catch (Exception e) {
            logger.error("list exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "list exception");

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
            @RequestParam(value = "shapeName") String shapeName,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
            ShapePo shapePo=new ShapePo();
            shapePo.setName(shapeName);
            ri.setData(shapeService.save(shapePo));
            return ri;
        } catch (Exception e) {
            logger.error("add exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "add exception");
        }
    }
    /**
     * 根据疾病Id生成疾病节点以及节点关系
     * 	1、根据疾病查询实验结果记录
     * 	2、根据实验结果记录生成节点以及关系图
     * 	3、返回
     * @param shapeId
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/search")
    @ResponseBody
    public ResponseItem search(
            @RequestParam(value = "shapeId") String shapeId,
            HttpServletRequest request) throws Exception {
        ResponseItem ri = new ResponseItem();
        try {
        	/*
        	 * 1、根据疾病Id查找实验结果记录
        	 */
        	Long shapeIdLong=Long.parseLong(shapeId);
        	List<ExperimentalResultPo> exps=experimentalResultService.findByDiseaseId(shapeIdLong);
        	/*
        	 * 2、根据实验结果记录构造节点、节点关系
        	 */
        	//声明节点List
        	List<NodePo> nodeList=new ArrayList<NodePo>();
        	//声明Edgelist
        	List<EdgePo> edgeList=new ArrayList<EdgePo>();
        	NodePo diseaseNode=null;
            for (int i = 0; i < exps.size(); i++) {
            	ExperimentalResultPo experimentalResultPo=exps.get(i);
            	//生成疾病节点
            	if (i==0) {
            		diseaseNode=new NodeDirector().constructNode(new DiseaseNodeBuilder(experimentalResultPo));
            		nodeList.add(diseaseNode);
				}
            	//根据单条实验记录生成节点以及节点关系
        		Map<String, List> shapeElem=experimentalResultService.convertToNodes(experimentalResultPo, diseaseNode);
        		nodeList.addAll(shapeElem.get("nodeList"));
        		edgeList.addAll(shapeElem.get("edgeList"));
			}
        	
            Map<String,Object> data=new HashMap<>();
            data.put("edgePos",edgeList);
            data.put("nodePos",nodeList);
            ri.setData(data);
            return ri;
        } catch (Exception e) {
            logger.error("add exception:", e);
            return ResponseItem.responseWithName(ri, ResponseCode.SERVICE_ERROR.toString(), "add exception");
        }
    }
}
