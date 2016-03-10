package com.sigma.dao;

import com.sigma.po.DictItemPo;
import com.sigma.po.DiseaseAttachedPo;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DictItemDao  extends CrudRepository<DictItemPo, Long> {

    DictItemPo findByUuid(String uuid);

    @Query("select d from  DictItemPo  d where d.dictPo.id=?1")
    List<DictItemPo> findByDictId(Long id);

    @Query("select d from DictItemPo d where d.dictPo.id=?1 and d.value=?2")
    DictItemPo findByDictIdAndItemValue(Long dictId,String value);


    @Query("select d from DictItemPo d,DictPo di where di.code=?1 and d.dictPo.id=di.id and d.value=?2")
    DictItemPo findByDictCodeAndItemValue(String dictCode,String value);
}
