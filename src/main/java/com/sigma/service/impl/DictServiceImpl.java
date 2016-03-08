package com.sigma.service.impl;

import com.sigma.dao.DictDao;
import com.sigma.po.DictPo;
import com.sigma.service.DictService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
@Service
public class DictServiceImpl implements DictService {
    private final Logger logger = LoggerFactory.getLogger(DictServiceImpl.class);

    @Inject
    private DictDao dictDao;

    @Override
    public DictPo findOne(Long id) {
        return dictDao.findOne(id);
    }

    @Override
    public DictPo findByUuid(String uuid) {
        return dictDao.findByUuid(uuid);
    }

    @Override
    public List<DictPo> findAll() {
        return (List<DictPo>) dictDao.findAll();
    }

    @Override
    public DictPo save(DictPo dictPo) {
        return dictDao.save(dictPo);
    }

    @Override
    public void delete(Long id) {
        dictDao.delete(id);
    }
}
