package com.sigma.dao;

import com.sigma.po.DiseaseAttachedPo;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DiseaseAttachedDao  extends CrudRepository<DiseaseAttachedPo, Long> {

    DiseaseAttachedPo findByDocumentId(Long id);
    
    @Query("select d from DiseaseAttachedPo d where d.diseaseId=?")
    DiseaseAttachedPo findByDiseaseId(Long id);

    @Modifying
    @Query("delete from DiseaseAttachedPo d where d.diseaseId=?1")
    void deleteByDiseaseId(Long id);
}
