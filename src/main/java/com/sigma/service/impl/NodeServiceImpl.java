package com.sigma.service.impl;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sigma.comm.Constants;
import com.sigma.dao.EdgeDao;
import com.sigma.dao.NodeDao;
import com.sigma.dao.ShapeDao;
import com.sigma.po.DictItemPo;
import com.sigma.po.DiseasePo;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.po.NodePo;
import com.sigma.po.ShapePo;
import com.sigma.proxy.ProxyDictItem;
import com.sigma.service.DictItemService;
import com.sigma.service.DiseaseService;
import com.sigma.service.NodeService;
import com.sigma.util.UIDGenerator;

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
    public NodePo create(Map<String, NodePo> nodesMap,ExperimentalResultPo experimentalResultPo, String nodeType) {
    	String nodeLabel="";
    	 //设置label显示
        switch (nodeType){
	        case "intervention":
	            DictItemPo intervention = dictItemService.findByDictCodeAndItemValue(nodeType,experimentalResultPo.getIntervention());
	            if(intervention!=null){
	                nodeLabel=intervention.getName();
	            }
	            break;
	        case "microorganism":
	            DictItemPo microorganism = dictItemService.findByDictCodeAndItemValue(nodeType,experimentalResultPo.getMicroorganism());
	            if(microorganism!=null){
	                nodeLabel=microorganism.getName();
	            }
	            break;
	        case "physiological_process":
	            DictItemPo ppprocess = dictItemService.findByDictCodeAndItemValue(nodeType,experimentalResultPo.getPhysiologicalProcess());
	            if(ppprocess!=null){
	                nodeLabel=ppprocess.getName();
	            }
	            break;
	        case "physiological_process_change":
	            DictItemPo p = dictItemService.findByDictCodeAndItemValue(nodeType,experimentalResultPo.getPhysiologicalProcessChange());
	            if(p!=null){
	                nodeLabel=p.getName();
	            }
	            break;
	        default:
	        	break;
        }
        NodePo nodePo=nodesMap.get(nodeLabel);
        if (nodePo==null) {
			nodePo=new NodePo();
			nodePo.setLabel(nodeLabel);
		}
        //节点颜色
        DictItemPo dictItemPoColor= dictItemService.findByDictCodeAndItemName("nodeColor", nodeType);
        if(dictItemPoColor!=null){
            nodePo.setColor(dictItemPoColor.getValue());
        }
        //节点大小
        DictItemPo dictItemPoSize= dictItemService.findByDictCodeAndItemName("nodeSize", nodeType);
        if(dictItemPoColor!=null){
            nodePo.setSize(Integer.parseInt(dictItemPoSize.getValue()));
        }
        nodePo.setShapeId(experimentalResultPo.getDiseaseId());
        nodePo.setPositionX((int) (Math.random() * 10));
        nodePo.setPositionY((int) (Math.random() * 10));
        nodePo.setUuid(UIDGenerator.getUUID());
        return nodePo;
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
