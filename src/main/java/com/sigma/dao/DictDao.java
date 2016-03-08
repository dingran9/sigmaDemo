package com.sigma.dao;

import com.sigma.po.DictPo;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DictDao  extends CrudRepository<DictPo, Long> {

    DictPo findByUuid(String uuid);
}
