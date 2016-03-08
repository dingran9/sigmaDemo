package com.sigma.service.impl;

import com.sigma.dao.DictItemDao;
import com.sigma.po.DictItemPo;
import com.sigma.service.DictItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
@Service
public class DictItemServiceImpl implements DictItemService {

    private final Logger logger = LoggerFactory.getLogger(DictItemServiceImpl.class);

    @Inject
    private DictItemDao dictItemDao;

    @Override
    public DictItemPo findOne(Long id) {
        return dictItemDao.findOne(id);
    }

    @Override
    public DictItemPo findByUuid(String uuid) {
        return dictItemDao.findByUuid(uuid);
    }

    @Override
    public List<DictItemPo> findAll() {
        return (List<DictItemPo>) dictItemDao.findAll();
    }

    @Override
    public List<DictItemPo> findByDictId(Long dictId) {
        return dictItemDao.findByDictId(dictId);
    }

    @Override
    public DictItemPo save(DictItemPo dictItemPo) {
        return dictItemDao.save(dictItemPo);
    }

    @Override
    public void delete(Long id) {
        dictItemDao.delete(id);
    }
}
