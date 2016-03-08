package com.sigma.service.impl;

import com.sigma.dao.DocumentDao;
import com.sigma.po.DocumentPo;
import com.sigma.service.DocumentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
@Service
public class DocumentServiceImpl implements DocumentService {
    private final Logger logger = LoggerFactory.getLogger(DocumentServiceImpl.class);

    @Inject
    private DocumentDao documentDao;

    @Override
    public DocumentPo findOne(Long id) {
        return documentDao.findOne(id);
    }

    @Override
    public DocumentPo findByUuid(String uuid) {
        return documentDao.findByUuid(uuid);
    }

    @Override
    public List<DocumentPo> findAll() {
        return (List<DocumentPo>) documentDao.findAll();
    }

    @Override
    public DocumentPo save(DocumentPo documentPo) {
        return documentDao.save(documentPo);
    }

    @Override
    public void delete(Long id) {
        documentDao.delete(id);
    }
}
