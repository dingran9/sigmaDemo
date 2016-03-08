package com.sigma.service.impl;

import com.sigma.dao.DiseaseAttachedDao;
import com.sigma.dao.DiseaseDao;
import com.sigma.po.DiseaseAttachedPo;
import com.sigma.po.DiseasePo;
import com.sigma.service.DiseaseAttachedService;
import com.sigma.service.DiseaseService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
@Service
public class DiseaseServiceImpl implements DiseaseService {
    private final Logger logger = LoggerFactory.getLogger(DiseaseServiceImpl.class);

    @Inject
    private DiseaseDao diseaseDao;
    @Inject
    private DiseaseAttachedService diseaseAttachedService;
    @Override
    public DiseasePo findOne(Long id) {
        return diseaseDao.findOne(id);
    }

    @Override
    public DiseasePo findByUuid(String uuid) {
        return diseaseDao.findByUuid(uuid);
    }

    @Override
    public List<DiseasePo> findAll() {
        return (List<DiseasePo>) diseaseDao.findAll();
    }

    @Override
    public DiseasePo save(DiseasePo diseasePo) {
        return diseaseDao.save(diseasePo);
    }

    @Override
    @Transactional
    public DiseasePo save(DiseasePo diseasePo, DiseaseAttachedPo diseaseAttachedPo) {
        diseasePo=diseaseDao.save(diseasePo);
        diseaseAttachedPo.setDiseaseId(diseasePo.getId());
        diseaseAttachedService.save(diseaseAttachedPo);
        return diseasePo;
    }

    @Override
    @Transactional
    public DiseasePo update(DiseasePo diseasePo, DiseaseAttachedPo diseaseAttachedPo) {
        diseaseAttachedService.save(diseaseAttachedPo);
        return  diseaseDao.save(diseasePo);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        diseaseAttachedService.deleteByDiseaseId(id);
        diseaseDao.delete(id);
    }

	@Override
	public DiseasePo findByName(String diseaseName) {
		return diseaseDao.findByName(diseaseName);
	}

	@Override
	public List<DiseasePo> findByParents() {
		return diseaseDao.findByParents();
	}

    @Override
    public List<DiseasePo> findChildren() {
        return diseaseDao.findChildren();
    }

	@Override
	/**
	 * 根据关键字查询疾病列表
	 * 	当前测试为默认疾病名称
	 */
	public List<DiseasePo> findByKeyWord(String keyWord) {
		// TODO Auto-generated method stub
		return diseaseDao.findByLikeName("%"+keyWord+"%");
	}
}
