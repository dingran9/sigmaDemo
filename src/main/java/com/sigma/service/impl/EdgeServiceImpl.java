package com.sigma.service.impl;

import com.sigma.dao.EdgeDao;
import com.sigma.dao.NodeDao;
import com.sigma.po.EdgePo;
import com.sigma.service.EdgeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
@Service
public class EdgeServiceImpl implements EdgeService {

    private final Logger logger = LoggerFactory.getLogger(EdgeServiceImpl.class);

    @Inject
    private EdgeDao edgeDao;

    @Inject
    private NodeDao nodeDao;

    @Override
    public EdgePo findOne(Long id) {
        return edgeDao.findOne(id);
    }

    @Override
    public List<EdgePo> findAll() {
        return (List<EdgePo>) edgeDao.findAll();
    }

    @Override
    public List<EdgePo> findByShapeId(Long shapeId) {
        return edgeDao.findByShapeId(shapeId);
    }

    @Override
    public EdgePo save(EdgePo edgePo) {
        return edgeDao.save(edgePo);
    }

    @Override
    public void delete(Long id) {
        edgeDao.delete(id);
    }
}
