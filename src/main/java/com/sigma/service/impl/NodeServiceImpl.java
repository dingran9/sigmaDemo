package com.sigma.service.impl;

import com.sigma.comm.Constants;
import com.sigma.dao.EdgeDao;
import com.sigma.dao.NodeDao;
import com.sigma.dao.ShapeDao;
import com.sigma.po.*;
import com.sigma.proxy.ProxyDictItem;
import com.sigma.service.DictItemService;
import com.sigma.service.DiseaseService;
import com.sigma.service.NodeService;
import com.sigma.util.UIDGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.xml.soap.Node;
import java.beans.Transient;
import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
@Service
public class NodeServiceImpl implements NodeService {

    private final Logger logger = LoggerFactory.getLogger(NodeServiceImpl.class);

    @Inject
    private EdgeDao edgeDao; 
    @Inject
    private ProxyDictItem proxyDictItem;
    @Inject
    private NodeDao nodeDao;
    @Inject
    private ShapeDao shapeDao;
    @Inject
    private DictItemService dictItemService;
    @Inject
    private DiseaseService diseaseService;

    @Override
    public NodePo findOne(Long id) {
        return nodeDao.findOne(id);
    }

    @Override
    public List<NodePo> findAll() {
        return (List<NodePo>) nodeDao.findAll();
    }

    @Override
    public List<NodePo> findByShapeId(Long shapeId) {
        return nodeDao.findByShapeId(shapeId);
    }

    @Override
    @Transactional
    public NodePo save(NodePo nodePo, ShapePo shapePo) {
        shapePo= shapeDao.save(shapePo);
        nodePo.setShapeId(shapePo.getId());
        return nodeDao.save(nodePo);
    }

    @Override
    public NodePo save(NodePo nodePo) {
        return nodeDao.save(nodePo);
    }

    @Override
    public void delete(Long id) {
        nodeDao.delete(id);
    }

    @Override
    public NodePo create(ExperimentalResultPo experimentalResultPo, String nodeType) {
        NodePo nodePo=new NodePo();
        DictItemPo dictItemPoColor= dictItemService.findByDictCodeAndItemName("nodeColor", nodeType);
        if(dictItemPoColor!=null){
            nodePo.setColor(dictItemPoColor.getValue());
        }
        DictItemPo dictItemPoSize= dictItemService.findByDictCodeAndItemName("nodeSize", nodeType);
        if(dictItemPoColor!=null){
            nodePo.setSize(Integer.parseInt(dictItemPoSize.getValue()));
        }
        nodePo.setShapeId(experimentalResultPo.getDiseaseId());
        nodePo.setPositionX((int) (Math.random() * 10));
        nodePo.setPositionY((int) (Math.random() * 10));
        nodePo.setUuid(UIDGenerator.getUUID());
        switch (nodeType){
	        case "intervention":
	            DictItemPo intervention = dictItemService.findByDictCodeAndItemValue(nodeType,experimentalResultPo.getIntervention());
	            if(intervention!=null){
	                nodePo.setLabel(intervention.getName());
	            }
	            return nodePo;
	        case "microorganism":
	            DictItemPo microorganism = dictItemService.findByDictCodeAndItemValue(nodeType,experimentalResultPo.getMicroorganism());
	            if(microorganism!=null){
	                nodePo.setLabel(microorganism.getName());
	            }
	            return nodePo;
	        case "physiological_process":
	            DictItemPo ppprocess = dictItemService.findByDictCodeAndItemValue(nodeType,experimentalResultPo.getPhysiologicalProcess());
	            if(ppprocess!=null){
	                nodePo.setLabel(ppprocess.getName());
	            }
	            return nodePo;
	        case "physiological_process_change":
	            DictItemPo p = dictItemService.findByDictCodeAndItemValue(nodeType,experimentalResultPo.getPhysiologicalProcessChange());
	            if(p!=null){
	                nodePo.setLabel(p.getName());
	            }
	            return nodePo;
	        default:
	            return nodePo;
        }
       /* DictItemPo dictItemPo = dictItemService.findByDictCodeAndItemName(nodeType, experimentalResultPo.getPhysiologicalProcess());
        if(dictItemPo!=null){
            nodePo.setLabel(dictItemPo.getName());
        }*/
//        return nodePo;
    }
    
    @Override
    public NodePo create(DiseasePo diseasePo) {
        NodePo nodePo=new NodePo();
        DictItemPo dictItemPoColor= dictItemService.findByDictCodeAndItemName("nodeColor", Constants.NODE_TYPE_DISEASE);
        if(dictItemPoColor!=null){
            nodePo.setColor(dictItemPoColor.getValue());
        }
        DictItemPo dictItemPoSize= dictItemService.findByDictCodeAndItemName("nodeSize", Constants.NODE_TYPE_DISEASE);
        if(dictItemPoColor!=null){
            nodePo.setSize(Integer.parseInt(dictItemPoSize.getValue()));
        }
        nodePo.setShapeId(diseasePo.getId());
        nodePo.setPositionX((int) (Math.random() * 10));
        nodePo.setPositionY((int) (Math.random() * 10));
        nodePo.setUuid(UIDGenerator.getUUID());
        nodePo.setLabel(diseasePo.getName());
        return nodePo;
    }

}
