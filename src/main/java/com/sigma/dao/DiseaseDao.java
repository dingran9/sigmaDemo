package com.sigma.dao;

import com.sigma.po.DiseasePo;
import com.sigma.po.DocumentPo;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DiseaseDao  extends CrudRepository<DiseasePo, Long> {

    DiseasePo findByUuid(String uuid);
}
