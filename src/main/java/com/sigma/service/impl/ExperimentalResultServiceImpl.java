package com.sigma.service.impl;

import com.sigma.dao.ExperimentalResultDao;
import com.sigma.po.ExperimentalResultPo;
import com.sigma.service.ExperimentalResultService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
@Service
public class ExperimentalResultServiceImpl implements ExperimentalResultService {
    private final Logger logger = LoggerFactory.getLogger(ExperimentalResultServiceImpl.class);

    @Inject
    private ExperimentalResultDao experimentalResultDao;

    @Override
    public ExperimentalResultPo findOne(Long id) {
        return experimentalResultDao.findOne(id);
    }

    @Override
    public ExperimentalResultPo findByUuid(String uuid) {
        return experimentalResultDao.findByUuid(uuid);
    }

    @Override
    public List<ExperimentalResultPo> findAll() {
        return (List<ExperimentalResultPo>) experimentalResultDao.findAll();
    }

    @Override
    public ExperimentalResultPo save(ExperimentalResultPo experimentalResultPo) {
        return experimentalResultDao.save(experimentalResultPo);
    }

    @Override
    public void delete(Long id) {
        experimentalResultDao.delete(id);
    }
}
