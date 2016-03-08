package com.sigma.service.impl;

import com.sigma.dao.ShapeDao;
import com.sigma.po.ShapePo;
import com.sigma.service.ShapeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Administrator on 2015/11/14.
 */
@Service
public class ShapeServiceImpl implements ShapeService {


    private final Logger logger = LoggerFactory.getLogger(NodeServiceImpl.class);

    @Inject
    private ShapeDao shapeDao;


    @Override
    public ShapePo findOne(Long id) {
        return shapeDao.findOne(id);
    }

    @Override
    public List<ShapePo> findAll() {
        return (List<ShapePo>) shapeDao.findAll();
    }

    @Override
    public ShapePo save(ShapePo shapePo) {
        return shapeDao.save(shapePo);
    }

    @Override
    public void delete(Long id) {
        shapeDao.delete(id);
    }
}
