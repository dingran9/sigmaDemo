package com.sigma.dao;

import com.sigma.po.DocumentPo;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2015/12/20.
 * 文献
 */
public interface DocumentDao  extends CrudRepository<DocumentPo, Long> {

    DocumentPo findByUuid(String uuid);
}
