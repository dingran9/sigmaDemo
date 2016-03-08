package com.sigma.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.sigma.dao.AttachDao;
import com.sigma.po.AttachPo;
import com.sigma.service.AttachService;
import com.sigma.service.DictItemService;

/**
 * Created by Administrator on 2015/12/20.
 */
@Service
public class AttachServiceImpl implements AttachService {

    private final Logger logger = LoggerFactory.getLogger(AttachServiceImpl.class);

    @Inject
    private AttachDao attachDao;

    @Override
    public AttachPo findOne(Long id) {
        return attachDao.findOne(id);
    }

    @Override
    public List<AttachPo> findByObjId(String objId) {
        return attachDao.findByObjId(objId);
    }

    @Override
    public List<AttachPo> findAll() {
        return (List<AttachPo>) attachDao.findAll();
    }

    @Override
    public AttachPo save(AttachPo AttachPo) {
        return attachDao.save(AttachPo);
    }

    @Override
    public void delete(Long id) {
        attachDao.delete(id);
    }

	@Override
	public AttachPo findByUuid(String uuid) {
		return attachDao.findByUuid(uuid);
	}
}
