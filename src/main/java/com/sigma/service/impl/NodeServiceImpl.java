package com.sigma.service.impl;

import com.sigma.dao.EdgeDao;
import com.sigma.dao.NodeDao;
import com.sigma.dao.ShapeDao;
import com.sigma.po.NodePo;
import com.sigma.po.ShapePo;
import com.sigma.service.NodeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
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
}
