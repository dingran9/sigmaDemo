package com.sigma.service.impl;

import com.sigma.dao.DiseaseAttachedDao;
import com.sigma.po.DiseaseAttachedPo;
import com.sigma.service.DiseaseAttachedService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
@Service
public class DiseaseAttachedServiceImpl implements DiseaseAttachedService {
    private final Logger logger = LoggerFactory.getLogger(DiseaseAttachedServiceImpl.class);

    @Inject
    private DiseaseAttachedDao diseaseAttachedDao;

    @Override
    public DiseaseAttachedPo findOne(Long id) {
        return diseaseAttachedDao.findOne(id);
    }

    @Override
    public DiseaseAttachedPo findByDiseaseId(Long id) {
        return diseaseAttachedDao.findByDocumentId(id);
    }

    @Override
    public List<DiseaseAttachedPo> findAll() {
        return (List<DiseaseAttachedPo>) diseaseAttachedDao.findAll();
    }

    @Override
    public DiseaseAttachedPo save(DiseaseAttachedPo diseaseAttached) {
        return diseaseAttachedDao.save(diseaseAttached);
    }

    @Override
    public void delete(Long id) {
        diseaseAttachedDao.delete(id);
    }

    @Override
    public void deleteByDiseaseId(Long id) {
        diseaseAttachedDao.deleteByDiseaseId(id);
    }
}
