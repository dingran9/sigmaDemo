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
        DictItemPo dictItemPoColor= dictItemService.findByDictCodeAndItemValue("nodeColor", nodeType);
        if(dictItemPoColor!=null){
            nodePo.setColor(dictItemPoColor.getValue());
        }
        DictItemPo dictItemPoSize= dictItemService.findByDictCodeAndItemValue("nodeSize", nodeType);
        if(dictItemPoColor!=null){
            nodePo.setSize(Integer.parseInt(dictItemPoSize.getValue()));
        }
        nodePo.setShapeId(experimentalResultPo.getDiseaseId());
        nodePo.setPositionX((int) (Math.random() * 10));
        nodePo.setPositionY((int) (Math.random() * 10));
        nodePo.setUuid(UIDGenerator.getUUID());
        DictItemPo dictItemPo = ProxyDictItem.getDictItem(nodeType, experimentalResultPo.getPhysiologicalProcess());
        if(dictItemPo!=null){
            nodePo.setLabel(dictItemPo.getName());
        }
        return nodePo;
    }
    @Override
    public NodePo create(DiseasePo diseasePo) {
        NodePo nodePo=new NodePo();
        DictItemPo dictItemPoColor= dictItemService.findByDictCodeAndItemValue("nodeColor", Constants.NODE_TYPE_DISEASE);
        if(dictItemPoColor!=null){
            nodePo.setColor(dictItemPoColor.getValue());
        }
        DictItemPo dictItemPoSize= dictItemService.findByDictCodeAndItemValue("nodeSize", Constants.NODE_TYPE_DISEASE);
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
