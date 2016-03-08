package com.sigma.dao;


import java.util.List;

import com.sigma.po.DiseasePo;
import com.sigma.po.DocumentPo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2015/12/20.
 */
public interface DiseaseDao  extends CrudRepository<DiseasePo, Long> {
	/**
	 * 根据疾病名称查找
	 * @param name
	 * @return
	 */
	DiseasePo findByName(String name);
	/**
	 * 根据id查找
	 * @param uuid
	 * @return
	 */
    DiseasePo findByUuid(String uuid);
    
    @Query("select d from DiseasePo d where d.level =0 ")
    List<DiseasePo> findByParents();

    @Query("select d from DiseasePo d where d.level =1 ")
    List<DiseasePo> findChildren();
    
    @Query("select d from DiseasePo d where d.name like ?1")
    List<DiseasePo> findByLikeName(String diseaseName);
}
